"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Smartphone, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [admission, setAdmission] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  const [formData, setFormData] = useState({
    paymentMethod: "bkash",
    senderMobile: "",
    transactionId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ FIXED: সরাসরি নির্দিষ্ট আইডি দিয়ে ডাটা আনা হচ্ছে
        // এটি আগের চেয়ে অনেক ফাস্ট এবং নির্ভুল
        const admRes = await api.get(`/admissions/${id}`);
        setAdmission(admRes.data);

        // Fetch Payment Methods
        const methodRes = await api.get("/payments/methods");
        setPaymentMethods(methodRes.data);

        if (methodRes.data.length > 0) {
          setFormData(prev => ({...prev, paymentMethod: methodRes.data[0].methodName.toLowerCase()}));
        }

      } catch (error) {
        console.error("Payment Page Error:", error);
        // নির্দিষ্ট এরর মেসেজ দেখানো
        const msg = error.response?.data?.message || "Admission record not found!";
        toast.error(msg);
        
        // এরর হলে ৩ সেকেন্ড পর ড্যাশবোর্ডে পাঠাবে
        setTimeout(() => router.push("/dashboard"), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Number copied!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        sourceType: 'admission',
        sourceId: id, 
        paymentMethod: formData.paymentMethod,
        senderMobile: formData.senderMobile,
        transactionId: formData.transactionId,
        amount: admission.course.fee 
      };

      const res = await api.post("/payments", payload);

      if (res.status === 201) {
        toast.success("Payment submitted! Wait for verification.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary h-10 w-10"/></div>;

  const fee = admission?.course?.fee || 0;
  const charge = 30;
  const total = fee + charge;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          
          <div className="bg-primary p-6 text-center text-white">
            <h1 className="text-2xl font-bold">Complete Your Payment</h1>
            <p className="opacity-90 mt-1">Course: {admission?.course?.title}</p>
          </div>

          <div className="p-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-center">
               <p className="text-gray-600 text-sm">Course Fee: ৳{fee} + Charge: ৳{charge}</p>
               <h2 className="text-4xl font-extrabold text-primary mt-2">৳{total}</h2>
               <p className="text-red-500 text-xs mt-2 font-bold animate-pulse">
                 *Please Send Money exactly this amount
               </p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-secondary" /> Step 1: Send Money
              </h3>
              
              <div className="space-y-3">
                {paymentMethods.length > 0 ? paymentMethods.map((method, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-xs
                        ${method.methodName.toLowerCase().includes('bkash') ? 'bg-pink-600' : 
                          method.methodName.toLowerCase().includes('nagad') ? 'bg-orange-500' : 'bg-purple-600'}`}>
                        {method.methodName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{method.methodName}</p>
                        <p className="text-xs text-gray-500">{method.accountType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded border">
                      <span className="font-mono font-bold text-lg text-gray-700">{method.number}</span>
                      <button onClick={() => handleCopy(method.number)} className="text-gray-500 hover:text-primary" title="Copy Number">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-200">
                    No active payment numbers found. Please contact Admin.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-secondary" /> Step 2: Submit Details
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label>Payment Method Used</Label>
                  <select 
                    className="w-full h-11 px-3 border rounded-md bg-white mt-1"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  >
                    {paymentMethods.map(m => (
                        <option key={m._id} value={m.methodName.toLowerCase()}>{m.methodName}</option>
                    ))}
                    {paymentMethods.length === 0 && <option value="bkash">bKash</option>}
                  </select>
                </div>

                <div>
                  <Label>Sender Mobile Number</Label>
                  <Input 
                    required 
                    type="number"
                    placeholder="e.g. 017XXXXXXXX" 
                    value={formData.senderMobile}
                    onChange={(e) => setFormData({...formData, senderMobile: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">The number you sent money from.</p>
                </div>

                <div>
                  <Label>Transaction ID (TrxID)</Label>
                  <Input 
                    required 
                    placeholder="e.g. 8N7A6D5..." 
                    className="uppercase font-mono placeholder:normal-case"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Check your SMS for the TrxID.</p>
                </div>

                <Button type="submit" disabled={submitting} className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700">
                  {submitting ? <Loader2 className="animate-spin mr-2"/> : "Confirm Payment"}
                </Button>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}