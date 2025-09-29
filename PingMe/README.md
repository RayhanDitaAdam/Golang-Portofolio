# PingMe

PingMe adalah aplikasi chat real-time yang dibangun dengan Go, menggunakan arsitektur microservices dengan WebSocket untuk komunikasi real-time.

## 🚀 Fitur

- **Autentikasi User**: Registrasi dan login dengan JWT token
- **Real-time Chat**: Komunikasi real-time menggunakan WebSocket
- **CRUD Operations**: Create, Read, Update, Delete pesan chat
- **Dual Database**: PostgreSQL untuk user management, MongoDB untuk chat storage
- **CORS Support**: Cross-origin resource sharing untuk frontend integration
- **Secure Authentication**: Password hashing dengan bcrypt

## 🏗️ Arsitektur

Aplikasi ini menggunakan arsitektur microservices dengan 2 service utama:

### Auth Service (Port 7004)
- **Database**: PostgreSQL dengan GORM
- **Fungsi**: User registration, login, JWT token management
- **Endpoints**: `/register`, `/login`

### Chat Service (Port 8080)
- **Database**: MongoDB untuk menyimpan pesan chat
- **Fungsi**: Real-time messaging, chat CRUD operations
- **WebSocket**: Real-time communication
- **Endpoints**: `/ws`, `/chats`, `/chats/:id`

## 📋 Prerequisites

Pastikan Anda telah menginstall:

- Go 1.25.1 atau lebih tinggi
- PostgreSQL
- MongoDB
- Git

## ⚙️ Installation

1. **Clone repository**
```bash
git clone https://github.com/rayhanditaadam/goalng-portofolio
cd PingMe
```

2. **Install dependencies**
```bash
go mod download
```

3. **Setup Database**

**PostgreSQL Setup:**
- Buat database untuk auth service
- Update konfigurasi database di `Auth/config/database.go`

**MongoDB Setup:**
- Pastikan MongoDB service berjalan
- Update konfigurasi di `Chat/config/database.go`

4. **Environment Configuration**
Sesuaikan konfigurasi database dan JWT secret di file konfigurasi masing-masing service.

## 🚀 Running the Application

### Menjalankan Auth Service
```bash
cd Auth
go run main.go
```
Auth service akan berjalan di `http://localhost:7004`

### Menjalankan Chat Service
```bash
cd Chat
go run main.go
```
Chat service akan berjalan di `http://localhost:8080`

## 📡 API Endpoints

### Auth Service (Port 7004)

#### POST /register
Registrasi user baru
```json
{
  "Username": "john_doe",
  "Password": "password123"
}
```

#### POST /login
Login user
```json
{
  "Username": "john_doe",
  "Password": "password123"
}
```

**Response:**
```json
{
  "message": "Berhasil login",
  "user": {
    "username": "john_doe"
  },
  "token": "jwt_token_here",
  "ID": 1
}
```

### Chat Service (Port 8080)

#### WebSocket /ws
Real-time chat connection
```javascript
const ws = new WebSocket('ws://localhost:8080/ws');
```

#### GET /chats
Mendapatkan semua chat user (memerlukan JWT token)

#### POST /chats
Membuat pesan chat baru (memerlukan JWT token)
```json
{
  "receiver_id": 2,
  "message": "Hello there!"
}
```

#### PUT /chats/:id
Update pesan chat (hanya sender yang bisa update)

#### DELETE /chats/:id
Hapus pesan chat (hanya sender yang bisa hapus)

## 🔒 Authentication

Aplikasi menggunakan JWT (JSON Web Token) untuk autentikasi:

1. User melakukan login melalui Auth Service
2. Server mengembalikan JWT token
3. Token digunakan untuk mengakses Chat Service endpoints
4. Token dikirim melalui Authorization header: `Bearer <token>`

## 🗄️ Database Schema

### PostgreSQL (Users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### MongoDB (Chats)
```javascript
{
  _id: ObjectId,
  sender_id: Number,
  receiver_id: Number,
  message: String,
  created_at: Number (Unix timestamp)
}
```

## 🔧 Dependencies

### Main Dependencies
- **Gin**: Web framework untuk Go
- **GORM**: ORM untuk PostgreSQL
- **MongoDB Driver**: Driver resmi MongoDB untuk Go
- **Gorilla WebSocket**: WebSocket implementation
- **JWT-Go**: JWT token handling
- **bcrypt**: Password hashing

### Full Dependencies List
```go
github.com/gin-gonic/gin v1.11.0
github.com/golang-jwt/jwt/v5 v5.3.0
github.com/gorilla/websocket v1.5.3
go.mongodb.org/mongo-driver v1.17.4
golang.org/x/crypto v0.42.0
gorm.io/driver/postgres v1.6.0
gorm.io/gorm v1.31.0
```

## 🌐 CORS Configuration

### Auth Service
- Mengizinkan semua origins
- Support untuk semua HTTP methods
- Credentials allowed

### Chat Service
- Configured untuk React/Next.js dev server (`http://localhost:3000`)
- Support untuk GET, POST, PUT, DELETE, OPTIONS
- Authorization header support

## 🔄 WebSocket Flow

1. Client connect ke `/ws` endpoint
2. Client kirim pesan dalam format JSON
3. Server simpan pesan ke MongoDB
4. Server broadcast pesan ke semua connected clients
5. Clients menerima pesan real-time

## 🛠️ Development

### Project Structure
```
PingMe/
├── Auth/                 # Authentication microservice
│   ├── config/          # Database configuration
│   ├── controller/      # HTTP handlers
│   ├── middleware/      # JWT middleware
│   ├── model/          # Data models
│   ├── routes/         # Route definitions
│   ├── utils/          # JWT utilities
│   └── main.go         # Auth service entry point
├── Chat/                # Chat microservice
│   ├── config/         # Database configuration
│   ├── controller/     # HTTP & WebSocket handlers
│   ├── model/          # Data models
│   ├── routes/         # Route definitions
│   └── main.go         # Chat service entry point
├── go.mod              # Go module definition
└── go.sum              # Dependency checksums
```

### Running in Development
1. Start PostgreSQL dan MongoDB
2. Run Auth service: `cd Auth && go run main.go`
3. Run Chat service: `cd Chat && go run main.go`
4. Test dengan tools seperti Postman atau frontend client

## 📝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buat issue di repository ini.

---

**PingMe** - Real-time Chat Application with Go Microservices
