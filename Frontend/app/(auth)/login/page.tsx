"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

interface Notification {
  type: "success" | "error"
  message: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000) // Hide notification after 5 seconds
  }

  // Function to handle login submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setIsPending(true)
    try {
      const response = await axios.post(`https://api.aquarythu.com/api/checkUser`, {
        email: formData.get("email"),
        password: formData.get("password"),
      })

      if (response.data.status) {
        showNotification("success", "Login successful! Redirecting...")
        localStorage.setItem("userId", response.data.user.id)
        localStorage.setItem("userName", response.data.user.userName)
        localStorage.setItem("blogId", response.data.user.blogId)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        // Uncomment the next line when you're ready to implement redirection
        router.push('/facebook');
      } else {
        showNotification("error", "Login failed. Please check your credentials.")
      }
    } catch (error: any) {
      showNotification("error", "Please retry again after some time")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to login to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

