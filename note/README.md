# 📝 Note API - Your Personal Note Management System!

[![Go Version](https://img.shields.io/badge/Go-1.25+-blue.svg)](https://golang.org)
[![Gin Framework](https://img.shields.io/badge/Gin-v1.10.1-green.svg)](https://gin-gonic.com)
[![GORM](https://img.shields.io/badge/GORM-v1.31.0-orange.svg)](https://gorm.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🚀 A powerful REST API for managing notes built with Go, Gin, GORM, and PostgreSQL. Create, read, update, and delete your notes with ease!

## ✨ Features

🎯 **Core Functionality:**
- ➕ Create new notes with title and description
- 📋 Get all notes with beautiful JSON response
- ✏️ Update existing notes by ID
- 🗑️ Delete notes you no longer need
- 📅 Automatic timestamps (created_at, updated_at)
- 🔄 Soft delete support with GORM

🔧 **Technical Features:**
- 🏗️ Clean architecture with separation of concerns
- 🐘 PostgreSQL database integration
- 🔥 Fast HTTP router with Gin framework
- 📦 Auto-migration for database schema
- ⚡ RESTful API design
- 🛡️ Input validation and error handling

## 🚀 Quick Start

### Prerequisites
- Go 1.25+ installed
- PostgreSQL database running
- Git for version control

### 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/note-api.git
cd note-api
```

2. **Install dependencies:**
```bash
go mod tidy
```

3. **Setup PostgreSQL Database:**
```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE NoteAuth2;
CREATE USER sigma WITH PASSWORD 'sigma123';
GRANT ALL PRIVILEGES ON DATABASE NoteAuth2 TO sigma;
```

4. **Configure Database (Optional):**
Edit `config/database.go` to match your database settings:
```go
connect := "host=localhost user=sigma password=sigma123 dbname=NoteAuth2 sslmode=disable"
```

5. **Run the application:**
```bash
go run main.go
```

6. **Test the API:**
```bash
curl http://localhost:7001/notes
```

🎉 **Your API is now running on `http://localhost:7001`!**

## 🎮 API Endpoints

### 📋 Get All Notes
```http
GET /notes
```

**Response:**
```json
[
  {
    "ID": 1,
    "CreatedAt": "2025-09-14T10:30:00Z",
    "UpdatedAt": "2025-09-14T10:30:00Z",
    "DeletedAt": null,
    "Judul": "My First Note",
    "Deskripsi": "This is my first note description"
  }
]
```

### ➕ Create New Note
```http
POST /note
Content-Type: application/json
```

**Request Body:**
```json
{
  "Judul": "Shopping List",
  "Deskripsi": "Buy groceries: milk, bread, eggs"
}
```

**Response:**
```json
{
  "message": "Berhasil membuat catatan",
  "note": {
    "ID": 2,
    "CreatedAt": "2025-09-14T11:15:00Z",
    "UpdatedAt": "2025-09-14T11:15:00Z",
    "DeletedAt": null,
    "Judul": "Shopping List",
    "Deskripsi": "Buy groceries: milk, bread, eggs"
  }
}
```

### ✏️ Update Note
```http
PUT /note/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "Judul": "Updated Shopping List",
  "Deskripsi": "Buy groceries: milk, bread, eggs, cheese"
}
```

**Response:**
```json
{
  "message": "Berhasil update note",
  "note": {
    "ID": 2,
    "CreatedAt": "2025-09-14T11:15:00Z",
    "UpdatedAt": "2025-09-14T11:30:00Z",
    "DeletedAt": null,
    "Judul": "Updated Shopping List",
    "Deskripsi": "Buy groceries: milk, bread, eggs, cheese"
  }
}
```

### 🗑️ Delete Note
```http
DELETE /note/{id}
```

**Response:**
```json
{
  "message": "Berhasil menghapus catatan"
}
```

## 🧪 Testing with cURL

### Create a Note
```bash
curl -X POST http://localhost:7001/note \
  -H "Content-Type: application/json" \
  -d '{
    "Judul": "Learn Go Programming",
    "Deskripsi": "Study Gin framework and GORM for building REST APIs"
  }'
```

### Get All Notes
```bash
curl -X GET http://localhost:7001/notes
```

### Update a Note
```bash
curl -X PUT http://localhost:7001/note/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Judul": "Master Go Programming",
    "Deskripsi": "Deep dive into Gin, GORM, and PostgreSQL"
  }'
```

### Delete a Note
```bash
curl -X DELETE http://localhost:7001/note/1
```

## 📁 Project Structure

```
note-api/
├── 📁 config/
│   └── 🔧 database.go          # Database connection setup
├── 📁 controller/
│   └── 🎮 noteController.go    # API endpoint handlers
├── 📁 models/
│   └── 📝 note.go             # Note model and auto-migration
├── 📁 routes/
│   └── 🛤️ routes.go           # API route definitions
├── 📄 main.go                 # Application entry point
├── 📦 go.mod                  # Go module definition
├── 📋 go.sum                  # Dependency checksums
└── 📖 README.md              # You are here! 👋
```

## 🔧 Configuration

### Database Settings
Located in `config/database.go`:

```go
var DB *gorm.DB

func ConnectDatabase() {
    connect := "host=localhost user=sigma password=sigma123 dbname=NoteAuth2 sslmode=disable"
    database, err := gorm.Open(postgres.Open(connect), &gorm.Config{})
    if err != nil {
        log.Fatal("Gagal terhubung dengan database", err)
    }
    DB = database
}
```

### Environment Variables (Recommended)
For production, use environment variables:

```bash
export DB_HOST=localhost
export DB_USER=sigma
export DB_PASSWORD=sigma123
export DB_NAME=NoteAuth2
export DB_PORT=5432
export API_PORT=7001
```

## 🎨 Advanced Usage

### 🔄 Using with Postman

1. **Import Collection:**
   - Create a new collection in Postman
   - Add base URL: `http://localhost:7001`

2. **Setup Requests:**
   - **GET Notes:** `GET {{baseURL}}/notes`
   - **POST Note:** `POST {{baseURL}}/note` with JSON body
   - **PUT Note:** `PUT {{baseURL}}/note/1` with JSON body
   - **DELETE Note:** `DELETE {{baseURL}}/note/1`

### 📊 Database Schema
The Note model automatically creates this table structure:

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL
);
```

### 🐳 Docker Setup (Optional)

Create a `Dockerfile`:
```dockerfile
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "7001:7001"
    depends_on:
      - postgres
    
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: NoteAuth2
      POSTGRES_USER: sigma
      POSTGRES_PASSWORD: sigma123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🚨 Error Handling

The API handles various error scenarios:

| Error Code | Description | Response |
|------------|-------------|----------|
| `400` | Bad Request | `{"error": "Invalid Input"}` |
| `404` | Not Found | `{"error": "Catatan tidak di temukan"}` |
| `500` | Server Error | `{"error": "Database error message"}` |

### Common Error Responses

**Missing Required Fields:**
```json
{
  "error": "Invalid Input"
}
```

**Note Not Found:**
```json
{
  "error": "Catatan tidak di temukan"
}
```

**Database Connection Error:**
```json
{
  "error": "Gagal terhubung dengan database"
}
```

## 🔒 Security Considerations

🛡️ **Recommendations for Production:**
- Add authentication and authorization
- Use HTTPS/TLS encryption
- Implement rate limiting
- Add input sanitization
- Use environment variables for sensitive data
- Add request validation middleware
- Implement CORS properly
- Add logging and monitoring

## 📈 Performance Tips

⚡ **Optimization Suggestions:**
- Add database indexing for frequently queried fields
- Implement pagination for large datasets
- Use connection pooling
- Add caching layer (Redis)
- Implement database query optimization
- Add response compression

## 🤝 Contributing

We welcome contributions! 🎉

### How to Contribute:

1. 🍴 **Fork the repository**
2. 🌿 **Create feature branch:** `git checkout -b feature/amazing-feature`
3. 💍 **Commit changes:** `git commit -m 'Add amazing feature'`
4. 📤 **Push to branch:** `git push origin feature/amazing-feature`
5. 🎁 **Open Pull Request**

### 📝 Contribution Guidelines:
- Write clear, readable code
- Add tests for new features
- Update documentation
- Follow Go best practices
- Use meaningful commit messages

## 🐛 Troubleshooting

### Common Issues:

**Q: Database connection failed**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
psql -U sigma -d NoteAuth2 -c "\l"
```

**Q: Port already in use**
```bash
# Find process using port 7001
lsof -i :7001

# Kill the process
kill -9 <PID>
```

**Q: Module not found errors**
```bash
# Clean module cache
go clean -modcache
go mod download
go mod tidy
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🎨 [Gin Web Framework](https://gin-gonic.com/) - HTTP web framework
- 📦 [GORM](https://gorm.io/) - ORM library for Golang
- 🐘 [PostgreSQL](https://postgresql.org/) - Advanced open source database
- 💙 Go Community - For excellent documentation and support

## 📞 Support & Contact

- 📧 **Email:** rayhan.dita45@smk.belajar.id
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/note-api/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/note-api/discussions)
- 📱 **Discord:** [Join our Discord](https://discord.gg/your-server)

## 📊 API Status

- ✅ **Health Check:** `GET /health` (Coming Soon)
- 📈 **Metrics:** `GET /metrics` (Coming Soon)
- 📋 **API Docs:** `GET /swagger` (Coming Soon)

---

<div align="center">

**⭐ If this project helped you, please star the repository! ⭐**

Made with ❤️, Go, and lots of ☕

[⬆️ Back to Top](#-note-api---your-personal-note-management-system)

</div>
