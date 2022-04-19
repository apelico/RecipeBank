package models

import "github.com/dgrijalva/jwt-go"

type UserClaims struct {
	Email     string `bson:"email,omitempty"`
	FirstName string `bson:"firstName,omitempty"`
	Username  string `bson:"username,omitempty"`
	jwt.StandardClaims
}
