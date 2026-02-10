"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//import Navbar from "@/components/Navbar";
import {
  Users,
  CreditCard,
  BookOpen,
  TrendingUp,
  Loader2,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // 🔐 Backend is the only authority
        const res = await api.get("/dashboard/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Admin Stats Error:", error);

        if (error.response?.status === 403) {
          toast.error("Access Denied! Admins only.");
          router.push("/dashboard");
        } else if (error.response?.status === 401) {
          router.push("/auth");
        } else {
          toast.error("Failed to load admin data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* <Navbar /> */}

      <div className="container max-w-7xl mx-auto mt-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-500">Overview & Controls</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">
                Total Students
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.totalStudents}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">
                Total Admissions
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.totalAdmissions}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">
                Total Revenue
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                ৳{stats.totalIncome}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">
                Recent Payments
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.recentPayments?.length || 0}
              </h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">
              Recent Payment Activity
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Trx ID</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentPayments?.length > 0 ? (
                  stats.recentPayments.map((pay) => (
                    <tr key={pay._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">
                        {pay.user?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-600">
                        ৳{pay.totalAmount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {pay.paymentMethod}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {pay.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            pay.status === "verified"
                              ? "bg-green-100 text-green-700"
                              : pay.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No recent payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
