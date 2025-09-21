package main

import (
	"todo/config"
	"todo/models"
	"todo/routes"
	"todo/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func main() {
	config.ConnectDatabase()
	models.AutoMigrate()
	models.AutoMigrateUser()
	utils.InitAI()

	r := gin.Default()

	// Allow semua origin
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true, // <--- ini buat allow semua
		AllowMethods:    []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:    []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:   []string{"Content-Length"},
		MaxAge:          12 * time.Hour,
	}))

	routes.TodoRoutes(r)

	r.Run(":7002")
}
