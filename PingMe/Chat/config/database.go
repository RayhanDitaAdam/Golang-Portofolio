package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var MongoDB *mongo.Database

func ConnectWithMongoDB() {
	// ganti sesuai URL Mongo lo
	uri := "mongodb://localhost:27017"


	// set opsi
	clientOptions := options.Client().ApplyURI(uri)

	// connect dengan timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Error connect MongoDB:", err)
	}

	// cek koneksi
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB tidak bisa di-ping:", err)
	}

	fmt.Println("✅ Connected to MongoDB!")

	// assign ke variabel global
	MongoClient = client
	MongoDB = client.Database("chat") // ganti sesuai DB
}
