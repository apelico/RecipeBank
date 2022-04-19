package server

import (
	"net/http"

	"github.com/gorilla/mux"
)

//Handles all of the API calls.
func Router2() *http.ServeMux {
	mux := http.NewServeMux()

	mux.Handle("/", http.FileServer(http.Dir("./build")))

	mux.HandleFunc("/api/registerUser", RegisterUser)
	mux.HandleFunc("/api/getAllUsers", GetAllUsers)
	mux.HandleFunc("/api/getUser", GetUser)
	mux.HandleFunc("/api/login", Login)
	mux.HandleFunc("/api/logout", Logout)
	mux.HandleFunc("/api/getTokenData", GetTokenData)

	mux.HandleFunc("/api/createRecipe", CreateRecipe)
	mux.HandleFunc("/api/getRecipes", GetRecipes)
	mux.HandleFunc("/api/getUserRecipes", GetUserRecipes)
	mux.HandleFunc("/api/getRecipe", GetRecipe)

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

	router.Handle("/", http.FileServer(http.Dir("./build")))

	router.HandleFunc("/api/registerUser", RegisterUser)
	router.HandleFunc("/api/getAllUsers", GetAllUsers)
	router.HandleFunc("/api/getUser", GetUser)
	router.HandleFunc("/api/login", Login)
	router.HandleFunc("/api/logout", Logout)
	router.HandleFunc("/api/getTokenData", GetTokenData).Methods("POST")

	router.HandleFunc("/api/createRecipe", CreateRecipe)
	router.HandleFunc("/api/getAllRecipes", GetRecipes).Methods("GET")
	router.HandleFunc("/api/getUserRecipes", GetUserRecipes)
	router.HandleFunc("/api/getRecipe", GetRecipe)
	return router
}
