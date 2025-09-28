package model

import (
	"PingMe/Auth/config"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"Username" gorm:"binding:required"`
	Password string `json:"Password" gorm:"binding:required"`
}

func MigrateUserModels() {
	config.DB.AutoMigrate(&User{})
}
