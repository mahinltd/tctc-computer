"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Trash2,
  Plus,
  Package,
  FileText,
  ExternalLink,
  FileCode,
  FileType,
  CheckCircle2,
  PauseCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCT_PRESETS, PRODUCT_LOGOS } from "@/data/productCatalog";

const INITIAL_FORM = {
  title: "",
  titleBn: "",
  type: "PDF",
  price: "",
  thumbnailUrl: "",
  fileUrl: "",
  description: "",
  logoKey: "generic",
  transactionFee: "",
  isActive: true
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  const logoOptions = Object.entries(PRODUCT_LOGOS);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/admin");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setSelectedPresetId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.fileUrl) {
      return toast.error("Please fill required fields (Title, Price, File URL)");
    }

    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        transactionFee: formData.transactionFee ? Number(formData.transactionFee) : undefined,
        thumbnailUrl: formData.thumbnailUrl || PRODUCT_LOGOS[formData.logoKey]?.dataUri
      };

      await api.post("/products", payload);
      toast.success("Product created successfully!");

      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Create Error:", error.response?.data);
      const msg = error.response?.data?.message || "Failed to create product. Check inputs.";
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const payload = {
        title: product.title,
        titleBn: product.titleBn,
        type: product.type,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        fileUrl: product.fileUrl,
        description: product.description,
        logoKey: product.logoKey,
        transactionFee: product.transactionFee,
        isActive: !product.isActive
      };
      await api.put(`/products/${product._id}`, payload);
      toast.success(`Product ${product.isActive ? "paused" : "activated"}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handlePresetApply = (preset) => {
    setSelectedPresetId(preset.id);
    setShowForm(true);
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      titleBn: preset.titleBn || "",
      type: preset.type,
      price: preset.price?.toString() || "",
      description: preset.description || prev.description,
      fileUrl: preset.fileUrl || prev.fileUrl,
      thumbnailUrl: preset.thumbnailUrl,
      logoKey: preset.logoKey || "generic",
      transactionFee: preset.transactionFee ? preset.transactionFee.toString() : "",
      isActive: true
    }));
  };

  const renderLogo = (product) => {
    const fallback = PRODUCT_LOGOS[product.logoKey]?.dataUri || PRODUCT_LOGOS.generic.dataUri;
    const src = product.thumbnailUrl || fallback;
    return (
      <div className="h-14 w-14 rounded-lg overflow-hidden border flex items-center justify-center bg-gray-50">
        <img src={src} alt={product.title} className="h-full w-full object-cover" />
      </div>
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Software":
        return <FileCode className="h-4 w-4 text-purple-600" />;
      case "Doc":
        return <FileType className="h-4 w-4 text-blue-600" />;
      case "AI":
        return <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1 rounded">Ai</span>;
      case "PSD":
        return <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1 rounded">Ps</span>;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-7 w-7 text-primary" /> Digital Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage PDF, Software, Templates & Files.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 shadow-lg shadow-primary/20">
          {showForm ? "Cancel" : (
            <>
              <Plus className="w-4 h-4" /> Add New Product
            </>
          )}
        </Button>
      </div>

      <div className="bg-white p-8 rounded-xl border border-blue-100 shadow-lg animate-in slide-in-from-top-4">
        <h3 className="font-bold text-lg mb-6 text-gray-800 pb-2 border-b">Instant Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRODUCT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetApply(preset)}
              className={`flex items-center gap-3 p-4 border rounded-xl text-left transition hover:shadow-md ${selectedPresetId === preset.id ? "border-primary bg-primary/5" : "border-gray-200"}`}
            >
              <div className="h-12 w-12 rounded-lg overflow-hidden border">
                <img src={preset.thumbnailUrl} alt={preset.title} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{preset.title}</p>
                <p className="text-xs text-gray-500">৳ {preset.price} · {preset.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-xl border border-blue-100 shadow-lg animate-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-6 text-gray-800 pb-2 border-b">Product Details</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Product Title (English) *</Label>
              <Input
                placeholder="e.g. Office 2021 Activator / CV Template"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Product Title (Bangla)</Label>
              <Input
                placeholder="e.g. অফিস এক্টিভেটর / সিভি টেমপ্লেট"
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                className="font-bengali"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Price (BDT) *</Label>
              <Input
                type="number"
                placeholder="e.g. 150"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Product Type *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="PDF">PDF / E-book</option>
                <option value="Doc">Microsoft Word (Doc)</option>
                <option value="Software">Software / Tool</option>
                <option value="AI">Adobe Illustrator (AI)</option>
                <option value="PSD">Adobe Photoshop (PSD)</option>
                <option value="Template">Other Template</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Thumbnail Image URL</Label>
              <Input
                placeholder="https://imgur.com/image.jpg"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              />
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <div className="h-10 w-10 rounded-md overflow-hidden border bg-gray-50">
                  {formData.thumbnailUrl ? (
                    <img src={formData.thumbnailUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-4 w-4 text-gray-400 m-3" />
                  )}
                </div>
                <span>Leave empty to auto-use the logo preset.</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Download File URL *</Label>
              <Input
                placeholder="https://drive.google.com/file/..."
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Logo Preset</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.logoKey}
                onChange={(e) => setFormData({ ...formData, logoKey: e.target.value })}
              >
                {logoOptions.map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label} · {key}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Transaction Fee (optional)</Label>
              <Input
                type="number"
                placeholder="e.g. 15"
                value={formData.transactionFee}
                onChange={(e) => setFormData({ ...formData, transactionFee: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="font-semibold text-gray-700">Description</Label>
              <textarea
                placeholder="Short description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <Button type="submit" disabled={submitLoading} className="w-full font-bold h-11">
                {submitLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50">
          <h3 className="font-bold text-gray-700">All Products ({products.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Product Info</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Price & Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {renderLogo(prod)}
                      <div>
                        <p className="font-bold text-gray-800 text-base">{prod.title}</p>
                        <p className="text-xs text-gray-500 font-bengali">{prod.titleBn}</p>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          {prod.fileUrl && (
                            <a
                              href={prod.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" /> File
                            </a>
                          )}
                          <span className="capitalize">{prod.logoKey || "generic"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(prod.type)}
                      <span className="font-medium text-gray-700">{prod.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="font-bold text-green-600 text-base">৳ {prod.price}</span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          prod.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {prod.isActive ? <CheckCircle2 className="h-3 w-3" /> : <PauseCircle className="h-3 w-3" />}
                        {prod.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(prod)} className="h-9 px-3">
                        {prod.isActive ? "Pause" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(prod._id)}
                        className="h-9 px-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300 shadow-none"
                      >
                        <Trash2 className="h-4 w-4" /> <span className="ml-2 hidden md:inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400">
                    <p>No digital products found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}