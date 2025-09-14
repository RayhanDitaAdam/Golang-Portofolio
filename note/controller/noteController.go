package controller

import (
	"Note/config"
	"Note/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)


func GetAllNotes(c *gin.Context) {
	var notes []models.Note
	config.DB.Find(&notes)
	c.JSON(http.StatusOK, notes)
}

func CreateNote(c *gin.Context) {
	var note models.Note
	if err := config.DB.Create(&note).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message" : "Berhasil membuat catatan", "note" : note})
}

func UpdateNote(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var note models.Note
	if err := config.DB.First(&note, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error" : "Catatan tidak di temukan"})
		return
	}
	var input models.Note
	if err := config.DB.Updates(&note).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}
	note.Title = input.Title
	note.Desc = input.Desc
	config.DB.Save(&note)
	c.JSON(http.StatusOK, gin.H{"message" : "Berhasil update note", "note" : note})
}

func DeleteNote(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var note models.Note
	if err := config.DB.First(&note, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error" : "Catatan tidak di temukan"})
		return
	}
	if err := config.DB.Delete(&note, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message" : "Berhasil menghapus catatan"})
}