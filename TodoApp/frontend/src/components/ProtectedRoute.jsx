"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"

export default function ProtectedRoute({ children }) {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/auth/login") // redirect ke login kalau belum login
    }
  }, [router])

  // kalau belum login, children nggak akan dirender (sementara redirect)
  return isLoggedIn() ? children : null
}
