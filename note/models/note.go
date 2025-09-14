package models

import (
	"Note/config"

	"gorm.io/gorm"
)

type Note struct {
	gorm.Model
	Title string `json:"Judul" binding:"required"`
	Desc string `json:"Deskripsi" binding:"required"`
}

func AutoMigrate() {
	config.DB.AutoMigrate(&Note{})
}