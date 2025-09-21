package models

import (
	"time"
	"todo/config"

	"gorm.io/gorm"
)

type Status string

const (
	Failed     Status = "Failed"
	Pending    Status = "Pending"
	InProgress Status = "InProgress"
	Success    Status = "Success"
)

type Todo struct {
	gorm.Model
	Title  string `json:"judul" binding:"required"`
	Desc   string `json:"deskripsi"`
	Timestamp time.Time`json:"Tanggal"`
	Status Status `json:"status" gorm:"default:Pending"`
	UserID uint `json:"user_id"`
}

func AutoMigrate() {
	config.DB.AutoMigrate(&Todo{})
}
