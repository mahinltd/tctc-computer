"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Download,
  Copy,
  Sparkles,
  CheckCircle2,
  Smartphone,
  CreditCard
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCT_LOGOS } from "@/data/productCatalog";

const checklist = [
  "Licensed or classroom-tested resources",
  "Manual verification by TCTC accounts team",
  "Download links unlock inside Dashboard > Digital Downloads"
];

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("https://technicalcomputer.tech/products");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "",
    senderMobile: "",
    transactionId: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      setShareUrl(`${window.location.origin}/products/${id}`);
    }
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      setIsAuthenticated(!!token);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.warn("Primary product lookup failed", error.response?.status);
        if (error.response?.status === 404) {
          try {
            const listRes = await api.get("/products");
            const fallback = listRes.data?.find((item) => item._id === id);
            if (fallback) {
              setProduct(fallback);
              toast.success("Loaded from catalog fallback");
              return;
            }
          } catch (listError) {
            console.error("Fallback catalog fetch failed", listError);
          }
        }
        toast.error("Product not found or not active");
        router.replace("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const cover = useMemo(() => {
    if (!product) return PRODUCT_LOGOS.generic.dataUri;
    return product.thumbnailUrl || PRODUCT_LOGOS[product.logoKey]?.dataUri || PRODUCT_LOGOS.generic.dataUri;
  }, [product]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied");
    }
  };

  const loadPaymentMethods = async () => {
    setPaymentLoading(true);
    try {
      const res = await api.get("/payments/methods");
      setPaymentMethods(res.data || []);
      if (res.data?.length) {
        setPaymentForm((prev) => ({
          ...prev,
          paymentMethod: res.data[0].methodName.toLowerCase()
        }));
      }
    } catch (error) {
      console.error("Payment methods error", error);
      toast.error("Payment methods unavailable. Contact support.");
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (showPaymentPanel && paymentMethods.length === 0) {
      loadPaymentMethods();
    }
  }, [showPaymentPanel, paymentMethods.length]);

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push(`/auth?redirect=/products/${id}`);
      return;
    }
    setShowPaymentPanel(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    setSubmitLoading(true);
    try {
      await api.post("/payments", {
        sourceType: "product",
        sourceId: product._id,
        paymentMethod: paymentForm.paymentMethod,
        senderMobile: paymentForm.senderMobile,
        transactionId: paymentForm.transactionId,
        amount: product.price
      });
      toast.success("Payment submitted for review. Check email for updates.");
      setShowPaymentPanel(false);
      setPaymentForm({ paymentMethod: paymentForm.paymentMethod, senderMobile: "", transactionId: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment submission failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCopyNumber = (value) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-10">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </button>

        <div className="grid gap-10 lg:grid-cols-[1fr,1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="overflow-hidden rounded-2xl">
              <img src={cover} alt={product.title} className="h-full w-full object-cover" />
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Shareable Link</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="break-all font-semibold text-gray-900">{shareUrl}</span>
                  <Button size="sm" variant="outline" onClick={handleCopy} className="gap-2">
                    <Copy className="h-4 w-4" /> Copy
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                <p className="text-sm font-semibold text-primary">Delivery Promise</p>
                <p className="mt-1 text-sm text-gray-600">Verified buyers unlock a secure download link inside the dashboard once our accounts team approves the payment.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Digital Product</p>
              <h1 className="text-4xl font-black text-gray-900">{product.title}</h1>
              {product.titleBn && <p className="font-bengali text-lg text-gray-500">{product.titleBn}</p>}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-4xl font-black text-gray-900">৳ {product.price}</p>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Manual verification takes up to 12 hours (10am-10pm)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Download className="h-4 w-4 text-indigo-500" /> Download from Dashboard after approval
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="gap-2" onClick={handleBuyNow}>
                  Buy Now <Sparkles className="h-4 w-4" />
                </Button>
                {!isAuthenticated && (
                  <Button variant="outline" asChild>
                    <Link href="/auth">
                      Login / Register
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {product.description && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">What you get</h2>
                <p className="mt-3 text-gray-600">{product.description}</p>
              </div>
            )}

            {showPaymentPanel && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-primary">Secure Checkout</p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900">Send ৳{product.price} and submit the details</h3>
                  </div>
                  <Button variant="ghost" onClick={() => setShowPaymentPanel(false)}>Close</Button>
                </div>
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Smartphone className="h-4 w-4 text-primary" /> Step 1: Send Money to TCTC
                    </h4>
                    {paymentLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading payment numbers...
                      </div>
                    ) : paymentMethods.length ? (
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div key={method._id} className="flex items-center justify-between rounded-xl border p-3">
                            <div>
                              <p className="font-semibold text-gray-900">{method.methodName}</p>
                              <p className="text-xs text-gray-500">{method.accountType}</p>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-1">
                              <span className="font-mono text-lg font-semibold text-gray-800">{method.number}</span>
                              <button type="button" onClick={() => handleCopyNumber(method.number)} className="text-gray-500 hover:text-primary">
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                        No payment numbers found. Please contact support.
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <CreditCard className="h-4 w-4 text-primary" /> Step 2: Submit Payment Proof
                    </h4>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <Label>Payment Method Used</Label>
                        <select
                          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                          value={paymentForm.paymentMethod}
                          onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                        >
                          {paymentMethods.map((method) => (
                            <option key={method._id} value={method.methodName.toLowerCase()}>
                              {method.methodName}
                            </option>
                          ))}
                          {paymentMethods.length === 0 && <option value="">No methods found</option>}
                        </select>
                      </div>

                      <div>
                        <Label>Sender Mobile Number</Label>
                        <Input
                          required
                          type="tel"
                          placeholder="e.g. 017XXXXXXXX"
                          value={paymentForm.senderMobile}
                          onChange={(e) => setPaymentForm({ ...paymentForm, senderMobile: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Transaction ID (TrxID)</Label>
                        <Input
                          required
                          className="uppercase"
                          placeholder="e.g. 8N7A6D5"
                          value={paymentForm.transactionId}
                          onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={submitLoading || paymentMethods.length === 0}>
                        {submitLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit for Review"}
                      </Button>
                    </form>
                  </div>

                  <p className="text-xs text-gray-500">
                    Our accounts team will verify payments between 10:00 AM and 10:00 PM. Once approved, the download link will appear inside your Dashboard under "Digital Downloads" and you will get an email confirmation.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">How to receive this file</h3>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-600">
                <li>Create or log in to your TCTC student account.</li>
                <li>Use the Buy Now payment form on this page (or Dashboard &gt; Payments) to submit your transaction reference with this product name.</li>
                <li>Once an admin marks the payment as verified, open Dashboard &gt; Digital Downloads to claim the secure link.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Quality checklist</h3>
              <ul className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-500">Need clarification? <Link href="/contact" className="text-primary underline">Contact TCTC support</Link>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
