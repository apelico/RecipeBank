package main

import (
	"log"
	"net/http"
	"os"
	router "recipe-bank-server/server"
)

func main() {
	port := os.Getenv("PORT")
	defaultPort := "8080"
	http.Handle("/", http.FileServer(http.Dir("./build")))

	if !(port == "") {
		log.Fatal(http.ListenAndServe(":"+port, router.Router()))
	} else {
		log.Fatal(http.ListenAndServe("localhost:"+defaultPort, router.Router()))
	}
}
