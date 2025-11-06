import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      {/* Left side - Form */}
      <RegisterForm />

      {/* Right side - Illustration */}
      <div className="hidden md:flex items-center justify-center p-0">
        <img src="/5.png" alt="Illustration" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
