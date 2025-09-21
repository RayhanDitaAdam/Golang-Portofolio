package controller

import (
	"net/http"
	"todo/config"
	"todo/models"
	"todo/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Register(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}
	var existingUser models.User
	if err := config.DB.Where("username = ?", input.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Username already taken"})
		return
	}
	hashPw, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}

	user := models.User{
		Username: input.Username,
		Password: string(hashPw),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message" : "User registered successfully"})

}

func Login (c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid Input"})
		return
	}
	var user models.User
	if err := config.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error" : "User not found"})
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error" : err.Error()})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error" : "Password incorrect"})
		return
	}

	 token, err := utils.GenerateToken(user.ID, user.Username); 
	 if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : "Failed create token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message" : "Login Success", "user" : user, "token" : token})
}