package config

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DatabaseAuthPingMe() {
	connect := "host=localhost user=sigma password=sigma123 dbname=authpingme sslmode=disable"
	database, err := gorm.Open(postgres.Open(connect), &gorm.Config{})
	if err != nil {
		log.Fatal("Auth database gagal terhubung karena ", err)
	}
	DB = database
}