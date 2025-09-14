package config

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB
func ConnectDatabase() {
	connect := "host=localhost user=sigma password=sigma123 dbname=NoteAuth2 sslmode=disable"
	database, err := gorm.Open(postgres.Open(connect), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal terhubung dengan database", err)
	}
	DB = database
}