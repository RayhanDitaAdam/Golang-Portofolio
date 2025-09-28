package controller

import (
	"PingMe/Auth/config"
	"PingMe/Auth/model"
	"PingMe/Auth/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var input model.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}
	var existingUser model.User
	if err := config.DB.Where("username = ?", &input.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Username sudah di gunakan"})
		return
	}
	hashPw, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : "Gagal enkripsi password"})
		return
	}
	input.Password = string(hashPw)
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message" : "Berhasil login", "user" : gin.H{"username" : input.Username}})
}

func Login(c *gin.Context) {
	var input model.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}
	var user model.User
	if err := config.DB.Where("username = ?", &input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error" : "User tidak di temukan"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error" : "Password salah"})
		return
	}
	token, err := utils.GenerateToken(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : "token invlid"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message" : "Berhasil login", "user" : gin.H{"username" : input.Username}, "token" : token, "ID" : user.ID})
}