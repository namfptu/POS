"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { TimerIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import { verifyOtp, forgotPassword } from "@/lib/api/auth"; // Import the API functions

const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  const maskedName = name.length > 2 ? `${name.substring(0, 2)}******` : name;
  return `${maskedName}@${domain}`;
};

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const email = searchParams.get('email') || "";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    try {
      const response = await verifyOtp({ email, otp: otp.join('') });
      console.log("OTP verified successfully. Reset Token:", response.resetToken);
      router.push(`/reset-password?token=${response.resetToken}`); // Redirect to password reset page
      alert("OTP verified successfully!");
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Xác thực OTP thất bại. Vui lòng kiểm tra lại mã OTP.");
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true); // Set loading to true for resend
    try {
      await forgotPassword(email);
      setTimer(60); // Reset timer
      setOtp(new Array(6).fill("")); // Clear OTP input
      alert("Mã OTP mới đã được gửi!");
    } catch (error) {
      console.error("Resend OTP failed:", error);
      alert("Gửi lại OTP thất bại. Vui lòng thử lại.");
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
              Email OTP Verification
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              OTP sent to your Email Address ending <span className="font-medium">{maskEmail(email)}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex justify-center space-x-2">
              <InputOTP maxLength={6} value={otp.join('')} onChange={(value) => setOtp(value.split(''))}>
                <InputOTPGroup>
                  {otp.map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-600">
              <TimerIcon className="mr-1 h-4 w-4" />
              <span>00:{timer < 10 ? `0${timer}` : timer} s</span>
            </div>

            <div className="text-center text-sm">
              <p>
                Didn't get the OTP?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer !== 0 || isLoading} // Disable resend when loading
                  className="font-medium text-orange-500 hover:text-orange-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
              </p>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading} // Disable button when loading
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {isLoading ? "Verifying..." : "Verify & Proceed"} {/* Change button text when loading */}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="relative hidden md:block">
        <img
          className="h-full w-full object-cover"
          src="/3.png"
          alt="Background"
        />
      </div>
    </div>
  );
}
