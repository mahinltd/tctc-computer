"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Users, Filter, Search, Eye, X, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await api.get("/admissions");
        setAdmissions(res.data || []);
      } catch (error) {
        console.error("Admin admissions fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to load admissions");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, []);

  const stats = useMemo(() => {
    const total = admissions.length;
    const pending = admissions.filter((a) => a.status === "pending").length;
    const approved = admissions.filter((a) => a.status === "approved").length;
    const rejected = admissions.filter((a) => a.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [admissions]);

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((admission) => {
      const matchesStatus = statusFilter === "all" || admission.status === statusFilter;
      const text = `${admission?.user?.name || ""} ${admission?.user?.email || ""} ${admission?.course?.title || ""}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [admissions, statusFilter, search]);

  const statusStyles = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    approved: "bg-green-50 text-green-700 border border-green-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" /> Admissions
          </h1>
          <p className="text-gray-500 text-sm">Review every application, payment state, and supporting documents.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[{ label: "Total", value: stats.total }, { label: "Pending", value: stats.pending }, { label: "Approved", value: stats.approved }, { label: "Rejected", value: stats.rejected }].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2 text-center border border-gray-100">
              <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:w-1/2">
          <Label className="flex items-center gap-2 text-gray-600"><Search className="h-4 w-4" /> Search</Label>
          <Input
            className="mt-1"
            placeholder="Search by student, email, or course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
          <Label className="flex items-center gap-2 text-gray-600"><Filter className="h-4 w-4" /> Status</Label>
          <select
            className="mt-1 w-full border rounded-md h-10 px-3 bg-gray-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Admissions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </section>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b">
          <div className="col-span-3 px-4 py-3">Student</div>
          <div className="col-span-3 px-4 py-3">Course</div>
          <div className="col-span-2 px-4 py-3">Session</div>
          <div className="col-span-2 px-4 py-3">Payment</div>
          <div className="col-span-1 px-4 py-3">Status</div>
          <div className="col-span-1 px-4 py-3 text-right">Action</div>
        </div>
        {filteredAdmissions.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No admissions match the current filters.</div>
        ) : (
          <div className="divide-y">
            {filteredAdmissions.map((admission) => (
              <div key={admission._id} className="grid grid-cols-12 px-4 py-4 text-sm items-center">
                <div className="col-span-3">
                  <p className="font-semibold text-gray-900">{admission.user?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="h-3 w-3" /> {admission.user?.email || "n/a"}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {admission.guardianPhone}</p>
                </div>
                <div className="col-span-3">
                  <p className="font-semibold text-gray-900">{admission.course?.title}</p>
                  <p className="text-xs text-gray-500">Fee: ৳{admission.course?.fee}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold text-gray-900">{admission.session}</p>
                  <p className="text-xs text-gray-500">Submitted {new Date(admission.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  {admission.paymentId ? (
                    <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">Payment Submitted</span>
                  ) : (
                    <span className="text-orange-600 font-semibold text-xs bg-orange-50 px-2 py-1 rounded border border-orange-200">Awaiting Payment</span>
                  )}
                </div>
                <div className="col-span-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full block text-center ${statusStyles[admission.status] || "bg-gray-100 text-gray-600"}`}>
                    {admission.status?.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <Button size="sm" variant="outline" onClick={() => setSelected(admission)} className="gap-1">
                    <Eye className="h-4 w-4" /> View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <p className="text-sm text-gray-500">Admission ID: {selected._id}</p>
                <h3 className="text-xl font-bold">{selected.user?.name}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase text-gray-500">Student Details</h4>
                <p className="text-sm text-gray-700">Email: {selected.user?.email}</p>
                <p className="text-sm text-gray-700">Guardian Phone: {selected.guardianPhone}</p>
                <p className="text-sm text-gray-700">NID/Birth No: {selected.nidOrBirthCert}</p>
                <p className="text-sm text-gray-700 flex items-start gap-2"><MapPin className="h-4 w-4 text-primary" /> {selected.presentAddress}</p>
                <div className="flex gap-3">
                  {selected.photoUrl && <img src={selected.photoUrl} alt="Applicant" className="h-24 w-24 rounded-lg object-cover border" />}
                  {selected.signatureUrl && <img src={selected.signatureUrl} alt="Signature" className="h-16 object-contain border rounded-lg bg-gray-50" />}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase text-gray-500">Course & Payment</h4>
                <p className="text-sm text-gray-700">Course: {selected.course?.title}</p>
                <p className="text-sm text-gray-700">Session: {selected.session}</p>
                <p className="text-sm text-gray-700">Status: {selected.status}</p>
                <p className="text-sm text-gray-700">Payment: {selected.paymentId ? "Submitted" : "Not Submitted"}</p>
                <p className="text-xs text-gray-500">Created at {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
