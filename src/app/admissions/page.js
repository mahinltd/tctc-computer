"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, X, MapPin, Phone, Calendar, User } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- Fetch All Admissions ---
  const fetchAdmissions = async () => {
    try {
      const res = await api.get("/admissions"); // Admin Route
      setAdmissions(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // --- Handle View Details ---
  const handleViewDetails = (admission) => {
    setSelectedAdmission(admission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAdmission(null);
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="container py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Admissions</h1>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm">
          Total: <span className="font-bold text-primary">{admissions.length}</span>
        </div>
      </div>

      {/* --- Admission List Table --- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b uppercase text-xs">
              <tr>
                <th className="p-4">Student Info</th>
                <th className="p-4">Course & Session</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {admissions.map((adm) => (
                <tr key={adm._id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{adm.user?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{adm.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{adm.user?.studentId || "No ID"}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-700">{adm.course?.title || "Deleted Course"}</p>
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded mt-1">
                      Session: {adm.session}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                      adm.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      adm.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {adm.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 hover:bg-gray-100"
                      onClick={() => handleViewDetails(adm)}
                    >
                      <Eye className="w-4 h-4 text-gray-600" /> Details
                    </Button>
                  </td>
                </tr>
              ))}
              {admissions.length === 0 && (
                  <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">No admission records found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Details Modal --- */}
      {showModal && selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                    <h3 className="font-bold text-xl text-gray-800">Application Details</h3>
                    <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto">
                    
                    {/* Top Section: Photo & Basic Info */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        <div className="w-32 h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden border mx-auto sm:mx-0">
                            {selectedAdmission.photoUrl ? (
                                <img src={selectedAdmission.photoUrl} alt="Student" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-10 h-10"/></div>
                            )}
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Student Name</p>
                                    <p className="font-medium text-gray-800">{selectedAdmission.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Student ID</p>
                                    <p className="font-mono text-primary font-bold">{selectedAdmission.user?.studentId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Course</p>
                                    <p className="font-medium text-gray-800">{selectedAdmission.course?.title}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Roll No</p>
                                    <p className="font-medium text-gray-800">{selectedAdmission.rollNo || "Pending"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Father's Name</p>
                            <p className="text-sm font-medium">{selectedAdmission.fatherName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mother's Name</p>
                            <p className="text-sm font-medium">{selectedAdmission.motherName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date of Birth</p>
                            <p className="text-sm font-medium">{selectedAdmission.dateOfBirth ? new Date(selectedAdmission.dateOfBirth).toDateString() : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">NID / Birth Cert</p>
                            <p className="text-sm font-medium">{selectedAdmission.nidOrBirthCert}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Guardian Phone</p>
                            <p className="text-sm font-medium">{selectedAdmission.guardianPhone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Gender & Religion</p>
                            <p className="text-sm font-medium">{selectedAdmission.gender} • {selectedAdmission.religion}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Present Address</p>
                            <p className="text-sm font-medium">{selectedAdmission.presentAddress}</p>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="mt-6">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Guardian/Student Signature</p>
                        <div className="h-20 w-64 border border-dashed rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                            {selectedAdmission.signatureUrl ? (
                                <img src={selectedAdmission.signatureUrl} alt="Signature" className="h-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400">No Signature</span>
                            )}
                        </div>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <Button onClick={closeModal} className="px-6">Close</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}