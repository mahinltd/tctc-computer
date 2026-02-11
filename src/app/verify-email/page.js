"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STATUS_CONFIG = {
  loading: {
    icon: Loader2,
    iconClasses: "text-blue-500 animate-spin",
    heading: "Verifying your email...",
  },
  success: {
    icon: CheckCircle2,
    iconClasses: "text-green-600",
    heading: "Email verified!",
  },
  error: {
    icon: AlertTriangle,
    iconClasses: "text-red-500",
    heading: "Verification issue",
  },
};

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const redirectTimerRef = useRef(null);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "We're confirming your link. This may take a moment."
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing. Please request a new email.");
      return;
    }

    let isMounted = true;

    const verify = async () => {
      try {
        const response = await api.get("/users/verify-email", {
          params: { token },
        });

        if (!isMounted) return;

        const serverMessageRaw =
          typeof response.data === "string"
            ? response.data
            : response.data?.message;

        setStatus("success");
        setMessage(
          stripHtml(serverMessageRaw) ||
            "You're all set! Redirecting you to the login page..."
        );

        redirectTimerRef.current = setTimeout(() => router.push("/auth"), 3000);
      } catch (error) {
        if (!isMounted) return;

        const errPayload = error?.response?.data;
        const errMessageRaw =
          typeof errPayload === "string"
            ? errPayload
            : errPayload?.message;
        const fallbackMessage =
          "This verification link has expired or is invalid. Please request another email.";

        setStatus("error");
        setMessage(stripHtml(errMessageRaw) || fallbackMessage);
      }
    };

    verify();

    return () => {
      isMounted = false;
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [token, router]);

  const { icon: Icon, iconClasses, heading } =
    STATUS_CONFIG[status] || STATUS_CONFIG.loading;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 text-center animate-fade-in">
          <div className="mx-auto h-20 w-20 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center mb-6">
            <Icon className={`${iconClasses} h-10 w-10`} />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{heading}</h1>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">{message}</p>

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-sm text-red-800 text-left">
              Please head back to the login page and click "Resend verification email" to receive a fresh link.
            </div>
          )}

          <div className="space-y-4">
            <Link href="/auth">
              <Button className="w-full bg-primary text-white hover:bg-primary/90 py-6 text-lg">
                Back to Login
              </Button>
            </Link>

            {status === "error" && (
              <p className="text-sm text-gray-500 mt-6">
                Need a new link? <Link href="/auth/resend-email" className="text-primary font-bold hover:underline">Request another verification email</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
