package server

import (
	"encoding/hex"
	"encoding/json"
	"net/http"
	"recipe-bank-server/server/models"

	"github.com/dgrijalva/jwt-go"
)

//Takes in a model UserClaim and signs it as a JWT token and returns as a string.
func SignClaim(claims models.UserClaims, time int64) string {
	mySigningKey := []byte(goDotEnvVariable("TOKEN_KEY"))

	claims.StandardClaims = jwt.StandardClaims{
		ExpiresAt: time,
		Issuer:    "Austin",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, _ := token.SignedString(mySigningKey)

	return signedToken
}

//Takes in a JWT token string and returns the claim only if it is not expired or invalid.
func ValidateToken(data string) string {
	var claim models.UserClaims

	token, _ := jwt.ParseWithClaims(data, &claim, func(token *jwt.Token) (interface{}, error) {
		return []byte(goDotEnvVariable("TOKEN_KEY")), nil
	})

	if _, ok := token.Claims.(*models.UserClaims); ok && token.Valid {
		//only return the claims FirstName if token is valid
		b, _ := json.Marshal(claim)
		return string(b)
	} else {
		return "Invalid"
	}
}

//Takes in a cookie that contains a JWT token and makes sure it is not expired and if it is valid.
//If the token is valid, function will return OK code.
//If token is invalid or expired, function will return NO Error code.
func ValidateCooke(tokenCookie http.Cookie) string {
	token, _ := hex.DecodeString(tokenCookie.Value)
	var decryptedToken = decrypt(token, goDotEnvVariable("ENCRYPTION_KEY"))

	var data = ValidateToken(string(decryptedToken))

	//CookieToken was invalid or expired
	if data == "Invalid" {
		return "Invalid"
	}

	//CookieToken was valid
	return "OK"
}
