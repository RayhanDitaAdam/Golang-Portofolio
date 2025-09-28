package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Chat struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	SenderID   uint               `bson:"sender_id" json:"sender_id"`
	ReceiverID uint               `bson:"receiver_id" json:"receiver_id"`
	Message    string             `bson:"message" json:"message"`
	CreatedAt  int64              `bson:"created_at" json:"created_at"`
}

type ChatResponse struct {
	ID               primitive.ObjectID `json:"id"`
	SenderID         uint               `json:"sender_id"`
	SenderUsername   string             `json:"sender_username"`
	ReceiverID       uint               `json:"receiver_id"`
	ReceiverUsername string             `json:"receiver_username"`
	Message          string             `json:"message"`
	CreatedAt        int64              `json:"created_at"`
}
