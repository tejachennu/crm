'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios';


export default function SignUpPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSubmit(formData: FormData) {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      })
      return
    }

    setIsPending(true)
    try {
      const result = await axios.post(`http://147.93.44.40:3003/api/user`, {
        userName: formData.get('name'),
        blogId: formData.get('blogid'),
        email: formData.get('email'),
        mobile: formData.get('number'),
        password: password
      });
      setIsPending(false)
      console.log(result)

      if (!result?.data.status) {
        localStorage.setItem("user",result.data)
        localStorage.setItem("status",result.data.status)
        toast({
          variant: "destructive",
          title: "Error",
          description: result.data.message,
        })
      } else {
        toast({
          title: "Success",
          description: "Account created successfully! Redirecting to login...",
        })
        setTimeout(() => {
          router.push(`/platforms/${result.data.user.id}`)
        }, 2000)
      }
    } catch (error: any) {
      setIsPending(false)
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">User Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Mobile Number</Label>
              <Input
                id="number"
                name="number"
                type="tel"
                placeholder="Enter your mobile number"
                required
                pattern="[0-9]*"
                minLength={10}
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blogid">Blog ID</Label>
              <Input
                id="blogid"
                name="blogid"
                type="text"
                placeholder="Enter your blog ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

