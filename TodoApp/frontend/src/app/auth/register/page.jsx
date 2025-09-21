"use client"

import React, { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // <--- gunakan toast

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
    const router = useRouter()
 const Regis = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    const payload = { username, password }

    // loader 3 detik
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const { data } = await axios.post("http://localhost:7002/register", payload)

    // Delay 1 detik sebelum menampilkan toast
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast("Register berhasil!", {
      description: `Akun ${username} berhasil dibuat`,
      action: {
        label: "Login",
        onClick: () => router.push("/auth/login"),
      },
    })

  } catch (error) {
    toast.error("Register gagal: terjadi kesalahan")
    console.log(error)
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Register</h1>
        <form onSubmit={Regis} className="flex flex-col gap-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  )
}
