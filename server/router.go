package server

import (
	"net/http"

	"github.com/gorilla/mux"
)

//Handles all of the API calls.
func Router2() *http.ServeMux {
	mux := http.NewServeMux()

	//mux.Handle("/", http.FileServer(http.Dir("./build/index.html")))

	/*mux.HandleFunc("/api/registerUser", RegisterUser)
	mux.HandleFunc("/api/getAllUsers", GetAllUsers)
	mux.HandleFunc("/api/getUser", GetUser)
	mux.HandleFunc("/api/login", Login)
	mux.HandleFunc("/api/logout", Logout)
	mux.HandleFunc("/api/getTokenData", GetTokenData)

	mux.HandleFunc("/api/createRecipe", CreateRecipe)
	mux.HandleFunc("/api/getUserRecipes", GetUserRecipes)
	mux.HandleFunc("/api/getRecipe", GetRecipe)*/
	//mux.HandleFunc("/api/getAllRecipes", GetRecipes)

	/*mux.HandleFunc("/api/addTodo", middleware.AddTodo)
	mux.HandleFunc("/api/getTodoList", middleware.GetTodoList)
	mux.HandleFunc("/api/updateTodo", middleware.UpdateTodo)
	mux.HandleFunc("/api/deleteTodo", middleware.DeleteTodo)
	mux.HandleFunc("/api/getCurrentWeatherData", weather.GetCurrentWeatherData)*/

	return mux
}

//Handles all of the API calls.
func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/api/registerUser", RegisterUser)
	router.HandleFunc("/api/getAllUsers", GetAllUsers)
	router.HandleFunc("/api/getUser", GetUser)
	router.HandleFunc("/api/login", Login)
	router.HandleFunc("/api/logout", Logout)
	router.HandleFunc("/api/getTokenData", GetTokenData).Methods("POST")

	router.HandleFunc("/api/createRecipe", CreateRecipe)
	router.HandleFunc("/api/updateRecipe", UpdateRecipe)
	router.HandleFunc("/api/getAllRecipes", GetRecipes)
	router.HandleFunc("/api/getUserRecipes", GetUserRecipes)
	router.HandleFunc("/api/getRecipe", GetRecipe)

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./build/"))).Methods("GET")
	return router
}
