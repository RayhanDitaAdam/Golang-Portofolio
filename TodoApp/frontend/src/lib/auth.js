export const isLoggedIn = () => {
  if (typeof window === "undefined") return false // server-side safety
  const token = localStorage.getItem("token")
  return !!token // true kalau ada token
}
