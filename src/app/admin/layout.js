"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  Package, 
  LogOut,
  Menu,
  X,
  Video,
  Settings // ✅ FIXED: Settings আইকন ইমপোর্ট করা হয়েছে
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/auth");
  };

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Classes", href: "/admin/classes", icon: Video },
    { name: "Admissions", href: "/admin/admissions", icon: Users },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Digital Products", href: "/admin/products", icon: Package },
    { name: "Payment Settings", href: "/admin/payment-methods", icon: Settings }, // ✅ NEW LINK ADDED
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold text-primary">TCTC Admin</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b hidden md:block">
          <h2 className="text-2xl font-bold text-primary">TCTC Admin</h2>
          <p className="text-xs text-gray-500">Control Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        {children}
      </main>
    </div>
  );
}