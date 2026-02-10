"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, UserCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check Login Status on Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
    window.location.reload(); // Refresh to clear state
  };

  // Smooth Scroll Helper
  const scrollToSection = (id) => {
    setIsOpen(false); // Close mobile menu
    if (pathname !== "/") {
      router.push(`/#${id}`); // Go home first if on another page
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
          <GraduationCap className="h-7 w-7" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TCTC</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <button onClick={() => scrollToSection("courses")} className="text-sm font-medium hover:text-primary transition-colors">
            Courses
          </button>
          
          <button onClick={() => scrollToSection("gallery")} className="text-sm font-medium hover:text-primary transition-colors">
            Gallery
          </button>
          
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="text-sm font-medium hover:text-primary transition-colors">
            Contact Us
          </button>
          
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            Digital Products
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
               <Link href="/dashboard">
                  <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white">
                    <UserCircle className="h-4 w-4" /> Dashboard
                  </Button>
               </Link>
               <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                 <LogOut className="h-5 w-5 text-red-500" />
               </Button>
            </div>
          ) : (
             <Link href="/auth">
                <Button className="bg-primary text-white hover:bg-primary/90 shadow-md">Login / Register</Button>
             </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md hover:bg-muted" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4 animate-accordion-down shadow-lg absolute w-full left-0 bg-white">
          <button onClick={() => scrollToSection("courses")} className="text-left text-sm font-medium p-3 hover:bg-accent rounded-lg">
            Courses
          </button>
          <button onClick={() => scrollToSection("gallery")} className="text-left text-sm font-medium p-3 hover:bg-accent rounded-lg">
            Life at TCTC
          </button>
          <button onClick={() => { setIsOpen(false); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} className="text-left text-sm font-medium p-3 hover:bg-accent rounded-lg">
            Contact
          </button>
          <Link href="/products" onClick={() => setIsOpen(false)} className="text-left text-sm font-medium p-3 hover:bg-accent rounded-lg">
            Digital Products
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button className="w-full gap-2">Dashboard</Button>
              </Link>
              <Button variant="destructive" className="w-full mt-2" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Login / Register</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}