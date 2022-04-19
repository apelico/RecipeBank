package models

type Recipe struct {
	New          bool          `bson:"new" json:"new"`
	ID           string        `bson:"id" json:"id"`
	UserOwner    string        `bson:"userOwner" json:"userOwner"`
	RecipeName   string        `bson:"recipeName" json:"recipeName"`
	Ingredients  []Ingredients `bson:"ingredients" json:"ingredients"`
	Instructions []string      `bson:"instructions" json:"instructions"`
}

type Ingredients struct {
	IngredientName   string `bson:"ingredientName" json:"ingredientName"`
	IngredientAmount string `bson:"ingredientAmount" json:"ingredientAmount"`
}
