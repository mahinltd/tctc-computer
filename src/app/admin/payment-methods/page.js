"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus, CreditCard, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    methodName: "bKash",
    number: "",
    accountType: "Personal"
  });

  // ১. সব পেমেন্ট মেথড লোড করা
  const fetchMethods = async () => {
    try {
      const res = await api.get("/payments/methods");
      setMethods(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // ২. নতুন নাম্বার অ্যাড করা
  const handleAdd = async (e) => {
    e.preventDefault();
    if(!formData.number) return toast.error("Enter a valid number");

    try {
      await api.post("/payments/methods", formData);
      toast.success("Payment method added!");
      setFormData({ ...formData, number: "" }); // Reset number field only
      fetchMethods();
    } catch (error) {
      toast.error("Failed to add method");
    }
  };

  // ৩. নাম্বার ডিলিট করা
  const handleDelete = async (id) => {
    if(!confirm("Delete this payment number?")) return;
    try {
      await api.delete(`/payments/methods/${id}`);
      toast.success("Removed successfully");
      setMethods(methods.filter(m => m._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CreditCard className="h-7 w-7 text-primary" /> Payment Settings
            </h1>
            <p className="text-gray-500 text-sm mt-1">Configure numbers where students will send money.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- বাম পাশ: নতুন নাম্বার অ্যাড করার ফর্ম --- */}
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm h-fit">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Add New Number</h3>
            <form onSubmit={handleAdd} className="space-y-4">
                
                <div className="space-y-2">
                    <Label>Payment Provider</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {['bKash', 'Nagad', 'Rocket'].map((provider) => (
                            <div 
                                key={provider}
                                onClick={() => setFormData({...formData, methodName: provider})}
                                className={`cursor-pointer border rounded-lg p-3 text-center text-sm font-bold transition-all ${
                                    formData.methodName === provider 
                                    ? 'bg-primary text-white border-primary shadow-md' 
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                                }`}
                            >
                                {provider}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Wallet Number</Label>
                    <Input 
                        placeholder="e.g. 017XXXXXXXX" 
                        value={formData.number} 
                        onChange={e => setFormData({...formData, number: e.target.value})} 
                        required 
                        className="font-mono text-lg tracking-wide"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Account Type</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.accountType}
                        onChange={e => setFormData({...formData, accountType: e.target.value})}
                    >
                        <option value="Personal">Personal</option>
                        <option value="Agent">Agent</option>
                        <option value="Merchant">Merchant</option>
                    </select>
                </div>

                <Button type="submit" className="w-full font-bold gap-2">
                    <Plus className="w-4 h-4" /> Add Payment Method
                </Button>
            </form>
        </div>

        {/* --- ডান পাশ: একটিভ মেথড লিস্ট --- */}
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800 px-1">Active Numbers</h3>
            
            {methods.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border border-dashed text-center text-gray-400">
                    <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-20"/>
                    <p>No payment methods added yet.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {methods.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center group hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                {/* আইকন/লোগো */}
                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm
                                    ${item.methodName === 'bKash' ? 'bg-[#e2136e]' : 
                                      item.methodName === 'Nagad' ? 'bg-[#f7941d]' : 
                                      'bg-[#8c3494]'}`
                                }>
                                    {item.methodName}
                                </div>
                                
                                <div>
                                    <p className="font-mono font-bold text-lg text-gray-800">{item.number}</p>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded border uppercase font-medium">
                                        {item.accountType}
                                    </span>
                                </div>
                            </div>

                            <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleDelete(item._id)}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}