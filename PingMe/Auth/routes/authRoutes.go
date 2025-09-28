package routes

import (
	"PingMe/Auth/controller"
	"PingMe/Auth/middleware"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {
	r.POST("/register", controller.Register)
	r.POST("/login", controller.Login)
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.GET("/users", controller.GetUsers)
	}
}