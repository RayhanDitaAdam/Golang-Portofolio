"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { format, parseISO, isValid, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ProtectedRoute from '@/components/ProtectedRoute'

import { 
  Loader2, Plus, RefreshCw, CalendarIcon, Edit, Trash2, Clock, Rocket, 
  CheckCircle, XCircle, LogOut, Sun, Moon, ChevronDownIcon, Filter, 
  Search, Calendar as CalendarClock, Target, AlertTriangle 
} from 'lucide-react'

const TodoApp = () => {
  const navigate = useRouter()
  
  // Auth & UI state
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState("")
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Todos state
  const [todos, setTodos] = useState([])
  const [selectedTodos, setSelectedTodos] = useState([])
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  
  // Form state
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [priority, setPriority] = useState("medium")
  const [addTanggal, setAddTanggal] = useState(new Date())
  const [addTime, setAddTime] = useState(format(new Date(), 'HH:mm'))
  const [titleError, setTitleError] = useState(false)
  const [tanggalError, setTanggalError] = useState(false)
  
  // Edit form state
  const [editingTodo, setEditingTodo] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editPriority, setEditPriority] = useState("medium")
  const [editTanggal, setEditTanggal] = useState(undefined)
  const [editTime, setEditTime] = useState("")
  
  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const [statusComboOpen, setStatusComboOpen] = useState({})
  const [addTodoOpen, setAddTodoOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [addDatePickerOpen, setAddDatePickerOpen] = useState(false)
  const [editDatePickerOpen, setEditDatePickerOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)

  // Constants
  const statusOptions = [
    { 
      value: 'Pending', 
      icon: Clock, 
      color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    { 
      value: 'InProgress', 
      icon: Rocket, 
      color: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    },
    { 
      value: 'Success', 
      icon: CheckCircle, 
      color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    { 
      value: 'Failed', 
      icon: XCircle, 
      color: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-secondary text-secondary-foreground', icon: '●' },
    { value: 'medium', label: 'Medium', color: 'bg-primary/10 text-primary', icon: '●●' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300', icon: '●●●' },
    { value: 'urgent', label: 'Urgent', color: 'bg-destructive text-destructive-foreground', icon: '🔥' }
  ]

  // Computed values
  const filteredTodos = useMemo(() => {
    let filtered = [...todos]

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(todo => 
        todo.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.deskripsi && todo.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(todo => todo.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(todo => (todo.priority || 'medium') === priorityFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      filtered = filtered.filter(todo => {
        if (!todo.Tanggal || todo.Tanggal === "0001-01-01T00:00:00Z") return false
        const todoDate = parseISO(todo.Tanggal)
        if (!isValid(todoDate)) return false

        switch (dateFilter) {
          case "today": return isToday(todoDate)
          case "tomorrow": return isTomorrow(todoDate)
          case "week": return isThisWeek(todoDate)
          case "overdue": return isPast(todoDate) && todo.status !== "Success"
          default: return true
        }
      })
    }
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority || 'medium']
      const bPriority = priorityOrder[b.priority || 'medium']
      
      if (aPriority !== bPriority) return bPriority - aPriority
      const aDate = parseISO(a.Tanggal)
      const bDate = parseISO(b.Tanggal)
      const aOverdue = isValid(aDate) && isPast(aDate) && a.status !== "Success"
      const bOverdue = isValid(bDate) && isPast(bDate) && b.status !== "Success"
      
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1
      if (a.Tanggal && b.Tanggal) return new Date(a.Tanggal).getTime() - new Date(b.Tanggal).getTime()
      return 0
    })

    return filtered
  }, [todos, searchQuery, statusFilter, dateFilter, priorityFilter])

  const stats = useMemo(() => ({
    total: todos.length,
    pending: todos.filter(t => t.status === 'Pending').length,
    inProgress: todos.filter(t => t.status === 'InProgress').length,
    completed: todos.filter(t => t.status === 'Success').length,
    overdue: todos.filter(t => {
      if (t.status === 'Success' || !t.Tanggal || t.Tanggal === "0001-01-01T00:00:00Z") return false
      const parsed = parseISO(t.Tanggal)
      return isValid(parsed) && isPast(parsed)
    }).length,
    dueToday: todos.filter(t => {
      if (t.status === 'Success' || !t.Tanggal || t.Tanggal === "0001-01-01T00:00:00Z") return false
      const parsed = parseISO(t.Tanggal)
      return isValid(parsed) && isToday(parsed)
    }).length
  }), [todos])
  const getStatusStyles = useCallback((status) => {
    const statusOption = statusOptions.find(opt => opt.value === status)
    return statusOption?.color || statusOptions[0].color
  }, [])

  const getStatusIcon = useCallback((status) => {
    const statusOption = statusOptions.find(opt => opt.value === status)
    const Icon = statusOption?.icon || Clock
    return <Icon className="h-4 w-4" />
  }, [])

  const getStatusBadge = useCallback((status) => {
    const statusOption = statusOptions.find(opt => opt.value === status)
    return statusOption?.badge || statusOptions[0].badge
  }, [])

  const getPriorityBadge = useCallback((priority) => {
    return priorityOptions.find(opt => opt.value === priority) || priorityOptions[1]
  }, [])

  const formatTanggal = useCallback((tanggal) => {
    if (!tanggal || tanggal === "0001-01-01T00:00:00Z") return 'No due date'
    const parsed = parseISO(tanggal)
    if (!isValid(parsed)) return 'No due date'
    
    if (isToday(parsed)) return `Today • ${format(parsed, 'HH:mm')}`
    if (isTomorrow(parsed)) return `Tomorrow • ${format(parsed, 'HH:mm')}`
    return format(parsed, 'MMM dd, yyyy • HH:mm')
  }, [])

  const getDueDateColor = useCallback((tanggal, status) => {
    if (!tanggal || tanggal === "0001-01-01T00:00:00Z") return 'text-muted-foreground'
    const parsed = parseISO(tanggal)
    if (!isValid(parsed)) return 'text-muted-foreground'
    
    if (status === 'Success') return 'text-muted-foreground'
    if (isPast(parsed)) return 'text-destructive font-semibold'
    if (isToday(parsed)) return 'text-orange-600 dark:text-orange-400 font-semibold'
    if (isTomorrow(parsed)) return 'text-primary'
    return 'text-foreground'
  }, [])

  // Form helpers
  const resetAddForm = useCallback(() => {
    setTitle("")
    setDesc("")
    setPriority("medium")
    setAddTanggal(new Date())
    setAddTime(format(new Date(), 'HH:mm'))
    setTitleError(false)
    setTanggalError(false)
    setAddTodoOpen(false)
  }, [])

  const resetEditForm = useCallback(() => {
    setEditingTodo(null)
    setEditTitle("")
    setEditDesc("")
    setEditPriority("medium")
    setEditTanggal(undefined)
    setEditTime("")
    setTitleError(false)
    setTanggalError(false)
  }, [])

  // Effects
  useEffect(() => {
    setMounted(true)
    const t = localStorage.getItem("token")
    const u = localStorage.getItem("username")
    const savedTheme = localStorage.getItem("theme") || "light"
    setToken(t)
    setUsername(u || "User")
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  useEffect(() => {
    if (token && mounted) {
      GetTodos()
    }
  }, [token, mounted])

  // API functions
  const GetTodos = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const { data } = await axios.get("http://localhost:7002/todos/my", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTodos(data.todos || [])
      setSelectedTodos([])
      toast.success("Todos loaded successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to load todos")
    } finally {
      setLoading(false)
    }
  }, [token])

  const AddTodo = useCallback(async (e) => {
    e.preventDefault()
    if (!token || !title.trim()) {
      setTitleError(!title.trim())
      setTanggalError(!(addTanggal && isValid(addTanggal) && addTime))
      return
    }
    if (!addTanggal || !isValid(addTanggal) || !addTime) {
      setTanggalError(true)
      return
    }
    setLoading(true)
    try {
      const [hours, minutes] = addTime.split(':')
      const date = new Date(addTanggal)
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      const tanggal = format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      
      await axios.post("http://localhost:7002/todo", {
        Judul: title.trim(),
        Deskripsi: desc.trim(),
        Tanggal: tanggal,
        status: "Pending",
        priority: priority
      }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      })
      
      toast.success("Todo added successfully")
      resetAddForm()
      GetTodos()
    } catch (error) {
      console.log(error)
      toast.error("Failed to add todo")
    } finally {
      setLoading(false)
    }
  }, [token, title, addTanggal, addTime, desc, priority, resetAddForm, GetTodos])

  const updateStatus = useCallback(async (todoId, newStatus) => {
    if (!token) return
    setLoading(true)
    try {
      await axios.put(
        `http://localhost:7002/todo/${todoId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTodos(prev => prev.map(todo => todo.ID === todoId ? { ...todo, status: newStatus } : todo))
      toast.success("Status updated")
      setStatusComboOpen(prev => ({ ...prev, [todoId]: false }))
    } catch (error) {
      console.log(error)
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }, [token])

  const updateTodo = useCallback(async (todoId) => {
    if (!token || !editTitle.trim()) {
      setTitleError(!editTitle.trim())
      setTanggalError(!(editTanggal && isValid(editTanggal) && editTime))
      return
    }
    if (!editTanggal || !isValid(editTanggal) || !editTime) {
      setTanggalError(true)
      return
    }
    setLoading(true)
    try {
      const [hours, minutes] = editTime.split(':')
      const date = new Date(editTanggal)
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      const tanggal = format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      
      await axios.put(
        `http://localhost:7002/todo/${todoId}/update`,
        {
          Judul: editTitle.trim(),
          Deskripsi: editDesc.trim(),
          Tanggal: tanggal,
          priority: editPriority
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      )
      
      toast.success("Todo updated")
      resetEditForm()
      GetTodos()
    } catch (error) {
      console.log(error)
      toast.error("Failed to update todo")
    } finally {
      setLoading(false)
    }
  }, [token, editTitle, editTanggal, editTime, editDesc, editPriority, resetEditForm, GetTodos])

  const deleteTodo = useCallback(async (todoId) => {
    if (!token) return
    setLoading(true)
    try {
      await axios.delete(
        `http://localhost:7002/todo/${todoId}/delete`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Todo deleted")
      setTodos(prev => prev.filter(todo => todo.ID !== todoId))
      setSelectedTodos(prev => prev.filter(id => id !== todoId))
      setDeleteDialogOpen(false)
      setTodoToDelete(null)
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete todo")
    } finally {
      setLoading(false)
    }
  }, [token])

  const deleteSelectedTodos = useCallback(async () => {
    if (!token || selectedTodos.length === 0) return
    setLoading(true)
    try {
      await Promise.all(
        selectedTodos.map(id =>
          axios.delete(`http://localhost:7002/todo/${id}/delete`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      )
      toast.success(`${selectedTodos.length} todos deleted`)
      setTodos(prev => prev.filter(todo => !selectedTodos.includes(todo.ID)))
      setSelectedTodos([])
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete todos")
    } finally {
      setLoading(false)
    }
  }, [token, selectedTodos])

  // Event handlers
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }, [theme])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("theme")
    toast.success("Logged out successfully")
    navigate("/login")
  }, [navigate])

  const openEditDialog = useCallback((todo) => {
    setEditingTodo(todo)
    setEditTitle(todo.judul)
    setEditDesc(todo.deskripsi || "")
    setEditPriority(todo.priority || "medium")
    const parsedDate = todo.Tanggal && todo.Tanggal !== "0001-01-01T00:00:00Z" ? parseISO(todo.Tanggal) : new Date()
    setEditTanggal(isValid(parsedDate) ? parsedDate : new Date())
    setEditTime(isValid(parsedDate) ? format(parsedDate, 'HH:mm') : format(new Date(), 'HH:mm'))
    setTitleError(false)
    setTanggalError(false)
  }, [])

  const openDeleteDialog = useCallback((todo) => {
    setTodoToDelete(todo)
    setDeleteDialogOpen(true)
  }, [])

  const toggleTodoSelection = useCallback((todoId) => {
    setSelectedTodos(prev =>
      prev.includes(todoId)
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedTodos.length === filteredTodos.length && filteredTodos.length > 0) {
      setSelectedTodos([])
    } else {
      setSelectedTodos(filteredTodos.map(todo => todo.ID))
    }
  }, [selectedTodos.length, filteredTodos])

  const toggleStatusCombo = useCallback((todoId) => {
    setStatusComboOpen(prev => ({ ...prev, [todoId]: !prev[todoId] }))
  }, [])

  if (!mounted) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <Target className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">TodoApp</h1>
                    <p className="text-xs text-muted-foreground">Task Management</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {selectedTodos.length > 0 && (
                  <Button
                    onClick={deleteSelectedTodos}
                    disabled={loading}
                    size="sm"
                    variant="destructive"
                    className="text-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete {selectedTodos.length}
                  </Button>
                )}
                
                <Button
                  onClick={GetTodos}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                
                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                
                <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {username.charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                      Welcome, {username}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm mt-1"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.dueToday}</div>
                <div className="text-sm text-muted-foreground">Due Today</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search todos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Status</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                          >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Success">Completed</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Priority</label>
                          <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                          >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Due Date</label>
                          <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                          >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="week">This Week</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Dialog open={addTodoOpen} onOpenChange={setAddTodoOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Todo
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Todos List */}
          <div className="space-y-4">
            {loading && filteredTodos.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
            ) : filteredTodos.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {todos.length === 0 ? 'No todos yet' : 'No matching todos'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {todos.length === 0 
                      ? 'Create your first todo to get started.' 
                      : 'Try adjusting your search or filters.'}
                  </p>
                  {todos.length === 0 && (
                    <Button onClick={() => setAddTodoOpen(true)} className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Todo
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Select All */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedTodos.length === filteredTodos.length && filteredTodos.length > 0}
                          onCheckedChange={toggleSelectAll}
                          disabled={loading || filteredTodos.length === 0}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-foreground">
                          Select All ({filteredTodos.length})
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedTodos.length} selected
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Todo Items */}
                {filteredTodos.map(todo => {
                  const isOverdue = todo.Tanggal && todo.Tanggal !== "0001-01-01T00:00:00Z" && 
                                    isValid(parseISO(todo.Tanggal)) && 
                                    isPast(parseISO(todo.Tanggal)) && 
                                    todo.status !== "Success"
                  const priorityInfo = getPriorityBadge(todo.priority || 'medium')
                  
                  return (
                    <Card 
                      key={todo.ID}
                      className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
                        getStatusStyles(todo.status)
                      } ${isOverdue ? 'ring-2 ring-destructive/20' : ''}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            checked={selectedTodos.includes(todo.ID)}
                            onCheckedChange={() => toggleTodoSelection(todo.ID)}
                            disabled={loading}
                            className="mt-1 rounded"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`text-lg font-semibold text-foreground ${
                                todo.status === 'Success' ? 'line-through opacity-75' : ''
                              }`}>
                                {todo.judul}
                              </h3>
                              
                              <div className="flex items-center gap-2">
                                <Badge className={priorityInfo.color} variant="secondary">
                                  {priorityInfo.icon} {priorityInfo.label}
                                </Badge>
                                <Badge className={getStatusBadge(todo.status)} variant="secondary">
                                  {todo.status}
                                </Badge>
                                {isOverdue && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {todo.deskripsi && (
                              <p className={`text-sm text-muted-foreground mb-3 ${
                                todo.status === 'Success' ? 'line-through opacity-75' : ''
                              }`}>
                                {todo.deskripsi}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                <span className={getDueDateColor(todo.Tanggal, todo.status)}>
                                  {formatTanggal(todo.Tanggal)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Popover open={statusComboOpen[todo.ID]} onOpenChange={() => toggleStatusCombo(todo.ID)}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2"
                                  disabled={loading}
                                >
                                  {getStatusIcon(todo.status)}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-2">
                                <div className="grid grid-cols-2 gap-2">
                                  {statusOptions.map((option) => (
                                    <Button
                                      key={option.value}
                                      variant="ghost"
                                      size="sm"
                                      className="h-9 flex items-center justify-center"
                                      onClick={() => updateStatus(todo.ID, option.value)}
                                    >
                                      <option.icon className="h-4 w-4" />
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2"
                              onClick={() => openEditDialog(todo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(todo)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}
          </div>
        </div>

        {/* Floating Add Button */}
        {todos.length > 0 && (
          <div className="fixed bottom-8 right-8">
            <Dialog open={addTodoOpen} onOpenChange={setAddTodoOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}

        {/* Add Todo Dialog */}
        <Dialog open={addTodoOpen} onOpenChange={(open) => {
          if (!open) resetAddForm()
          setAddTodoOpen(open)
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Todo</DialogTitle>
              <DialogDescription>
                Add a new task with priority and due date.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={AddTodo} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  placeholder="Enter todo title..."
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value)
                    setTitleError(false)
                  }}
                  className={titleError ? 'border-destructive' : ''}
                  disabled={loading}
                  required
                />
                {titleError && (
                  <p className="text-sm text-destructive mt-1">Title is required</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  placeholder="Description (optional)..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="min-h-[80px]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  disabled={loading}
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Due Date & Time</label>
                <div className="flex gap-2">
                  <Popover open={addDatePickerOpen} onOpenChange={setAddDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex-1 justify-start text-left font-normal ${
                          tanggalError ? 'border-destructive' : ''
                        }`}
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {addTanggal ? format(addTanggal, 'PPP') : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={addTanggal}
                        onSelect={(date) => {
                          setAddTanggal(date)
                          setAddDatePickerOpen(false)
                          setTanggalError(false)
                        }}
                        disabled={loading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Input
                    type="time"
                    value={addTime}
                    onChange={e => {
                      setAddTime(e.target.value)
                      setTanggalError(false)
                    }}
                    className={`w-32 ${tanggalError ? 'border-destructive' : ''}`}
                    disabled={loading}
                    required
                  />
                </div>
                {tanggalError && (
                  <p className="text-sm text-destructive mt-1">Date and time are required</p>
                )}
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => resetAddForm()}
                  disabled={loading}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Todo"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Todo Dialog */}
        <Dialog open={!!editingTodo} onOpenChange={(open) => {
          if (!open) resetEditForm()
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
              <DialogDescription>
                Update your task details, priority, and due date.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  placeholder="Enter todo title..."
                  value={editTitle}
                  onChange={e => {
                    setEditTitle(e.target.value)
                    setTitleError(false)
                  }}
                  className={titleError ? 'border-destructive' : ''}
                  disabled={loading}
                />
                {titleError && (
                  <p className="text-sm text-destructive mt-1">Title is required</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  placeholder="Description..."
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="min-h-[80px]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  disabled={loading}
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Due Date & Time</label>
                <div className="flex gap-2">
                  <Popover open={editDatePickerOpen} onOpenChange={setEditDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex-1 justify-start text-left font-normal ${
                          tanggalError ? 'border-destructive' : ''
                        }`}
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editTanggal ? format(editTanggal, 'PPP') : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editTanggal}
                        onSelect={(date) => {
                          setEditTanggal(date)
                          setEditDatePickerOpen(false)
                          setTanggalError(false)
                        }}
                        disabled={loading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Input
                    type="time"
                    value={editTime}
                    onChange={e => {
                      setEditTime(e.target.value)
                      setTanggalError(false)
                    }}
                    className={`w-32 ${tanggalError ? 'border-destructive' : ''}`}
                    disabled={loading}
                    required
                  />
                </div>
                {tanggalError && (
                  <p className="text-sm text-destructive mt-1">Date and time are required</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => resetEditForm()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateTodo(editingTodo?.ID)}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete Todo
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>"{todoToDelete?.judul}"</strong>? 
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteTodo(todoToDelete?.ID)}
                disabled={loading}
                variant="destructive"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

export default TodoApp