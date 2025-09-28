package controller

import (
	"PingMe/Auth/config"
	"PingMe/Auth/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	var users []model.User
	if err := config.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// buat slice baru cuma ID & Username
	type SimpleUser struct {
		ID       uint   `json:"id"`
		Username string `json:"username"`
	}

	simpleUsers := make([]SimpleUser, len(users))
	for i, u := range users {
		simpleUsers[i] = SimpleUser{
			ID:       u.ID,
			Username: u.Username,
		}
	}

	c.JSON(http.StatusOK, simpleUsers)
}
