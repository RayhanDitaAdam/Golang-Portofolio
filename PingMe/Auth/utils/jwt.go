package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var JwtKey = []byte("SecretKey")
type Claims struct {
	Username string `json:"username" gorm:"binding:required"`
	jwt.RegisteredClaims
}
func GenerateToken(username string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, err
}
