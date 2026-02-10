"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 text-center animate-fade-in">
          
          {/* Icon Animation */}
          <div className="mx-auto h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Mail className="h-10 w-10" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Verify your email
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            We've sent a verification link to your email address. <br/>
            Please check your inbox (and spam folder) and click the link to activate your account.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-800 flex items-start gap-3 text-left">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <span>
              After verifying, you will be automatically redirected to the dashboard, or you can login manually.
            </span>
          </div>

          <div className="space-y-4">
            <Link href="/auth">
              <Button className="w-full bg-primary text-white hover:bg-primary/90 py-6 text-lg">
                Back to Login <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500 mt-6">
              Didn't receive the email? <Link href="/auth/resend-email" className="text-primary font-bold hover:underline">Click to resend</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}