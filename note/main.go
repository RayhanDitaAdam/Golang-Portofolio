package main

import (
	"Note/config"
	"Note/models"
	"Note/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	models.AutoMigrate()
	r := gin.Default()
	routes.AllRoutes(r)
	r.Run(":7001")
}