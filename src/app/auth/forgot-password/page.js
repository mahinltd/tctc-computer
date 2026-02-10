"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Call API
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <Link href="/auth" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
          
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-muted-foreground text-sm mb-6">Enter your email and we'll send you a reset link.</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                 <Input type="email" placeholder="Enter your email" className="pl-10" required />
              </div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
          ) : (
            <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
               Link sent! Check your email inbox.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}