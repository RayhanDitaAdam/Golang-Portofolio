package controller

import (
	"net/http"
	"strconv"
	"time"
	"todo/config"
	"todo/models"
	"todo/utils"

	"github.com/gin-gonic/gin"
)

func GetAllTodo(c *gin.Context) {
	var todo []models.Todo
	if err := config.DB.Find(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	c.JSON(http.StatusOK, todo)
}

func GetMyTodos(c *gin.Context) {
	var todos []models.Todo
	userID := c.MustGet("userID").(uint)
	if err := config.DB.Where("user_id", userID).Find(&todos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"todos" : todos})
}
func CreateTodo(c *gin.Context) {
	var input models.Todo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Ambil userID dari context
	userID, ok := c.MustGet("userID").(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Kalau deskripsi kosong → generate pake AI
	desc := input.Desc
	if desc == "" {
		generated, err := utils.GenerateDescription(input.Title)
		if err != nil {
			// kalau AI gagal, fallback ke default
			desc = "Tidak ada deskripsi (AI gagal generate)"
		} else {
			desc = generated
		}
	}

	todo := models.Todo{
		Title:  input.Title,
		Desc:   desc,
		Status: input.Status,
		UserID: userID,
		Timestamp : time.Now(),
	}

	if err := config.DB.Create(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Berhasil menambah todo",
		"todo":    todo,
	})
}

type updateStatus struct {
	Status models.Status `json:"status" binding:"required"`
}
func UpdateStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var todo models.Todo
	if err := config.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error" : "Todo tidak di temukan"})
		return
	}

	var input updateStatus
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}

	if input.Status != models.Pending && input.Status != models.InProgress && input.Status != models.Failed && input.Status != models.Success {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status must be Pending, InProgress, Success, or Failed"})
		return
	}
	todo.Status = input.Status
	if err := config.DB.Save(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message" : "Berhasil update status", "title" : todo.Title, "status" : todo.Status})
}

func UpdateTodo (c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var todo models.Todo
	if err := config.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error" : "Todo not found"})
		return
	}
	var input models.Todo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}
	if err := config.DB.Updates(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	desc := input.Desc
	if desc == "" {
		generated, err := utils.GenerateDescription(input.Title)
		if err != nil {
			// kalau AI gagal, fallback ke default
			desc = "Tidak ada deskripsi (AI gagal generate)"
		} else {
			desc = generated
		}
	}
	if input.Timestamp.IsZero() {
    todo.Timestamp = time.Now()
} else {
    todo.Timestamp = input.Timestamp
}
	todo.Title = input.Title
	todo.Desc = desc
	if err := config.DB.Save(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return 
	}
	c.JSON(http.StatusOK, gin.H{"message" : "Completed update todo", "todo" : todo})
}

func DeleteTodo(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var todo models.Todo
	if err := config.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error" : "Todo tidak di temukan"})
		return
	}
	if err := config.DB.Delete(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error})
		return
	}
	c.JSON(http.StatusOK, gin.H{"error" : "Berhasil menghapus catatan"})
}