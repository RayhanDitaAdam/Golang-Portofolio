"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { Chart as ChartJS, LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Moon, Sun, RefreshCw, Target, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

// Register Chart.js components
ChartJS.register(LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const DashboardPage = () => {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [data, setData] = useState({
    todosOverTime: [],
    todosByPriority: [],
    statusOverTime: [],
    stats: { total: 0, pending: 0, inProgress: 0, success: 0, failed: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState("")
  const [mounted, setMounted] = useState(false)

  // Fetch token and username on mount
  useEffect(() => {
    setMounted(true)
    const t = localStorage.getItem("token")
    const u = localStorage.getItem("username")
    const savedTheme = localStorage.getItem("theme") || "dark"
    setToken(t)
    setUsername(u || "User")
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [setTheme])

  // Fetch todos from API
  const fetchTodos = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const { data } = await axios.get("http://localhost:7002/todos/my", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const todos = data.todos || []
      
      // Process data for charts
      const todosOverTime = processTodosOverTime(todos)
      const todosByPriority = processTodosByPriority(todos)
      const statusOverTime = processStatusOverTime(todos)
      const stats = processStats(todos)

      setData({ todosOverTime, todosByPriority, statusOverTime, stats })
      setLoading(false)
      toast.success("Dashboard data loaded successfully")
    } catch (err) {
      console.error('Error fetching todos:', err)
      setError('Failed to load dashboard data. Please try again.')
      setLoading(false)
      toast.error("Failed to load dashboard data")
    }
  }, [token])

  // Process todos for Line Chart (Todos created per day)
  const processTodosOverTime = (todos) => {
    const grouped = todos.reduce((acc, todo) => {
      if (!todo.Tanggal || todo.Tanggal === "0001-01-01T00:00:00Z") return acc
      const date = format(parseISO(todo.Tanggal), 'yyyy-MM-dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return Object.keys(grouped).sort().map(date => ({ date, todos: grouped[date] }))
  }

  // Process todos for Bar Chart (Todos by priority)
  const processTodosByPriority = (todos) => {
    const grouped = todos.reduce((acc, todo) => {
      const priority = todo.priority || 'medium'
      acc[priority] = (acc[priority] || 0) + 1
      return acc
    }, {})

    return [
      { priority: 'urgent', count: grouped.urgent || 0 },
      { priority: 'high', count: grouped.high || 0 },
      { priority: 'medium', count: grouped.medium || 0 },
      { priority: 'low', count: grouped.low || 0 }
    ]
  }

  // Process todos for Area Chart (Status over time)
  const processStatusOverTime = (todos) => {
    const grouped = todos.reduce((acc, todo) => {
      if (!todo.Tanggal || todo.Tanggal === "0001-01-01T00:00:00Z") return acc
      const date = format(parseISO(todo.Tanggal), 'yyyy-MM-dd')
      const status = todo.status || 'Pending'
      if (!acc[date]) {
        acc[date] = { Pending: 0, InProgress: 0, Success: 0, Failed: 0 }
      }
      acc[date][status] += 1
      return acc
    }, {})

    return Object.keys(grouped).sort().map(date => ({
      date,
      Pending: grouped[date].Pending,
      InProgress: grouped[date].InProgress,
      Success: grouped[date].Success,
      Failed: grouped[date].Failed
    }))
  }

  // Process stats for summary cards
  const processStats = (todos) => ({
    total: todos.length,
    pending: todos.filter(t => t.status === 'Pending').length,
    inProgress: todos.filter(t => t.status === 'InProgress').length,
    success: todos.filter(t => t.status === 'Success').length,
    failed: todos.filter(t => t.status === 'Failed').length
  })

  // Fetch data when token is available
  useEffect(() => {
    if (token && mounted) {
      fetchTodos()
    }
  }, [token, mounted, fetchTodos])

  // Theme toggle
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    toast.info(`Switched to ${newTheme} mode`)
  }, [theme, setTheme])

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("theme")
    toast.success("Logged out successfully")
    router.push("/auth/login")
  }, [router])

  // Chart colors for dark/light modes
  const chartColors = {
    dark: {
      line: '#60A5FA', // Blue for line chart
      bar: {
        urgent: '#EF4444', // Red
        high: '#F97316', // Orange
        medium: '#60A5FA', // Blue
        low: '#22C55E' // Green
      },
      area: {
        Pending: '#60A5FA', // Blue
        InProgress: '#A78BFA', // Purple
        Success: '#22C55E', // Green
        Failed: '#EF4444' // Red
      },
      grid: '#4B5563',
      text: '#F3F4F6',
      background: '#1F2937'
    },
    light: {
      line: '#2563EB', // Darker blue
      bar: {
        urgent: '#DC2626', // Darker red
        high: '#EA580C', // Darker orange
        medium: '#2563EB', // Darker blue
        low: '#16A34A' // Darker green
      },
      area: {
        Pending: '#2563EB', // Darker blue
        InProgress: '#7C3AED', // Darker purple
        Success: '#16A34A', // Darker green
        Failed: '#DC2626' // Darker red
      },
      grid: '#D1D5DB',
      text: '#1F2937',
      background: '#F9FAFB'
    }
  }

  const currentColors = theme === 'dark' ? chartColors.dark : chartColors.light

  // Chart.js datasets
  const lineChartData = {
    labels: data.todosOverTime.map(item => item.date),
    datasets: [{
      label: 'Todos Created',
      data: data.todosOverTime.map(item => item.todos),
      borderColor: currentColors.line,
      backgroundColor: currentColors.line + '50', // 50% opacity
      tension: 0.4, // Smooth curves
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true
    }]
  }

  const barChartData = {
    labels: data.todosByPriority.map(item => item.priority),
    datasets: [{
      label: 'Todos by Priority',
      data: data.todosByPriority.map(item => item.count),
      backgroundColor: data.todosByPriority.map(item => currentColors.bar[item.priority]),
      borderRadius: 4,
      barThickness: 40
    }]
  }

  const areaChartData = {
    labels: data.statusOverTime.map(item => item.date),
    datasets: [
      {
        label: 'Pending',
        data: data.statusOverTime.map(item => item.Pending),
        borderColor: currentColors.area.Pending,
        backgroundColor: currentColors.area.Pending + '50',
        fill: true,
        tension: 0.4
      },
      {
        label: 'In Progress',
        data: data.statusOverTime.map(item => item.InProgress),
        borderColor: currentColors.area.InProgress,
        backgroundColor: currentColors.area.InProgress + '50',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Success',
        data: data.statusOverTime.map(item => item.Success),
        borderColor: currentColors.area.Success,
        backgroundColor: currentColors.area.Success + '50',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Failed',
        data: data.statusOverTime.map(item => item.Failed),
        borderColor: currentColors.area.Failed,
        backgroundColor: currentColors.area.Failed + '50',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        labels: { color: currentColors.text }
      },
      tooltip: {
        backgroundColor: currentColors.background,
        titleColor: currentColors.text,
        bodyColor: currentColors.text,
        borderColor: currentColors.grid,
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { color: currentColors.grid },
        ticks: { color: currentColors.text }
      },
      y: {
        grid: { color: currentColors.grid },
        ticks: { color: currentColors.text }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  }

  if (!mounted) return null

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button
              onClick={fetchTodos}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Retrying...
                </>
              ) : (
                'Retry'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6 flex justify-center items-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-gray-800 dark:bg-gray-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TodoApp</h1>
              <p className="text-xs opacity-80">Task Management</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-gray-700 dark:hover:bg-gray-800">
                Dashboard
              </Button>
            </Link>
            <Link href="/notes">
              <Button variant="ghost" className="text-white hover:bg-gray-700 dark:hover:bg-gray-800">
                Todos
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={fetchTodos}
              disabled={loading}
              className="text-white hover:bg-gray-700 dark:hover:bg-gray-800"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="text-white hover:bg-gray-700 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center"
              onClick={logout}
            >
              {username.charAt(0).toUpperCase()}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-0 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.stats.total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Todos</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.stats.pending}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.stats.inProgress}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data.stats.success}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.stats.failed}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart: Todos Created Over Time */}
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Todos Created Over Time</h2>
              <div className="h-[300px]">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart: Todos by Priority */}
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Todos by Priority</h2>
              <div className="h-[300px]">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Area Chart: Status Over Time */}
        <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Todo Status Over Time</h2>
            <div className="h-[300px]">
              <Line data={areaChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: true } } }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage