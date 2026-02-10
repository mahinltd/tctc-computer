"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ResendEmail() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <Link href="/auth" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
          
          <h2 className="text-2xl font-bold mb-2">Resend Verification</h2>
          <p className="text-muted-foreground text-sm mb-6">If you didn't receive the confirmation email, enter your email below.</p>

          <form className="space-y-4">
             <div className="relative">
                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                 <Input type="email" placeholder="Enter your email" className="pl-10" required />
              </div>
            <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Resend Email</Button>
          </form>
        </div>
      </div>
    </div>
  );
}