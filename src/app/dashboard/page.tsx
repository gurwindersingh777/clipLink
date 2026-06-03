'use client'
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"


export default function dashboardPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
        },
      },
    })
  }
  return (
    <button onClick={handleLogout}>logout</button>
  )
}
