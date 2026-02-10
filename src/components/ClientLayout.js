"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import FloatingContact from "@/components/FloatingContact";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // 🛡️ Logic: যদি লিংক '/admin' বা '/auth' দিয়ে শুরু হয়, তবে Navbar দেখাবে না
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/auth");

  const shouldHideNavbar = isAdmin || isAuth;

  return (
    <>
      {/* ১. শর্তসাপেক্ষে Navbar রেন্ডার হবে */}
      {!shouldHideNavbar && <Navbar />}

      {/* ২. মেইন কন্টেন্ট */}
      {children}

      {/* ৩. অ্যাডমিন প্যানেলে ফ্লোটিং বাটন থাকবে না */}
      {!shouldHideNavbar && <FloatingContact />}
    </>
  );
}