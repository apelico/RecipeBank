package server

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//Takes in the ENV key name and either pulls the string from the local .env file or from the webhosting .env
func goDotEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load(".env")

	if err != nil {
		log.Println("Error loading .env file")
	}

	return os.Getenv(key)
}

//Reusable Database/Collection connection function.
//Takes in the database name and collection name then attemps to connect to MongoDB's database.
func ConnectDB(databaseName string, collectionName string) mongo.Collection {
	connectionString := goDotEnvVariable("DB_URI")
	dbName := databaseName
	collName := collectionName

	clientOptions := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connection to " + databaseName + " " + collectionName)

	collection := client.Database(dbName).Collection(collName)

	return *collection
}
