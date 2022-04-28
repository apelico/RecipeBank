package server

import (
	"context"
	"crypto/rand"
	"encoding/base32"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"recipe-bank-server/server/models"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var RecipeDB mongo.Collection = ConnectDB(goDotEnvVariable("RECIPE_DB_NAME"), goDotEnvVariable("RECIPE_Collection_NAME"))

func GetRecipe(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)

	type Search struct {
		UserOwner string `bson:"userOwner" json:"userOwner"`
		ID        string `bson:"id" json:"id"`
	}

	var search Search
	json.Unmarshal([]byte(body), &search)

	var recipe models.Recipe
	filter := bson.M{"userOwner": search.UserOwner, "id": search.ID}

	RecipeDB.FindOne(context.TODO(), filter).Decode(&recipe)

	json.NewEncoder(w).Encode(recipe)

}

func GetRecipes(w http.ResponseWriter, r *http.Request) {

	//Gets all recipes in the RecipeDB and sets to a cursor.
	var recipes []models.Recipe

	//Finds all recipes in DB that are using the new format
	cursor, err := RecipeDB.Find(context.TODO(), bson.M{"new": true})
	if err != nil {
		fmt.Println(err)
	}

	//Decodes all data from the cursor into an array that can be returned.
	if err = cursor.All(context.TODO(), &recipes); err != nil {
		fmt.Println(err)
	}

	//Returns all users in RecipeDB
	json.NewEncoder(w).Encode(recipes)
}

func GetUserRecipes(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)

	var user models.User
	json.Unmarshal([]byte(body), &user)
	user.Username = strings.ToLower(user.Username)

	//Gets all recipes in the RecipeDB and sets to a cursor.
	var recipes []models.Recipe

	filter := bson.M{"userOwner": user.Username}

	//Finds all recipes in DB that are using the new format
	cursor, err := RecipeDB.Find(context.TODO(), filter)
	if err != nil {
		fmt.Println(err)
	}

	//Decodes all data from the cursor into an array that can be returned.
	if err = cursor.All(context.TODO(), &recipes); err != nil {
		fmt.Println(err)
	}

	//Returns all users in RecipeDB
	json.NewEncoder(w).Encode(recipes)
}

func CreateRecipe(w http.ResponseWriter, r *http.Request) {
	tokenCookie, _ := r.Cookie("token")

	if tokenCookie == nil {
		//Token was null. Return "Invalid"
		json.NewEncoder(w).Encode("Invalid")
		return
	}

	//Decodes the Hex Token Cookie
	token, _ := hex.DecodeString(tokenCookie.Value)
	//Decrypts the Token
	var decryptedToken = decrypt(token, goDotEnvVariable("ENCRYPTION_KEY"))

	//Validates Token and returns UserClaim
	var user models.UserClaims
	json.Unmarshal([]byte(ValidateToken(string(decryptedToken))), &user)

	if user.Username == "" {
		//Token was invalid or expired. Return "Invalid"
		json.NewEncoder(w).Encode("Invalid")
		return
	}

	//Reads in data from request
	body, _ := io.ReadAll(r.Body)

	//Converts data to Recipe Model
	var recipe models.Recipe
	json.Unmarshal([]byte(body), &recipe)

	//Sets recipe userowner to jwt username
	recipe.UserOwner = user.Username
	recipe.New = true

	recipe.ID = getToken(32)

	RecipeDB.InsertOne(context.TODO(), recipe)

	json.NewEncoder(w).Encode("OK")
}

func UpdateRecipe(w http.ResponseWriter, r *http.Request) {
	tokenCookie, _ := r.Cookie("token")

	if tokenCookie == nil {
		//Token was null. Return "Invalid"
		json.NewEncoder(w).Encode("Invalid")
		return
	}

	//Decodes the Hex Token Cookie
	token, _ := hex.DecodeString(tokenCookie.Value)
	//Decrypts the Token
	var decryptedToken = decrypt(token, goDotEnvVariable("ENCRYPTION_KEY"))

	//Validates Token and returns UserClaim
	var user models.UserClaims
	json.Unmarshal([]byte(ValidateToken(string(decryptedToken))), &user)

	if user.Username == "" {
		//Token was invalid or expired. Return "Invalid"
		json.NewEncoder(w).Encode("Invalid")
		return
	}

	//Reads in data from request
	body, _ := io.ReadAll(r.Body)

	//Converts data to Recipe Model
	var recipe models.Recipe
	json.Unmarshal([]byte(body), &recipe)

	if user.Username != recipe.UserOwner {
		//UserToken does not much recipe UserOwner. To prevent another user from possibly updating another user's recipe.
		json.NewEncoder(w).Encode("Invalid")
		return
	}

	//Search through the recipe database for recipe ID and also for userowner.
	filter := bson.M{"userOwner": user.Username, "id": recipe.ID}

	//Updates the recipe
	RecipeDB.UpdateOne(context.TODO(), filter, bson.D{{"$set", recipe}})

	json.NewEncoder(w).Encode("OK")
}

func getToken(length int) string {
	randomBytes := make([]byte, 32)
	_, err := rand.Read(randomBytes)
	if err != nil {
		fmt.Println(err)
	}
	return base32.StdEncoding.EncodeToString(randomBytes)[:length]
}
