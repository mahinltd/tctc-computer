"use client";

import { useState, useEffect, Fragment } from "react";
import { Loader2, Check, X, Trash2, Search, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID of processing item
  const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState(null);

  // ১. পেমেন্ট লিস্ট লোড করা
  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments"); // Admin Route
      setPayments(res.data);
      setFilteredPayments(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ২. সার্চ ফিল্টার লজিক
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = payments.filter(p => 
        (p.user?.name && p.user.name.toLowerCase().includes(lowerSearch)) || 
        (p.transactionId && p.transactionId.toLowerCase().includes(lowerSearch)) ||
        (p.senderMobile && p.senderMobile.includes(lowerSearch))
    );
    setFilteredPayments(filtered);
  }, [search, payments]);

    const toggleDetails = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const formatDateTime = (value) => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleString();
        } catch (error) {
            return value;
        }
    };

    const renderSourceDetails = (payment) => {
        const meta = payment.sourceDetails;
        const badgeColors = {
            product: "bg-blue-100 text-blue-700",
            admission: "bg-purple-100 text-purple-700",
            course: "bg-amber-100 text-amber-700"
        };
        const badgeClass = meta ? (badgeColors[meta.type] || "bg-gray-100 text-gray-700") : "bg-gray-100 text-gray-700";
        const baseAmount = payment.amount ?? 0;
        const feeAmount = payment.transactionFee ?? 0;
        const totalAmount = payment.totalAmount ?? (baseAmount + feeAmount);

        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-inner">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Source Details</p>
                        {meta ? (
                            <>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                    <span className={`rounded-full px-2 py-0.5 font-semibold ${badgeClass}`}>{meta.type}</span>
                                    <span className="font-mono">ID: {payment.sourceId}</span>
                                </div>
                                <h4 className="mt-2 text-xl font-bold text-gray-900">{meta.title}</h4>
                                <div className="mt-3 space-y-1 text-sm text-gray-600">
                                    {meta.productType && <p><span className="font-semibold">Type:</span> {meta.productType}</p>}
                                    {meta.price !== undefined && <p><span className="font-semibold">Price:</span> ৳{meta.price}</p>}
                                    {meta.fee !== undefined && <p><span className="font-semibold">Fee:</span> ৳{meta.fee}</p>}
                                    {meta.duration && <p><span className="font-semibold">Duration:</span> {meta.duration}</p>}
                                    {meta.session && <p><span className="font-semibold">Session:</span> {meta.session}</p>}
                                    {meta.status && <p><span className="font-semibold">Admission Status:</span> {meta.status}</p>}
                                </div>
                                {meta.description && <p className="mt-3 text-sm text-gray-500">{meta.description}</p>}
                            </>
                        ) : (
                            <p className="mt-2 text-sm text-gray-500">No linked resource information found.</p>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Payment Summary</p>
                        <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <p><span className="font-semibold">Buyer:</span> {payment.user?.name || "Unknown"} ({payment.user?.studentId || "—"})</p>
                            <p><span className="font-semibold">Phone:</span> {payment.senderMobile || "—"}</p>
                            <p><span className="font-semibold">Method:</span> {payment.paymentMethod?.toUpperCase() || "—"}</p>
                            <p><span className="font-semibold">TrxID:</span> {payment.transactionId || "—"}</p>
                            <p>
                                <span className="font-semibold">Amount:</span> ৳{baseAmount} + ৳{feeAmount} fee = <span className="font-bold text-primary">৳{totalAmount}</span>
                            </p>
                            <p><span className="font-semibold">Submitted:</span> {formatDateTime(payment.createdAt)}</p>
                            {payment.receiptNo && <p><span className="font-semibold">Receipt:</span> {payment.receiptNo}</p>}
                            {payment.verifiedAt && <p><span className="font-semibold">Verified:</span> {formatDateTime(payment.verifiedAt)}</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

  // ৩. পেমেন্ট ভেরিফাই করা (Approve)
  const handleVerify = async (id) => {
    if(!confirm("Are you sure you want to verify this payment? This will approve the student's admission.")) return;
    
    setActionLoading(id);
    try {
        await api.put(`/payments/${id}/verify`);
        toast.success("Payment Verified & Admission Approved!");
        fetchPayments(); // লিস্ট রিফ্রেশ
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Verification failed");
    } finally {
        setActionLoading(null);
    }
  };

  // ৪. পেমেন্ট রিজেক্ট করা
  const handleReject = async (id) => {
    if(!confirm("Reject this payment? This cannot be undone.")) return;
    
    setActionLoading(id);
    try {
        await api.put(`/payments/${id}/reject`);
        toast.success("Payment Rejected");
        fetchPayments();
    } catch (error) {
        toast.error("Action failed");
    } finally {
        setActionLoading(null);
    }
  };

  // ৫. পেমেন্ট ডিলিট করা
  const handleDelete = async (id) => {
    if(!confirm("Delete this record permanently?")) return;
    try {
        await api.delete(`/payments/${id}`);
        toast.success("Record deleted");
        fetchPayments();
    } catch (error) {
        toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Verification</h1>
            <p className="text-gray-500 text-sm mt-1">Verify transactions to approve admissions.</p>
        </div>
        <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
                placeholder="Search by TrxID, Phone or Name..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b uppercase text-xs tracking-wider">
                <tr>
                <th className="p-4 font-semibold">Student Info</th>
                <th className="p-4 font-semibold">Payment Details</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredPayments.length > 0 ? filteredPayments.map((pay) => (
                <Fragment key={pay._id}>
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                        <p className="font-bold text-gray-800">{pay.user?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{pay.user?.studentId || "No ID"}</p>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
                            pay.sourceType === 'admission' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {pay.sourceType}
                        </span>
                    </td>
                    <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700 capitalize">{pay.paymentMethod}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded border font-mono text-gray-600">
                                {pay.senderMobile}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span className="font-bold">TRX:</span> 
                            <span className="font-mono bg-yellow-50 px-1 rounded text-yellow-700 border border-yellow-100">
                                {pay.transactionId}
                            </span>
                        </div>
                    </td>
                    <td className="p-4">
                        <span className="font-bold text-lg text-primary">৳{pay.totalAmount}</span>
                        <p className="text-xs text-gray-400">Fee Included</p>
                    </td>
                    <td className="p-4">
                        <div className="flex flex-col gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                                pay.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                                pay.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                                {pay.status}
                            </span>
                            <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 px-2 text-xs"
                                onClick={() => toggleDetails(pay._id)}
                            >
                                <Eye className="h-3 w-3 mr-1" /> {expandedId === pay._id ? "Hide" : "Details"}
                            </Button>
                        </div>
                    </td>
                    <td className="p-4 text-right">
                        {pay.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                                <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 shadow-sm"
                                    onClick={() => handleVerify(pay._id)}
                                    disabled={actionLoading === pay._id}
                                    title="Verify Payment"
                                >
                                    {actionLoading === pay._id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4" />}
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="destructive"
                                    className="h-8 px-3 shadow-sm"
                                    onClick={() => handleReject(pay._id)}
                                    disabled={actionLoading === pay._id}
                                    title="Reject Payment"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => handleDelete(pay._id)}
                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                    title="Delete Record"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </td>
                </tr>
                {expandedId === pay._id && (
                    <tr className="bg-gray-50/80">
                        <td colSpan="5" className="p-5">
                            {renderSourceDetails(pay)}
                        </td>
                    </tr>
                )}
                </Fragment>
                )) : (
                    <tr>
                        <td colSpan="5" className="p-10 text-center text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 opacity-20"/>
                                <p>No payments found matching your search.</p>
                            </div>
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