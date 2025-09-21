package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtkey = []byte("anjay")

type Claims struct {
	UserID uint `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GenerateToken(userID uint, username string) (string, error) {
	expiredAt := time.Now().Add(24 * time.Hour)
	jwtToken := &Claims{
		UserID: userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiredAt),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtToken)
	return token.SignedString(jwtkey)
}

func ValidateToken(tokenstring string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(
		tokenstring,
		&Claims{},
		func (token *jwt.Token) (interface{}, error) {
			return jwtkey, nil
		},
	) 
	if claims, ok := token.Claims.(*Claims); ok && token.Valid{
		return claims, nil
	}
	return nil, err
}