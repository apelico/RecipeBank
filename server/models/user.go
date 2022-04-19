package models

type User struct {
	FirstName string `bson:"firstName" json:"firstName"`
	LastName  string `bson:"lastName" json:"lastName"`
	Username  string `bson:"username" json:"username"`
	Email     string `bson:"email,omitempty" json:"email,omitempty"`
	Password  string `bson:"password,omitempty" json:"password,omitempty"`
	Role      string `bson:"role,omitempty" json:"role,omitempty"`
}
