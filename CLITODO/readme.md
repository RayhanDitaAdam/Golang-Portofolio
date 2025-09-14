# 📝 Todo CLI - Your Ultimate Task Manager! 

[![Go Version](https://img.shields.io/badge/Go-1.19+-blue.svg)](https://golang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](#)

> 🚀 A simple, fast, and beautiful command-line todo application built with Go! Manage your tasks like a pro with persistent storage and elegant table formatting.

## ✨ Features

🎯 **Core Functionality:**
- ➕ Add new todos with ease
- ✏️ Edit existing todos 
- 🗑️ Delete completed or unwanted tasks
- ✅ Toggle completion status
- 📋 List all todos in a beautiful table format

🔧 **Technical Features:**
- 💾 Persistent JSON storage
- 📅 Automatic timestamps for creation and completion
- 🎨 Beautiful table output with colors
- ⚡ Lightning-fast performance
- 🛡️ Error handling and validation

## 🚀 Quick Start

### Prerequisites
- Go 1.19 or higher installed on your system
- Terminal or command prompt

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/todo-cli.git
cd todo-cli
```

2. **Install dependencies:**
```bash
go mod tidy
```

3. **Build the application:**
```bash
go build -o todo .
```

4. **Run your first command:**
```bash
./todo -list
```

## 🎮 Usage Examples

### 📝 Adding Todos
```bash
# Add a simple task
./todo -add "Buy groceries"

# Add a work task
./todo -add "Finish the presentation for Monday"

# Add a personal goal
./todo -add "Learn Go programming 🚀"
```

### 📋 Viewing Your Todos
```bash
./todo -list
```

**Output:**
```
┌───┬─────────────────────────────────┬───────────┬─────────────────────────────┬──────────────┐
│ # │ Title                           │ Completed │ Create At                   │ Completed At │
├───┼─────────────────────────────────┼───────────┼─────────────────────────────┼──────────────┤
│ 0 │ Buy groceries                   │ X         │ Mon, 14 Sep 2025 10:30:00   │              │
│ 1 │ Finish the presentation         │ V         │ Mon, 14 Sep 2025 11:15:22   │ Mon, 14 Sep  │
│ 2 │ Learn Go programming 🚀         │ X         │ Mon, 14 Sep 2025 12:00:45   │              │
└───┴─────────────────────────────────┴───────────┴─────────────────────────────┴──────────────┘
```

### ✅ Completing Tasks
```bash
# Mark task #0 as completed
./todo -Toggle 0

# Toggle task #2 (if completed, mark as incomplete)
./todo -Toggle 2
```

### ✏️ Editing Todos
```bash
# Edit task #1 with new title
./todo -edit "1:Finish the presentation for Tuesday"

# Update task #0
./todo -edit "0:Buy groceries and cook dinner"
```

### 🗑️ Deleting Todos
```bash
# Delete task #2
./todo -del 2

# Remove completed task
./todo -del 0
```

## 🎨 Command Reference

| Command | Flag | Description | Example |
|---------|------|-------------|---------|
| **Add** | `-add "title"` | Create a new todo | `./todo -add "Learn Docker"` |
| **List** | `-list` | Show all todos | `./todo -list` |
| **Toggle** | `-Toggle index` | Mark complete/incomplete | `./todo -Toggle 0` |
| **Edit** | `-edit "index:title"` | Update todo title | `./todo -edit "1:New title"` |
| **Delete** | `-del index` | Remove a todo | `./todo -del 2` |

## 📁 Project Structure

```
todo-cli/
├── 📄 main.go           # Application entry point
├── 🚩 flags.go          # Command-line flag handling
├── 💾 storage.go        # JSON persistence layer
├── 📋 todos.go          # Core todo functionality
├── 📝 todos.json        # Data storage (auto-created)
├── 🔧 go.mod           # Go module definition
└── 📖 README.md        # You are here! 👋
```

## 🛠️ Technical Details

### Data Structure
```go
type Todo struct {
    Title       string     `json:"title"`
    Completed   bool       `json:"completed"`
    CreateAt    time.Time  `json:"create_at"`
    CompletedAt *time.Time `json:"completed_at,omitempty"`
}
```

### Storage
- **Format:** JSON
- **Location:** `todos.json` (same directory)
- **Auto-save:** Every command automatically saves changes
- **Backup:** Consider backing up your `todos.json` file

## 🎯 Advanced Usage Tips

### 💡 Pro Tips
1. **Batch Operations:** Run multiple commands in sequence
   ```bash
   ./todo -add "Task 1" && ./todo -add "Task 2" && ./todo -list
   ```

2. **Quick Check:** Always run `-list` after operations to verify changes
   ```bash
   ./todo -Toggle 0 && ./todo -list
   ```

3. **Backup Your Data:** 
   ```bash
   cp todos.json todos_backup_$(date +%Y%m%d).json
   ```

### 🚨 Common Issues & Solutions

**Problem:** `Invalid index` error
```bash
Error: Invalid index
```
**Solution:** Check your todo list first with `-list` to see available indices.

**Problem:** `Invalid format for edit` error  
**Solution:** Make sure to use the format `index:new_title` with a colon separator.

**Problem:** File permission errors
**Solution:** Ensure you have write permissions in the directory.

## 🤝 Contributing

We love contributions! 🎉

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💍 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎁 Open a Pull Request

### 🐛 Found a Bug?
Open an issue with:
- 📝 Description of the problem
- 🔄 Steps to reproduce
- 💻 Your system info (OS, Go version)
- 📋 Expected vs actual behavior

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🎨 [aquasecurity/table](https://github.com/aquasecurity/table) - For beautiful table formatting
- 💙 The Go community for excellent documentation
- ☕ Coffee - For making this possible

## 📞 Support

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/todo-cli/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/todo-cli/discussions)

---

<div align="center">

**⭐ If you found this helpful, please star the repository! ⭐**

Made with ❤️ and Go

[⬆️ Back to Top](#-todo-cli---your-ultimate-task-manager)

</div>
