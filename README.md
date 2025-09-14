# 🚀 Go Portfolio - Rayhan's Golang Journey

[![Go Version](https://img.shields.io/badge/Go-1.25+-blue.svg)](https://golang.org)
[![Projects](https://img.shields.io/badge/Projects-2+-green.svg)](#-projects)
[![Tech Stack](https://img.shields.io/badge/Stack-Gin%20%7C%20GORM%20%7C%20PostgreSQL-orange.svg)](#-tech-stack)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🎯 Welcome to my Go programming portfolio! This repository showcases my journey learning and building applications with Go, featuring CLI tools and REST APIs.

## 👨‍💻 About Me

Hello! I'm **Rayhan**, a passionate developer exploring the world of Go programming. This repository contains my practice projects and learning experiments as I develop my skills in:

- 🔧 Building CLI applications
- 🌐 Creating REST APIs  
- 📊 Database integration
- 🎨 Clean code architecture

## 📂 Projects Overview

### 📝 Todo CLI
A beautiful command-line todo manager built with Go
- ✅ Complete todo management system
- 🎨 Beautiful table formatting with colors
- 💾 JSON file persistence
- 📅 Automatic timestamps

### 🗒️ Note API
RESTful API for managing notes with database integration
- 🔥 Full CRUD operations
- 🐘 PostgreSQL database integration
- ⚡ Built with Gin web framework
- 📦 GORM for database operations

## 🚀 Quick Start

### Prerequisites
Make sure you have these installed:
- **Go 1.25+** - [Download here](https://golang.org/dl/)
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL** - [Download here](https://postgresql.org/) (for Note API)

### 📥 Clone Repository

```bash
# Clone this portfolio repository
git clone https://github.com/yourusername/go-portfolio.git
cd go-portfolio
```

### 🎮 Run the Projects

#### 📝 Todo CLI Application

```bash
# Navigate to CLI Todo project
cd CLITODO

# Install dependencies
go mod tidy

# Build the application
go build -o todo .

# Run the application
./todo -list
```

#### 🗒️ Note API Server

```bash
# Navigate to Note API project
cd note

# Install dependencies
go mod tidy

# Run the server
go run main.go
```

## 📁 Repository Structure

```
go-portfolio/
├── 📁 CLITODO/                    # CLI Todo Application
│   ├── 📄 main.go                 # Entry point
│   ├── 🚩 command.go              # CLI commands
│   ├── 📋 todo.go                 # Todo logic
│   ├── 💾 storage.go              # File storage
│   ├── 📝 todos.json              # Data file
│   ├── 📦 go.mod                  # Dependencies
│   └── 📖 readme.md               # Project docs
├── 📁 note/                       # Note API Server
│   ├── 📁 config/                 # Configuration
│   ├── 📁 controller/             # API handlers
│   ├── 📁 models/                 # Data models
│   ├── 📁 routes/                 # Route definitions
│   ├── 📄 main.go                 # Entry point
│   ├── 📦 go.mod                  # Dependencies
│   └── 📖 README.md               # Project docs
└── 📖 README.md                   # This file!
```

## 🛠️ Tech Stack

| Technology | Purpose | Projects |
|------------|---------|----------|
| **Go** | Programming language | All projects |
| **Gin** | Web framework | Note API |
| **GORM** | ORM library | Note API |
| **PostgreSQL** | Database | Note API |
| **JSON** | Data storage | Todo CLI |

## 📊 Learning Progress

✅ **Completed:**
- Basic Go syntax and concepts
- CLI application development
- JSON file handling
- REST API development
- Database integration with GORM
- Web framework usage (Gin)

🚧 **Currently Learning:**
- Advanced Go patterns
- Testing in Go
- Microservices architecture
- Docker containerization

## 🤝 Contributing

This is my personal learning portfolio, but I welcome:
- 📝 Code reviews and feedback
- 🐛 Bug reports and suggestions
- 💡 Ideas for new projects
- 🎓 Learning resources recommendations

## 📞 Contact

- 📧 **Email:** rayhan.dita45@smk.belajar.id
- 💼 **LinkedIn:** www.linkedin.com/in/rayhan-dita-adam-riski-572b32355
- 🐱 **GitHub:** [@yourusername](https://github.com/RayhanDitaAdam)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- 💙 **Go Community** - For excellent documentation and support
- 🎨 **Open Source Libraries** - For making development easier
- ☕ **Coffee** - For keeping me coding late at night

---

<div align="center">

**⭐ If you found this helpful, please star the repository! ⭐**

Made with ❤️ and Go by Rayhan

</div>
