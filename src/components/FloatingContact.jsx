"use client";
import { useState } from "react";
import { MessageCircle, Mail, X, Phone } from "lucide-react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  // Contact Details
  const whatsappNumber = "8801555048150";
  const emailAddress = "info@technicalcomputer.tech";

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:${emailAddress}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Expanded Options (Show when open) */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
        
        {/* WhatsApp Button */}
        <button 
          onClick={handleWhatsApp}
          className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#20b858] transition-transform hover:scale-105"
        >
          <span className="font-bold text-sm">WhatsApp</span>
          <Phone className="h-5 w-5" />
        </button>

        {/* Email Button */}
        <button 
          onClick={handleEmail}
          className="flex items-center gap-3 bg-[#EA4335] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#d63d30] transition-transform hover:scale-105"
        >
          <span className="font-bold text-sm">Email Us</span>
          <Mail className="h-5 w-5" />
        </button>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 ${isOpen ? "bg-red-500 rotate-90" : "bg-primary hover:bg-primary/90"} text-white`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 animate-pulse" />}
      </button>
    </div>
  );
}