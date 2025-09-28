package main

import (
	authConfig "PingMe/Auth/config"
	ChatConfig "PingMe/Chat/config"
	"PingMe/Chat/controller"
	"PingMe/Chat/routes"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect MongoDB
	ChatConfig.ConnectWithMongoDB()

	// Connect Postgres
	authConfig.DatabaseAuthPingMe()
	go controller.HandleMessages()
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // React/Next dev server
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Register routes
	routes.ChatRoutes(r)

	log.Println("Server running on :8080")
	r.Run(":8080")
}
