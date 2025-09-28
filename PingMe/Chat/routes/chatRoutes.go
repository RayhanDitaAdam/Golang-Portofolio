package routes

import (
	"PingMe/Auth/middleware"
	"PingMe/Chat/controller"
	
	"github.com/gin-gonic/gin"
)

func ChatRoutes(r *gin.Engine) {
	api := r.Group("/chat")
	api.Use(middleware.AuthMiddleware()) // pastikan user login
	{
		api.POST("", controller.CreateChat)         // Create chat
		api.GET("", controller.GetChats)           // Read all chat
		api.PUT("/:id", controller.UpdateChat)      // Update chat by ID
		api.DELETE("/:id", controller.DeleteChat)   // Delete chat by ID
	}
	// WebSocket endpoint, juga butuh auth
	r.GET("/ws", middleware.AuthMiddleware(), controller.WebSocketHandler)
}
