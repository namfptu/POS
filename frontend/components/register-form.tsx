"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Facebook, Chrome, Apple, User, Mail } from "lucide-react"
import { register } from "@/lib/api" // Import hàm register từ tệp api.ts của bạn

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.")
      setIsLoading(false)
      return
    }

    try {
      const response = await register({ name, email, password })
      console.log("Registration successful:", response)
      alert("Đăng ký thành công! Vui lòng đăng nhập.")
      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push('/')
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Đăng ký thất bại. Vui lòng thử lại.")
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
            <img src="/logo.svg" alt="My Logo" className="h-12 w-auto" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Register</h1>
          <p className="text-gray-600 text-sm">Create New Dreamspos Account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pr-10"
                required
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10"
                required
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
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

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-orange-500">*</span>
            </label>
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Terms & Privacy Checkbox */}
          <div className="flex items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded"
                required
              />
              <span className="text-gray-700">
                I agree to the{" "}
                <Link href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                  Terms & Privacy
                </Link>
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        {/* Sign In Instead */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            New on our platform?{" "}
            <Link href="/" className="text-orange-500 hover:text-orange-600 font-semibold">
              Sign In Instead
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
