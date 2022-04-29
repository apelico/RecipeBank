package server

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"recipe-bank-server/server/models"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var UserDB mongo.Collection = ConnectDB(goDotEnvVariable("ACCOUNT_DB_NAME"), goDotEnvVariable("ACCOUNT_Collection_NAME"))

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)

	//decode post request data from byte to user struct
	var user models.User
	json.Unmarshal([]byte(body), &user)
	user.Username = strings.ToLower(user.Username)

	//Manually sets the users role as "user" incase registration does not contain.
	user.Role = "user"

	//Encrypt user password
	user.Password = string(encrypt([]byte(user.Password), goDotEnvVariable("ENCRYPTION_KEY")))

	filter := bson.M{"username": user.Username}

	//Checks database and pulls any records with the email already in use.
	var res map[string]interface{}
	UserDB.FindOne(context.TODO(), filter).Decode(&res)

	//If email already exists return Already Exists error code
	if res != nil {
		json.NewEncoder(w).Encode("Already Exists")
		return
	}

	//Inserts new user
	UserDB.InsertOne(context.TODO(), user)

	//Created user and return 201-created success code
	json.NewEncoder(w).Encode("OK")
}

func Login(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)

	//decode post request data from byte to user struct
	var user models.User
	json.Unmarshal([]byte(body), &user)
	user.Username = strings.ToLower(user.Username)

	filter := bson.M{"username": user.Username}

	//Finds existing user with username.
	var res models.User
	UserDB.FindOne(context.TODO(), filter).Decode(&res)

	if (res == models.User{}) {
		//User does not exists. return Invalid User error code.
		json.NewEncoder(w).Encode("Invalid User")
		return
	}

	//Decrypts the user's password from the database.
	var password = string(decrypt([]byte(res.Password), goDotEnvVariable("ENCRYPTION_KEY")))

	//If passwords do match, create a token for the user that contains a JWT token signed with the user's Email and Firstname.
	if password == user.Password {
		var expirationTime = time.Now().Add(120 * time.Minute)

		var userClaim = models.UserClaims{Username: res.Username, FirstName: res.FirstName}
		var token = SignClaim(userClaim, expirationTime.Unix())
		var encryptedToken = encrypt([]byte(token), goDotEnvVariable("ENCRYPTION_KEY"))

		var hexToken = hex.EncodeToString(encryptedToken)
		cookie := http.Cookie{
			Name:     "token",
			Value:    hexToken,
			HttpOnly: true,
			Path:     "/",
			Expires:  expirationTime,
		}

		//Set cookie and return 200-ok success code
		http.SetCookie(w, &cookie)

		//Gets info from token and returns
		json.NewEncoder(w).Encode(string(res.Username))
	} else {
		//Password did not match. Send Incorrect Password code
		json.NewEncoder(w).Encode("Incorrect Password")
		return
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	//Nulls out the jwt cookie.
	cookie := http.Cookie{
		Name:     "token",
		Value:    "",
		HttpOnly: true,
		Path:     "/",
		Expires:  time.Now(),
	}
	http.SetCookie(w, &cookie)
}

func GetTokenData(w http.ResponseWriter, r *http.Request) {
	//Takes in the requester's HTTP cookie named Token
	tokenCookie, _ := r.Cookie("token")

	if tokenCookie == nil {
		//Token was null. Return "Invalid"
		json.NewEncoder(w).Encode("Invalid")
		return
	}

	//Decodes the cookie from a hex to a string
	token, _ := hex.DecodeString(tokenCookie.Value)
	//Decrypts the token
	var decryptedToken = decrypt(token, goDotEnvVariable("ENCRYPTION_KEY"))

	//Checks to make sure the token is valid and not expired and gets token data.
	var data models.UserClaims
	json.Unmarshal([]byte(ValidateToken(string(decryptedToken))), &data)

	//returns the token's data firstname
	if data.FirstName != "" {
		json.NewEncoder(w).Encode(string(data.Username))
		return
	}

	//returns "Invalid" for bad tokin
	json.NewEncoder(w).Encode("Invalid")
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	//Sets database find options to not return the password or Mongo's _ID
	opts := options.Find().SetProjection(bson.D{{"password", 0}, {"_id", 0}})

	//Gets all users in the UserDB and sets to a cursor.
	cursor, err := UserDB.Find(context.TODO(), bson.M{}, opts)
	if err != nil {
		fmt.Println(err)
	}

	//Decodes all data from the cursor into an array that can be returned.
	var data []bson.M
	if err = cursor.All(context.TODO(), &data); err != nil {
		fmt.Println(err)
	}

	//Returns all users in UserDB
	json.NewEncoder(w).Encode(data)

}

func GetUser(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)

	//decode post request data from byte to user struct
	var user models.User
	json.Unmarshal([]byte(body), &user)
	user.Username = strings.ToLower(user.Username)

	opts := options.FindOne().SetProjection(bson.D{{"password", 0}, {"_id", 0}, {"role", 0}, {"email", 0}})
	filter := bson.M{"username": user.Username}

	//Finds existing user with username.
	var res models.User
	UserDB.FindOne(context.TODO(), filter, opts).Decode(&res)

	if (res == models.User{}) {
		//User does not exists. return Invalid User error code.
		json.NewEncoder(w).Encode("Invalid User")
		return
	}

	json.NewEncoder(w).Encode(res)
}
