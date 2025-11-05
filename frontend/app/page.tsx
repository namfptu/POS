import { SignInForm } from "@/components/sign-in-form"

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      {/* Left side - Form */}
      <SignInForm />

      {/* Right side - Illustration */}
      <div className="hidden md:flex items-center justify-center p-0">
        <img src="/illustration.png" alt="Illustration" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
