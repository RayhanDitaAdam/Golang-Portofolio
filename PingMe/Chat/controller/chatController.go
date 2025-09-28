package controller

import (
	"context"
	"log"
	"net/http"
	"time"

	chatConfig "PingMe/Chat/config"    // MongoDB config
	chatModel "PingMe/Chat/model"       // Chat model

	authConfig "PingMe/Auth/config"     // Postgres config
	authModel "PingMe/Auth/model"       // User model

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan chatModel.Chat, 100)

// ---------------- WebSocket ----------------
func WebSocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()
	clients[conn] = true

	for {
		var chat chatModel.Chat
		if err := conn.ReadJSON(&chat); err != nil {
			delete(clients, conn)
			break
		}

		chat.CreatedAt = time.Now().Unix()
		collection := chatConfig.MongoDB.Collection("chats")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		res, err := collection.InsertOne(ctx, chat)
		if err != nil {
			log.Println("Insert chat error:", err)
			continue
		}
		chat.ID = res.InsertedID.(primitive.ObjectID)
		broadcast <- chat
	}
}

func HandleMessages() {
    for {
        chat := <-broadcast
        for client := range clients {
            if err := client.WriteJSON(chat); err != nil {
                client.Close()
                delete(clients, client)
            }
        }
    }
}

// ---------------- CRUD Chat ----------------
func CreateChat(c *gin.Context) {
	username := c.GetString("username") // ambil username dari middleware
	var chat chatModel.Chat

	// Bind JSON dari request
	if err := c.ShouldBindJSON(&chat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Set sender ID dan timestamp
	chat.SenderID = getUserID(username)
	chat.CreatedAt = time.Now().Unix()

	// Insert ke MongoDB
	collection := chatConfig.MongoDB.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := collection.InsertOne(ctx, chat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create chat"})
		return
	}
	chat.ID = res.InsertedID.(primitive.ObjectID)

	// Ambil username sender & receiver dari Postgres
	var sender, receiver authModel.User
	authConfig.DB.First(&sender, chat.SenderID)
	authConfig.DB.First(&receiver, chat.ReceiverID)

	// Buat ChatResponse
	chatResp := chatModel.ChatResponse{
		ID:               chat.ID,
		SenderID:         chat.SenderID,
		SenderUsername:   sender.Username,
		ReceiverID:       chat.ReceiverID,
		ReceiverUsername: receiver.Username,
		Message:          chat.Message,
		CreatedAt:        chat.CreatedAt,
	}

	// Broadcast ke semua WebSocket client
	broadcast <- chat

	// Return response ke client yang POST
	c.JSON(http.StatusOK, chatResp)
}

func GetChats(c *gin.Context) {
	username := c.GetString("username")
	userID := getUserID(username)

	collection := chatConfig.MongoDB.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"$or": []bson.M{
		{"sender_id": userID},
		{"receiver_id": userID},
	}}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chats"})
		return
	}
	defer cursor.Close(ctx)

	var chats []chatModel.Chat
	if err := cursor.All(ctx, &chats); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read chats"})
		return
	}

	// Mapping ke ChatResponse biar ada username
	var chatsResp []chatModel.ChatResponse
	for _, chat := range chats {
		var sender, receiver authModel.User
		authConfig.DB.First(&sender, chat.SenderID)
		authConfig.DB.First(&receiver, chat.ReceiverID)

		chatsResp = append(chatsResp, chatModel.ChatResponse{
			ID:               chat.ID,
			SenderID:         chat.SenderID,
			SenderUsername:   sender.Username,
			ReceiverID:       chat.ReceiverID,
			ReceiverUsername: receiver.Username,
			Message:          chat.Message,
			CreatedAt:        chat.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, chatsResp)
}

func UpdateChat(c *gin.Context) {
	username := c.GetString("username")
	userID := getUserID(username)
	id := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var update chatModel.Chat
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	collection := chatConfig.MongoDB.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res := collection.FindOneAndUpdate(
		ctx,
		bson.M{"_id": oid, "sender_id": userID},
		bson.M{"$set": bson.M{"message": update.Message}},
	)
	if res.Err() != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot update this chat"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

func DeleteChat(c *gin.Context) {
	username := c.GetString("username")
	userID := getUserID(username)
	id := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	collection := chatConfig.MongoDB.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := collection.DeleteOne(ctx, bson.M{"_id": oid, "sender_id": userID})
	if err != nil || res.DeletedCount == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot delete this chat"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

// ---------------- Helper ----------------
func getUserID(username string) uint {
	var user authModel.User
	authConfig.DB.Where("username = ?", username).First(&user)
	return user.ID
}
