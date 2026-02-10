import { Plus_Jakarta_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/ClientLayout"; // ✅ Import

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSansBengali = Noto_Sans_Bengali({ 
  subsets: ["bengali"],
  variable: "--font-bengali",
});

export const metadata = {
  title: "Technical Computer Training Center",
  description: "Build your future in technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${plusJakarta.variable} ${notoSansBengali.variable} font-sans antialiased`}
        suppressHydrationWarning={true} 
      >
        <Toaster position="top-center" />

        {/* ✅ Navbar এখান থেকে সরানো হয়েছে, এটি ClientLayout এর ভেতরে আছে */}
        <ClientLayout>
          {children}
        </ClientLayout>

      </body>
    </html>
  );
}