package server

import (
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"strings"

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

	//fs := http.FileServer(http.Dir("./build/"))
	var frontend fs.FS = os.DirFS("build/")
	httpFS := http.FS(frontend)
	fileServer := http.FileServer(httpFS)
	serveIndex := serveFileContents("index.html", httpFS)
	router.PathPrefix("/").Handler(intercept404(fileServer, serveIndex))

	return router
}

func ServeFile(w http.ResponseWriter, r *http.Request) {
	fmt.Print("H")
	http.FileServer(http.Dir("./build/")).ServeHTTP(w, r)
}

type hookedResponseWriter struct {
	http.ResponseWriter
	got404 bool
}

func (hrw *hookedResponseWriter) WriteHeader(status int) {
	if status == http.StatusNotFound {
		// Don't actually write the 404 header, just set a flag.
		hrw.got404 = true
	} else {
		hrw.ResponseWriter.WriteHeader(status)
	}
}

func (hrw *hookedResponseWriter) Write(p []byte) (int, error) {
	if hrw.got404 {
		// No-op, but pretend that we wrote len(p) bytes to the writer.
		return len(p), nil
	}

	return hrw.ResponseWriter.Write(p)
}

func intercept404(handler, on404 http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hookedWriter := &hookedResponseWriter{ResponseWriter: w}
		handler.ServeHTTP(hookedWriter, r)

		if hookedWriter.got404 {
			on404.ServeHTTP(w, r)
		}
	})
}

func serveFileContents(file string, files http.FileSystem) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Restrict only to instances where the browser is looking for an HTML file
		if !strings.Contains(r.Header.Get("Accept"), "text/html") {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprint(w, "404 not found")

			return
		}

		// Open the file and return its contents using http.ServeContent
		index, err := files.Open(file)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "%s not found", file)

			return
		}

		fi, err := index.Stat()
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "%s not found", file)

			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		http.ServeContent(w, r, fi.Name(), fi.ModTime(), index)
	}
}
