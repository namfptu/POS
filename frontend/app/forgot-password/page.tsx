"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api"; // Import the API function

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    try {
      await forgotPassword(email);
      router.push(`/otp-verification?email=${email}`);
    } catch (error) {
      console.error("Forgot password request failed:", error);
      alert("Yêu cầu quên mật khẩu thất bại. Vui lòng thử lại."); // Display error message
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
          <div className="flex flex-col items-center">
            <img src="/1.png" alt="POS Dreams Logo" className="h-12 w-auto" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Forgot password?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              If you forgot your password, well, then we'll email you
              instructions to reset your password.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                placeholder="Email Address *"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading} // Disable button when loading
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {isLoading ? "Submitting..." : "Submit"} {/* Change button text when loading */}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm">
            <Link href="/" className="font-medium text-orange-500 hover:text-orange-600">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
      <div className="relative hidden md:block">
        <img
          className="h-full w-full object-cover"
          src="/2.png"
          alt="Background"
        />
      </div>
    </div>
  );
}
