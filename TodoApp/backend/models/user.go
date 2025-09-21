package models

import (
		"gorm.io/gorm"
		"todo/config"
)

type User struct {
	gorm.Model
	Username string `json:"Username" binding:"required" gorm:"unique"`
	Password string `json:"Password" binding:"required"`
	Todos []Todo `json:"Todos" gorm:"foreginKey:UserID"`
}

func AutoMigrateUser() {
	config.DB.AutoMigrate(&User{})
}
