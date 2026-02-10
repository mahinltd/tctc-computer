"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Sparkles,
  ShieldCheck,
  Download,
  Copy,
  ArrowRight,
  Layers,
  Star
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PRODUCT_LOGOS } from "@/data/productCatalog";
import ContactSection from "@/components/ContactSection";

const TAG_STYLES = {
  Software: "bg-blue-50 text-blue-700",
  PDF: "bg-rose-50 text-rose-700",
  Doc: "bg-indigo-50 text-indigo-700",
  Template: "bg-emerald-50 text-emerald-700",
  AI: "bg-orange-50 text-orange-700",
  PSD: "bg-sky-50 text-sky-700",
  Other: "bg-gray-100 text-gray-700"
};

const FeatureBadge = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-white">
    <div className="rounded-full bg-white/20 p-2">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm font-semibold tracking-wide uppercase">{title}</p>
      <p className="text-xs text-white/70">{subtitle}</p>
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const cover = product.thumbnailUrl || PRODUCT_LOGOS[product.logoKey]?.dataUri || PRODUCT_LOGOS.generic.dataUri;
  const badgeClass = TAG_STYLES[product.type] || TAG_STYLES.Other;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
          <img src={cover} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {product.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Digital Download</p>
          <h3 className="mt-1 text-xl font-bold text-gray-900">{product.title}</h3>
          {product.titleBn && <p className="font-bengali text-sm text-gray-500">{product.titleBn}</p>}
          {product.description && <p className="mt-3 text-sm text-gray-600 line-clamp-3">{product.description}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-2xl font-black text-gray-900">৳ {product.price}</p>
          </div>
          <Link href={`/products/${product._id}`}>
            <Button className="gap-2">
              View Details <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ProductsLanding() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("https://technicalcomputer.tech/products");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/products`);
    }
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load digital products right now.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [products]);

  const handleCopyShareUrl = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Store link copied");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] px-6 py-16 text-white lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Instant Digital Downloads</p>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Professionally curated <span className="text-sky-300">software, templates & design assets</span> for Bangladeshi learners.
              </h1>
              <p className="text-lg text-white/80">
                Every product is vetted by TCTC instructors. Students get lifetime access once their payment is verified by our team.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-white/90">
                  <Link href="#catalog">Browse Products</Link>
                </Button>
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={handleCopyShareUrl}>
                  <Copy className="mr-2 h-4 w-4" /> Copy public link
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <FeatureBadge icon={Sparkles} title="Curated" subtitle="Hand-picked by instructors" />
                <FeatureBadge icon={ShieldCheck} title="Verified" subtitle="Manual payment approval" />
                <FeatureBadge icon={Download} title="Instant" subtitle="Download link unlocks" />
              </div>
            </div>
            <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">Shareable URL</p>
              <p className="mt-3 text-2xl font-bold">{shareUrl}</p>
              <p className="mt-4 text-sm text-white/70">
                Share this link with students or publish it on social media to showcase all active digital products.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Layers className="h-4 w-4" /> {products.length} live items
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Star className="h-4 w-4" /> Secure delivery
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-sky-500/30 blur-3xl" />
      </section>

      <section id="catalog" className="container mx-auto mt-12 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-3 pb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">Catalog</p>
          <h2 className="text-3xl font-black text-slate-900">Explore everything available today</h2>
          <p className="text-base text-slate-600">All resources become downloadable inside your dashboard once payment is verified.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-xl font-semibold text-slate-800">No digital products are live yet.</p>
            <p className="mt-2 text-slate-500">Ask the admin to publish at least one product from the dashboard.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto mt-16 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-sm md:flex-row md:items-center md:p-12">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">Need a custom bundle?</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">We can assemble software + templates for your institution.</h3>
            <p className="mt-3 text-slate-600">Ping us via the contact page or WhatsApp number and mention the products you need. We will enable them in this catalog so your students can pay safely.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/#contact">
                Talk to Support <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="border-slate-300" asChild>
              <Link href="/contact">Visit Contact Page</Link>
            </Button>
          </div>
        </div>
      </section>

      <ContactSection bgClass="bg-slate-50" className="pt-12" />
    </div>
  );
}
