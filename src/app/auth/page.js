"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Mail, Lock, User, Phone, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast"; 
import api from "@/lib/api"; 

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard"; 
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "" });

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace(redirect);
    }
  }, [redirect, router]);

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // --- LOGIN SUBMIT ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await api.post("/users/login", loginData);
      
      console.log("SERVER RESPONSE:", response.data); 

      const token = response.data?.token || response.data?.accessToken || response.data?.data?.token;
      let user = response.data?.user || response.data?.userData || response.data?.data?.user;

      if (token) {
        if (!user) {
          console.warn("User object missing in response, creating fallback.");
          user = {
            name: "Student",
            email: loginData.email,
            phone: "N/A"
          };
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        toast.success("Login Successful!");
        window.location.href = redirect; 
      } else {
         console.error("Token missing in response:", response.data);
         toast.error("Login failed! Server didn't send a token.");
         setIsLoading(false);
      }

    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.message || "Login failed. Check email/password.";
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  // --- REGISTER SUBMIT ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await api.post("/users/register", registerData);
      toast.success("Verification Email Sent!");
      setRegisterData({ name: "", email: "", phone: "", password: "" });
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Registration Failed.");
      } else {
        toast.error("Network Error! Check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
          
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary/20 to-secondary/20 text-primary rounded-full flex items-center justify-center mb-4 shadow-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeTab === "login" ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeTab === "login" 
                ? "Enter your credentials to access your account." 
                : "Join us today and start your learning journey."}
            </p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="animate-fade-in">
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                        id="email" name="email" type="email" required 
                        placeholder="student@example.com" 
                        className="mt-1.5"
                        value={loginData.email} onChange={handleLoginChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" name="password" type="password" required 
                        placeholder="••••••••" 
                        className="mt-1.5"
                        value={loginData.password} onChange={handleLoginChange}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full mt-2 font-bold bg-gradient-to-r from-primary to-[#0f766e] text-white">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In to Dashboard"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register" className="animate-fade-in">
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" required placeholder="Name" value={registerData.name} onChange={handleRegisterChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" name="email" type="email" required placeholder="Email" value={registerData.email} onChange={handleRegisterChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="Phone" value={registerData.phone} onChange={handleRegisterChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" name="password" type="password" required placeholder="Password" value={registerData.password} onChange={handleRegisterChange} className="mt-1.5" />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full mt-4 font-bold bg-gradient-to-r from-secondary to-[#2dd4bf] text-secondary-foreground">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// ✅ মূল ফিক্স: Suspense ব্যবহার করা হয়েছে
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}