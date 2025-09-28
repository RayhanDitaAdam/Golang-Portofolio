package main

import (
	"PingMe/Auth/config"
	"PingMe/Auth/model"
	"PingMe/Auth/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.DatabaseAuthPingMe()
	model.MigrateUserModels()
	r := gin.Default()
	 r.Use(cors.New(cors.Config{
        AllowAllOrigins:  true,                     // izinkan semua origin
        AllowMethods:     []string{"GET","POST","PUT","DELETE","OPTIONS"},
        AllowHeaders:     []string{"*"},            // izinkan semua header
        AllowCredentials: true,
    }))
	routes.AuthRoutes(r)
	r.Run(":7004")
} 