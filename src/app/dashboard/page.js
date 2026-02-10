"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// ❌ Navbar import removed because it is handled in ClientLayout
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  BookOpen, 
  LogOut, 
  LayoutDashboard, 
  Video, 
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Phone,
  Download
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses"); // ডিফল্ট ট্যাব
  const [downloads, setDownloads] = useState([]);
  const [downloadsLoading, setDownloadsLoading] = useState(false);
  const [downloadsFetched, setDownloadsFetched] = useState(false);

  // --- ডাটা ফেচ করা ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ব্যাকএন্ড থেকে প্রোফাইল এবং কোর্সের তথ্য আনা হচ্ছে
        const res = await api.get("/dashboard/student");
        setData(res.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
        
        // যদি লগইন টোকেন মেয়াদোত্তীর্ণ হয়ে যায়
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          router.push("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (activeTab !== "downloads" || downloadsFetched) return;

    const loadDownloads = async () => {
      setDownloadsLoading(true);
      try {
        const res = await api.get("/payments/my/downloads");
        setDownloads(res.data);
      } catch (error) {
        console.error("Download list error:", error);
        toast.error(error.response?.data?.message || "Unable to load downloads");
      } finally {
        setDownloadsLoading(false);
        setDownloadsFetched(true);
      }
    };

    loadDownloads();
  }, [activeTab, downloadsFetched]);

  // --- লগআউট ফাংশন ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleDownloadInvoice = async (paymentId) => {
    if (!paymentId) {
      toast.error("Invoice will be available after payment verification.");
      return;
    }

    const toastId = toast.loading("Preparing invoice...");
    try {
      const res = await api.get(`/dashboard/receipt/${paymentId}`);
      const receipt = res.data;

      const formatCurrency = (value) => `৳${Number(value || 0).toLocaleString()}`;
      const formatDate = (value) => (value ? new Date(value).toLocaleString() : new Date().toLocaleString());

      const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice - ${receipt.receiptNo || "TCTC"}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 32px; color: #0f172a; }
    h1 { margin: 0; }
    .section { margin-top: 24px; }
    .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .muted { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div style="display:flex; justify-content: space-between; align-items: center;">
    <div>
      <p class="muted">Receipt Number</p>
      <h1>${receipt.receiptNo || "Pending"}</h1>
      <p class="muted">Issued on ${formatDate(receipt.date)}</p>
    </div>
    <div style="text-align:right;">
      <h2 style="margin:0; color:#0ea5e9;">Technical Computer Training Center</h2>
      <p style="margin:4px 0; color:#475569;">Polytechnic College Mor, Khalishpur, Khulna</p>
      <p style="margin:4px 0; color:#475569;">info@technicalcomputer.tech</p>
    </div>
  </div>

  <div class="section grid">
    <div class="box">
      <p class="muted">Student</p>
      <p style="font-weight:600; font-size:18px; margin:4px 0;">${receipt.studentDetails?.name || ""}</p>
      <p style="margin:2px 0;">Student ID: ${receipt.studentDetails?.studentId || "Processing"}</p>
      <p style="margin:2px 0;">Email: ${receipt.studentDetails?.email || ""}</p>
      <p style="margin:2px 0;">Phone: ${receipt.studentDetails?.phone || ""}</p>
    </div>
    <div class="box">
      <p class="muted">Course / Service</p>
      <p style="font-weight:600; font-size:18px; margin:4px 0;">${receipt.itemDetails?.itemName || "Course"}</p>
      <p style="margin:2px 0;">Type: ${receipt.itemDetails?.type || "Admission"}</p>
      <p style="margin:2px 0;">Roll No: ${receipt.itemDetails?.rollNo || "Pending"}</p>
      <p style="margin:2px 0;">Payment Method: ${(receipt.paymentDetails?.method || "").toUpperCase()}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Transaction ID</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${receipt.itemDetails?.itemName || "Course Fee"}</td>
        <td>${receipt.paymentDetails?.trxId || "N/A"}</td>
        <td>${formatCurrency(receipt.paymentDetails?.amount)}</td>
      </tr>
      <tr>
        <td>Transaction/Service Fee</td>
        <td></td>
        <td>${formatCurrency(receipt.paymentDetails?.fee)}</td>
      </tr>
      <tr>
        <td style="font-weight:600;">Total Paid</td>
        <td></td>
        <td style="font-weight:600;">${formatCurrency(receipt.paymentDetails?.total)}</td>
      </tr>
    </tbody>
  </table>

  <p class="muted" style="margin-top:32px;">This is a system generated receipt. No signature is required.</p>
</body>
</html>`;

      const printWindow = window.open("", "_blank", "width=900,height=650");
      if (!printWindow) {
        throw new Error("Please allow pop-ups to download the invoice.");
      }

      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();

      toast.success("Invoice ready.", { id: toastId });
    } catch (error) {
      console.error("Invoice download error:", error);
      toast.error(error.response?.data?.message || "Failed to generate invoice", { id: toastId });
    }
  };

  const handleProductDownload = async (productId, title) => {
    const toastId = toast.loading("Unlocking download...");
    try {
      const res = await api.get(`/products/download/${productId}`);
      const fileUrl = res.data?.fileUrl;
      if (!fileUrl) throw new Error("Download link missing");
      window.open(fileUrl, "_blank", "noopener");
      toast.success(`${title || "File"} ready`, { id: toastId });
    } catch (error) {
      console.error("Product download error:", error);
      toast.error(error.response?.data?.message || "Unable to fetch download link", { id: toastId });
    }
  };

  const handleRefreshDownloads = () => {
    setDownloadsFetched(false);
  };

  const formatDownloadDate = (value) => (value ? new Date(value).toLocaleString() : "Awaiting verification");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // ডাটা না থাকলে কিছুই দেখাবে না
  if (!data) return null;

  const { studentProfile, enrolledCourses } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ❌ <Navbar /> এখানে মুছে ফেলা হয়েছে, কারণ Layout এটি অটোমেটিক দেখাবে */}

      <div className="flex flex-1 container py-8 gap-8 px-4 flex-col md:flex-row">
        
        {/* --- বাম পাশের সাইডবার (Sidebar) --- */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
            
            {/* প্রোফাইল ছবি ও নাম */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b">
              <div className="h-24 w-24 bg-gray-100 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
                {studentProfile.photoUrl ? (
                   <img src={studentProfile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                   <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">
                     <UserCircle className="h-16 w-16" />
                   </div>
                )}
              </div>
              <h3 className="font-bold text-xl text-center text-gray-800">{studentProfile.name}</h3>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                {studentProfile.studentId || "ID: Processing"}
              </p>
              <div className="mt-3 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-bold uppercase tracking-wide border border-blue-100">
                Student Portal
              </div>
            </div>

            {/* নেভিগেশন মেনু */}
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("courses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "courses" ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-gray-50 text-gray-600"}`}
              >
                <BookOpen className="h-5 w-5" /> My Courses
              </button>
              
              <button 
                onClick={() => setActiveTab("classes")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "classes" ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-gray-50 text-gray-600"}`}
              >
                <Video className="h-5 w-5" /> Live Classes
              </button>

              <button 
                onClick={() => setActiveTab("downloads")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "downloads" ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-gray-50 text-gray-600"}`}
              >
                <Download className="h-5 w-5" /> Digital Downloads
              </button>

              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "profile" ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-gray-50 text-gray-600"}`}
              >
                <LayoutDashboard className="h-5 w-5" /> Profile Info
              </button>
            </nav>

            {/* লগআউট বাটন */}
            <div className="mt-8 pt-6 border-t">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* --- প্রধান কন্টেন্ট এরিয়া --- */}
        <main className="flex-1 space-y-6">
          
          {/* === ট্যাব ১: আমার কোর্সসমূহ === */}
          {activeTab === "courses" && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Enrolled Courses</h2>
                <Button onClick={() => router.push("/#courses")} variant="outline" size="sm">
                  + Add New Course
                </Button>
              </div>
              
              {enrolledCourses.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border text-center flex flex-col items-center">
                   <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="h-10 w-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-bold mb-2 text-gray-800">No Courses Yet</h3>
                   <p className="text-muted-foreground mb-6 max-w-sm">You haven't enrolled in any courses. Browse our catalog to get started.</p>
                   <Button onClick={() => router.push("/#courses")}>Browse Courses</Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {enrolledCourses.map((item, idx) => {
                    const { admissionInfo } = item;
                    const course = admissionInfo.course;
                    const isPaid = !!admissionInfo.paymentId; // পেমেন্ট করা আছে কিনা
                    
                    return (
                      <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                             {/* স্ট্যাটাস আইকন */}
                             {admissionInfo.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-500" />}
                             {admissionInfo.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                             {admissionInfo.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                            <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">Session: {admissionInfo.session || "N/A"}</span>
                            <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">Fee: ৳{course.fee}</span>
                          </p>
                          
                          {/* ব্যাজসমূহ */}
                          <div className="flex flex-wrap items-center gap-3">
                            {/* অ্যাডমিশন স্ট্যাটাস */}
                            <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase border ${
                              admissionInfo.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                              admissionInfo.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                              Admission: {admissionInfo.status}
                            </span>

                            {/* পেমেন্ট স্ট্যাটাস */}
                            <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase border ${
                              isPaid ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              Payment: {isPaid ? "Completed" : "Pending"}
                            </span>
                          </div>
                        </div>

                        {/* অ্যাকশন বাটন */}
                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[160px]">
                           {/* যদি পেন্ডিং থাকে এবং টাকা না দিয়ে থাকে -> Pay Now বাটন আসবে */}
                           {admissionInfo.status === 'pending' && !isPaid && (
                             <Button 
                               onClick={() => router.push(`/payment/${admissionInfo._id}`)}
                               className="bg-primary hover:bg-primary/90 text-white w-full font-bold shadow-md shadow-primary/20"
                             >
                               <CreditCard className="w-4 h-4 mr-2"/> Pay Now
                             </Button>
                           )}

                           {/* যদি টাকা দেওয়া থাকে কিন্তু অ্যাপ্রুভ হয়নি */}
                           {isPaid && admissionInfo.status === 'pending' && (
                             <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-100 text-xs font-medium text-yellow-800">
                               Waiting for Admin Approval
                             </div>
                           )}
                           
                           {/* যদি অ্যাপ্রুভ হয়ে যায় -> ক্লাসে এক্সেস বাটন */}
                           {admissionInfo.status === 'approved' && (
                             <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 w-full font-bold">
                               Access Course
                             </Button>
                           )}

                           {admissionInfo.paymentId?.status === 'verified' && (
                             <Button
                               variant="outline"
                               className="border-slate-200 text-slate-700 hover:bg-slate-50 w-full font-bold"
                               onClick={() => handleDownloadInvoice(admissionInfo.paymentId._id)}
                             >
                               <Download className="w-4 h-4 mr-2" /> Download Invoice
                             </Button>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* === ট্যাব ২: ডিজিটাল ডাউনলোড === */}
          {activeTab === "downloads" && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Digital Downloads</h2>
                  <p className="text-sm text-muted-foreground">Access verified product purchases anytime.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshDownloads}
                  disabled={downloadsLoading}
                >
                  Refresh
                </Button>
              </div>

              {downloadsLoading ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-gray-500">Fetching your files...</p>
                </div>
              ) : downloads.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border text-center flex flex-col items-center">
                  <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Download className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">No downloads yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Purchase any digital product and, once verified, your secure download links will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {downloads.map((item) => (
                    <div
                      key={item.paymentId}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-48 h-40 rounded-lg overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center text-gray-400 text-sm">Preview Unavailable</div>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold w-fit">
                              ৳{Number(item.price || 0).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description || "Ready-to-use digital resource from TCTC store."}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
                            <span className="px-3 py-1 rounded-full bg-gray-100">Type: {item.type}</span>
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700">
                              Verified {formatDownloadDate(item.verifiedAt)}
                            </span>
                            {item.receiptNo && (
                              <span className="px-3 py-1 rounded-full bg-slate-100">Receipt {item.receiptNo}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full lg:w-44">
                          <Button
                            className="w-full font-bold"
                            onClick={() => handleProductDownload(item.productId, item.title)}
                          >
                            <Download className="w-4 h-4 mr-2" /> Download File
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full font-bold"
                            onClick={() => handleDownloadInvoice(item.paymentId)}
                          >
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === ট্যাব ৩: লাইভ ক্লাস === */}
          {activeTab === "classes" && (
             <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold text-gray-800">My Live Classes</h2>
                
                {enrolledCourses.every(item => item.classes.length === 0) ? (
                   <div className="bg-white p-12 rounded-xl shadow-sm border text-center flex flex-col items-center">
                      <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Video className="h-10 w-10 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">No Scheduled Classes</h3>
                      <p className="text-muted-foreground max-w-sm">Classes will appear here once your admission is approved and a schedule is assigned.</p>
                   </div>
                ) : (
                   <div className="grid gap-4">
                     {enrolledCourses.map((item) => (
                        item.classes.map((cls, cIdx) => (
                          <div key={cIdx} className="bg-white p-6 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                             <div>
                               <h4 className="font-bold text-lg text-gray-800">{cls.title}</h4>
                               <p className="text-sm text-gray-500 mt-1">Course: {item.admissionInfo.course.title}</p>
                               <div className="flex items-center gap-2 mt-3 text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded w-fit">
                                 <Clock className="w-3 h-3"/>
                                 {cls.scheduledAt ? new Date(cls.scheduledAt).toLocaleString() : "TBA"}
                               </div>
                             </div>
                             <a 
                               href={cls.meetingLink} 
                               target="_blank" 
                               rel="noreferrer"
                               className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                             >
                               Join Class
                             </a>
                          </div>
                        ))
                     ))}
                   </div>
                )}
             </div>
          )}

           {/* === ট্যাব ৪: প্রোফাইল ইনফো (ফোন নম্বর সহ) === */}
           {activeTab === "profile" && (
             <div className="bg-white p-8 rounded-xl shadow-sm border animate-in fade-in zoom-in duration-300">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b">
                  <UserCircle className="h-6 w-6 text-primary" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium">
                        {studentProfile.name}
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium">
                        {studentProfile.email}
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Student ID</label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium font-mono">
                        {studentProfile.studentId || "Not Assigned"}
                      </div>
                   </div>
                   {/* ✅ ফোন নম্বর এখন দেখাবে */}
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400"/>
                        {studentProfile.phone || "Not Provided"}
                      </div>
                   </div>
                </div>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}