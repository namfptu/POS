"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Facebook, Chrome, Apple } from "lucide-react"
import { login } from "@/lib/api" // Import hàm login từ tệp api.ts của bạn

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await login({ email, password })
      console.log("Login successful:", response)
      // Chuyển hướng đến dashboard sau khi đăng nhập thành công
      router.push('/dashboard')
    } catch (error) {
      // Xử lý lỗi đăng nhập, ví dụ hiển thị thông báo lỗi
      console.error("Login failed:", error)
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="mb-8">
      <div className="flex justify-center items-center">
        <img src="/1.png" alt="My Logo" className="w-10 h-10" />

          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600 text-sm">Access the DreamsPOS panel using your email and passcode.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-orange-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-orange-500">*</span>
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span className="text-gray-700">Remember Me</span>
            </label>
            <Link href="#" className="text-orange-500 hover:text-orange-600 font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Create Account */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            New on our platform?{" "}
            <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
              Create an account
            </Link>
          </span>
        </div>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
            <Facebook className="h-5 w-5" />
          </button>
          <button className="flex items-center justify-center py-2.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-semibold transition-colors">
            <Chrome className="h-5 w-5" />
          </button>
          <button className="flex items-center justify-center py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors">
            <Apple className="h-5 w-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Copyrights © 2025 - DreamsPOS</p>
        </div>
      </div>
    </div>
  )
}
