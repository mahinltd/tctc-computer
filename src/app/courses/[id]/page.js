"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Monitor, 
  GraduationCap, 
  Palette,
  Loader2,
  Ruler, 
  BadgeCheck,
  PenTool
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api"; 

// Icon Helper
const getIcon = (title) => {
  if (!title) return <Monitor className="h-10 w-10" />;
  const t = title.toLowerCase();
  if (t.includes("graphics")) return <Palette className="h-10 w-10" />;
  if (t.includes("autocad")) return <Ruler className="h-10 w-10" />;
  return <Monitor className="h-10 w-10" />;
};

export default function CourseDetails() {
  const { id } = useParams(); 
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch Course Data ---
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.error("Course fetch error:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  // --- Handle Enroll Click (Updated) ---
  const handleEnroll = () => {
    console.log("Enroll Button Clicked!"); // Debugging Log

    // 1. Check Login Token
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    if (!token) {
      toast.error("Please login first to enroll!");
      // রিডাইরেক্ট টু লগইন/অথ পেজ
      router.push("/auth"); 
      return;
    }

    // 2. Navigate to Enroll Page
    if (id) {
      toast.success("Starting enrollment...");
      console.log(`Navigating to /admissions/${id}`);

      // router.push ব্যবহার করছি, সাথে ব্যাকআপ হিসেবে window.location
      try {
        router.push(`/admissions/${id}`);
      } catch (e) {
        window.location.href = `/admissions/${id}`;
      }
    } else {
      toast.error("Invalid Course ID");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-primary"/>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <Button onClick={() => router.push("/")}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 pb-20">
        {/* Header Section */}
        <div className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden">
           <div className="container relative z-10">
              <div className="max-w-3xl">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm mb-6 border border-white/20 ${course.type === 'Govt' ? 'bg-green-600/30' : 'bg-white/10'}`}>
                  {course.type === 'Govt' ? <BadgeCheck className="h-4 w-4" /> : <PenTool className="h-4 w-4" />}
                  {course.type === 'Govt' ? "Government (BTEB) Approved" : "Private Course"}
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-2xl">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap gap-6 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    <span>Classes: 3 Days/Week</span>
                  </div>
                </div>
              </div>
           </div>
           
           <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 hidden md:block" />
        </div>

        <div className="container mt-[-40px] relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {getIcon(course.title)}
                  Course Overview
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {course.descriptionBn || course.description}
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    course.type === 'Govt' ? "BTEB Certificate" : "Institute Certificate",
                    "Practical Lab Sessions",
                    "Real-world Projects",
                    "Expert Mentors",
                    "Job Preparation",
                    "Lifetime Support"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar: Enroll Button is Here */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-primary/10 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Course Fee</p>
                  <h2 className="text-4xl font-extrabold text-primary">৳ {course.fee}</h2>
                  <p className="text-xs text-muted-foreground mt-2">
                    {course.type === 'Govt' ? "*Exam fee excluded" : "*Full Course Fee"}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {/* ✅ ENROLL BUTTON */}
                  <Button 
                    onClick={handleEnroll} 
                    className="w-full h-12 text-lg font-bold shadow-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all active:scale-95"
                  >
                    Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500">
                    Secure Admission Online
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold mb-4">This Course Includes:</h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-primary" /> Modern Lab Access
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" /> {course.type === 'Govt' ? "Govt. Certificate" : "Certificate"}
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}