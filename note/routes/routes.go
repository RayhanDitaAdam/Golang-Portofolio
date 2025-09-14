package routes

import (
	"Note/controller"

	"github.com/gin-gonic/gin"
)

func AllRoutes(r *gin.Engine) {
	api := r.Group("/")
	{
		api.GET("/notes", controller.GetAllNotes)
		api.POST("/note", controller.CreateNote)
		api.PUT("/note/:id", controller.UpdateNote)
		api.DELETE("/note/:id", controller.DeleteNote)
	}
}