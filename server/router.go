package server

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

//Handles all of the API calls.
func Router() *mux.Router {

	router := mux.NewRouter()

	api := router.PathPrefix("/api").Subrouter()

	api.HandleFunc("/registerUser", RegisterUser)
	api.HandleFunc("/getAllUsers", GetAllUsers)
	api.HandleFunc("/getUser", GetUser)
	api.HandleFunc("/login", Login)
	api.HandleFunc("/logout", Logout)
	api.HandleFunc("/getTokenData", GetTokenData).Methods("POST")

	api.HandleFunc("/createRecipe", CreateRecipe)
	api.HandleFunc("/updateRecipe", UpdateRecipe)
	api.HandleFunc("/getAllRecipes", GetRecipes)
	api.HandleFunc("/getUserRecipes", GetUserRecipes)
	api.HandleFunc("/getRecipe", GetRecipe)

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./build/")))

	return router
}

func ServeFile(w http.ResponseWriter, r *http.Request) {
	fmt.Print("H")
	http.FileServer(http.Dir("./build/")).ServeHTTP(w, r)
}
