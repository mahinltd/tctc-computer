"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Upload, User, Calendar, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function AdmissionForm() {
  const { courseId } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "Male",
    religion: "Islam",
    maritalStatus: "Single",
    nidOrBirthCert: "",
    presentAddress: "",
    guardianPhone: "",
    session: new Date().getFullYear().toString(),
    photoUrl: "",
    signatureUrl: ""
  });

    // Fetch course info and ensure duplicate admissions redirect to payment flow
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [courseRes, myAdmissionsRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get("/admissions/my"),
                ]);

                setCourse(courseRes.data);

                const existingAdmission = myAdmissionsRes.data.find(
                    (admission) => admission.course?._id === courseId
                );

                if (existingAdmission) {
                    toast.success("You already submitted this admission. Redirecting to payment...");
                    router.push(`/payment/${existingAdmission._id}`);
                    return;
                }
            } catch (error) {
                console.error("Admission form init error:", error);
                toast.error(error.response?.data?.message || "Course not found");
                router.push("/dashboard");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchInitialData();
    }, [courseId, router]);

  // Handle File Upload
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    const toastId = toast.loading("Uploading...");
    try {
        const res = await api.post("/upload", uploadData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setFormData({ ...formData, [field]: res.data.url });
        toast.success("Upload success!", { id: toastId });
    } catch (error) {
        toast.error("Upload failed", { id: toastId });
    }
  };

  // Submit Admission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if(!formData.photoUrl || !formData.signatureUrl) {
        return toast.error("Please upload both photo and signature.");
    }

    setSubmitting(true);
    try {
        const payload = {
            courseId,
            ...formData
        };

        const res = await api.post("/admissions", payload);
        toast.success("Application Submitted!");
        
        router.push(`/payment/${res.data._id}`);

    } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || "Submission failed";
        toast.error(message);

        const alreadyApplied = error.response?.status === 400 && message.toLowerCase().includes("already");
        if (alreadyApplied) {
            try {
                const myAdmissions = await api.get("/admissions/my");
                const existingAdmission = myAdmissions.data.find(
                    (admission) => admission.course?._id === courseId
                );
                if (existingAdmission) {
                    router.push(`/payment/${existingAdmission._id}`);
                }
            } catch (lookupError) {
                console.error("Existing admission lookup failed:", lookupError);
            }
        }
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-10 w-10"/></div>;

  return (
    <div className="container py-10 max-w-3xl">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        
        <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admission Application</h1>
            <p className="text-gray-500 mt-1">Applying for: <span className="font-bold text-primary">{course?.title}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input 
                        id="fatherName"
                        name="fatherName"
                        required 
                        placeholder="Enter Father's Name"
                        value={formData.fatherName} 
                        onChange={(e)=>setFormData({...formData, fatherName: e.target.value})} 
                        autoComplete="name"
                    />
                </div>
                <div>
                    <Label htmlFor="motherName">Mother's Name *</Label>
                    <Input 
                        id="motherName"
                        name="motherName"
                        required 
                        placeholder="Enter Mother's Name"
                        value={formData.motherName} 
                        onChange={(e)=>setFormData({...formData, motherName: e.target.value})} 
                        autoComplete="off"
                    />
                </div>
                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input 
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date" 
                        required 
                        value={formData.dateOfBirth} 
                        onChange={(e)=>setFormData({...formData, dateOfBirth: e.target.value})} 
                        autoComplete="bday"
                    />
                </div>
                <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select 
                        id="gender"
                        name="gender"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.gender} 
                        onChange={(e)=>setFormData({...formData, gender: e.target.value})}
                        autoComplete="sex"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                    <Input 
                        id="guardianPhone"
                        name="guardianPhone"
                        required 
                        type="tel"
                        placeholder="017XXXXXXXX" 
                        value={formData.guardianPhone} 
                        onChange={(e)=>setFormData({...formData, guardianPhone: e.target.value})} 
                        autoComplete="tel"
                    />
                </div>
                <div>
                    <Label htmlFor="nidOrBirthCert">NID / Birth Certificate No *</Label>
                    <Input 
                        id="nidOrBirthCert"
                        name="nidOrBirthCert"
                        required 
                        type="number" 
                        placeholder="Enter Number"
                        value={formData.nidOrBirthCert} 
                        onChange={(e)=>setFormData({...formData, nidOrBirthCert: e.target.value})} 
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Address */}
            <div>
                <Label htmlFor="presentAddress">Present Address *</Label>
                <Input 
                    id="presentAddress"
                    name="presentAddress"
                    required 
                    placeholder="Village, Upazila, District..." 
                    value={formData.presentAddress} 
                    onChange={(e)=>setFormData({...formData, presentAddress: e.target.value})} 
                    autoComplete="street-address"
                />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Photo Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                    <Label htmlFor="photoUpload" className="cursor-pointer block">
                        <span className="block mb-2 font-bold text-gray-700">Student Photo *</span>
                        {formData.photoUrl ? (
                            <img src={formData.photoUrl} alt="Preview" className="h-32 w-32 object-cover mx-auto rounded-md border"/>
                        ) : (
                            <div className="h-32 w-32 bg-gray-100 mx-auto rounded-md flex items-center justify-center text-gray-400">
                                <User className="w-10 h-10"/>
                            </div>
                        )}
                        <input 
                            id="photoUpload"
                            name="photoUpload"
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'photoUrl')} 
                        />
                        <span className="inline-block mt-3 text-sm text-primary font-medium hover:underline">
                            {formData.photoUrl ? "Change Photo" : "Upload Photo"}
                        </span>
                    </Label>
                </div>

                {/* Signature Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                    <Label htmlFor="signatureUpload" className="cursor-pointer block">
                        <span className="block mb-2 font-bold text-gray-700">Guardian/Student Signature *</span>
                        {formData.signatureUrl ? (
                            <img src={formData.signatureUrl} alt="Sign" className="h-20 w-auto object-contain mx-auto border bg-white p-2"/>
                        ) : (
                            <div className="h-32 w-full bg-gray-100 mx-auto rounded-md flex items-center justify-center text-gray-400">
                                <span className="text-xs">Signature</span>
                            </div>
                        )}
                        <input 
                            id="signatureUpload"
                            name="signatureUpload"
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'signatureUrl')} 
                        />
                        <span className="inline-block mt-3 text-sm text-primary font-medium hover:underline">
                            {formData.signatureUrl ? "Change Signature" : "Upload Signature"}
                        </span>
                    </Label>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" disabled={submitting} className="w-full font-bold h-12 text-lg">
                    {submitting ? <Loader2 className="animate-spin mr-2"/> : "Submit Application & Proceed to Payment"}
                </Button>
            </div>

        </form>
      </div>
    </div>
  );
}