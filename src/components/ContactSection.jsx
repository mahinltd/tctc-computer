"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONTACT_POINTS = [
  {
    icon: MapPin,
    title: "Campus Location",
    detail: "Polytechnic College Mor, Khalishpur, Khulna",
    hint: null
  },
  {
    icon: Phone,
    title: "Phone Number",
    detail: "+880 1340751380",
    hint: "Mon - Sat (9am - 8pm)"
  },
  {
    icon: Mail,
    title: "Email Address",
    detail: "info@technicalcomputer.tech", 
    hint: null
  }
];

const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.625697666288!2d89.53787737595304!3d22.81639992398517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff9aac2e41366b%3A0x6b453880532252b4!2sKhulna%20Polytechnic%20Institute!5e0!3m2!1sen!2sbd!4v1707325608922!5m2!1sen!2sbd";

export default function ContactSection({ className = "", bgClass = "bg-muted/20", showMap = true }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const payloadMessage = formData.subject
        ? `Subject: ${formData.subject}\n\n${formData.message}`
        : formData.message;

      await api.post("/users/contact", {
        name: formData.name,
        email: formData.email,
        message: payloadMessage
      });

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact submit error", error);
      const msg = error.response?.data?.message || "Failed to send message.";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={`${bgClass} py-16 ${className}`}>
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {CONTACT_POINTS.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.detail}</p>
                    {item.hint && <p className="text-sm text-gray-400">{item.hint}</p>}
                  </div>
                </div>
              ))}
            </div>

            {showMap && (
              <div className="h-64 overflow-hidden rounded-2xl border shadow-sm">
                <iframe
                  src={MAP_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TCTC Location"
                ></iframe>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900">Send a Message</h3>
            <p className="mt-1 text-sm text-gray-500">Our team usually replies within 24 hours.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    required
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
                <Input
                  required
                  placeholder="Admission / Inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  required
                  className="flex min-h-[140px] w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={sending} className="mt-2 flex w-full items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                {sending ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
