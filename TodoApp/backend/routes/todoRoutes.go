package routes

import (
	"todo/controller"
	"todo/middleware"

	"github.com/gin-gonic/gin"
)

func TodoRoutes(r *gin.Engine) {
	r.POST("/register", controller.Register)
	r.POST("/login", controller.Login)
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.GET("/todos", controller.GetAllTodo)
		auth.GET("/todos/my", controller.GetMyTodos)
		auth.POST("/todo", controller.CreateTodo)
		auth.PUT("/todo/:id/status", controller.UpdateStatus)
		auth.PUT("/todo/:id/update", controller.UpdateTodo)
		auth.DELETE("/todo/:id/delete", controller.DeleteTodo)
	}
}