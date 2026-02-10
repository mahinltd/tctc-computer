"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Clock, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function CourseDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-10 w-10"/></div>;
  if (!course) return <div className="text-center py-20">Course not found</div>;

  return (
    <div className="container py-12 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-primary/5 p-10 text-center border-b">
            <span className="inline-block px-3 py-1 bg-white text-primary text-xs font-bold rounded-full mb-4 border shadow-sm">
                {course.duration} Duration
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-xl text-gray-600 font-bengali">{course.titleBn}</p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-8">
            
            {/* Fee & Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary"/> Course Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {course.description || "No description available."}
                    </p>
                    <p className="text-gray-500 font-bengali">
                        {course.descriptionBn}
                    </p>
                </div>

                {/* Pricing Box */}
                <div className="bg-gray-50 p-6 rounded-xl border h-fit">
                    <p className="text-sm text-gray-500 font-medium mb-1">Course Fee</p>
                    <div className="text-3xl font-bold text-primary mb-4">৳ {course.fee}</div>
                    
                    <ul className="space-y-3 text-sm text-gray-600 mb-6">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Lifetime Access</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Live Support</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Certificate</li>
                    </ul>

                    {/* ✅ Enroll Button -> Goes to Admission Form */}
                    <Button 
                        onClick={() => router.push(`/admission/${course._id}`)} 
                        className="w-full font-bold h-12 text-lg shadow-lg shadow-primary/20"
                    >
                        Enroll Now <ArrowRight className="ml-2 w-5 h-5"/>
                    </Button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}