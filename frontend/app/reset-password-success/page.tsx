"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
          <div className="flex flex-col items-center">
            <img src="/1.png" alt="POS Dreams Logo" className="h-12 w-auto" />
            <CheckCircle2 className="mt-8 h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Success
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your new password has been successfully saved
            </p>
          </div>
          <div className="mt-8">
            <Button
              type="button"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Link href="/">Back to Sign In</Link>
            </Button>
          </div>
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
