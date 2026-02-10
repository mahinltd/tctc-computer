"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus, Video, Calendar, Link as LinkIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminClasses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    meetingLink: "",
    scheduledAt: ""
  });

  // ১. সব কোর্স লোড করা (Dropdown এর জন্য)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
        // যদি কোর্স থাকে, তবে প্রথমটি অটোমেটিক সিলেক্ট করে দাও
        if(res.data.length > 0) {
            setSelectedCourse(res.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ২. যখনই কোর্স চেঞ্জ হবে, সেই কোর্সের ক্লাসগুলো লোড হবে
  useEffect(() => {
    if (!selectedCourse) return;
    
    const fetchClasses = async () => {
      try {
        // Admin Route: Get classes by course ID
        const res = await api.get(`/classes/course/${selectedCourse}`);
        setClasses(res.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, [selectedCourse]);

  // ৩. নতুন ক্লাস তৈরি করা
  const handleCreate = async (e) => {
    e.preventDefault();
    if(!formData.title || !formData.meetingLink || !formData.scheduledAt) {
        return toast.error("Please fill all fields");
    }

    try {
      await api.post("/classes", { 
          ...formData, 
          courseId: selectedCourse 
      });
      
      toast.success("Class scheduled successfully!");
      setShowForm(false);
      setFormData({ title: "", meetingLink: "", scheduledAt: "" });
      
      // রিফ্রেশ লিস্ট
      const res = await api.get(`/classes/course/${selectedCourse}`);
      setClasses(res.data);
    } catch (error) {
      toast.error("Failed to schedule class");
    }
  };

  // ৪. ক্লাস ডিলিট করা
  const handleDelete = async (id) => {
    if(!confirm("Delete this class schedule?")) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class removed");
      // UI থেকে ডিলিট করা
      setClasses(classes.filter(c => c._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- হেডার এবং কোর্স সিলেকশন --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Video className="h-7 w-7 text-primary" /> Live Classes
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage schedules & meeting links</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Course Selector */}
            <div className="w-full sm:w-64">
                <select 
                    className="w-full h-10 px-3 border rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    {courses.length === 0 && <option>No courses available</option>}
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
            </div>

            <Button onClick={() => setShowForm(!showForm)} className="gap-2 whitespace-nowrap">
                {showForm ? "Cancel" : <><Plus className="w-4 h-4"/> Schedule Class</>}
            </Button>
        </div>
      </div>

      {/* --- অ্যাড ক্লাস ফর্ম --- */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg animate-in slide-in-from-top-2">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Schedule New Class</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Class Title</Label>
                    <Input 
                        placeholder="e.g. Class 1: Introduction to MS Word" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label>Meeting Link (Zoom/Google Meet)</Label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                            className="pl-9"
                            placeholder="https://meet.google.com/..." 
                            value={formData.meetingLink} 
                            onChange={e => setFormData({...formData, meetingLink: e.target.value})} 
                            required 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Schedule Date & Time</Label>
                    <Input 
                        type="datetime-local" 
                        value={formData.scheduledAt} 
                        onChange={e => setFormData({...formData, scheduledAt: e.target.value})} 
                        required 
                    />
                </div>
                <div className="flex items-end">
                    <Button type="submit" className="w-full font-bold">Confirm Schedule</Button>
                </div>
            </form>
        </div>
      )}

      {/* --- ক্লাসের তালিকা --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50">
            <h3 className="font-bold text-gray-700">
                Scheduled Classes ({classes.length})
            </h3>
        </div>

        {classes.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
                <Video className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No classes scheduled for this course yet.</p>
                <p className="text-xs mt-1">Select a course and click 'Schedule Class' to add one.</p>
            </div>
        ) : (
            <div className="divide-y divide-gray-100">
                {classes.map((cls) => (
                    <div key={cls._id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg">{cls.title}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                    <Calendar className="w-3.5 h-3.5" /> 
                                    {new Date(cls.scheduledAt).toLocaleString()}
                                </span>
                                <a 
                                    href={cls.meetingLink} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline hover:text-primary/80 truncate max-w-[250px]"
                                >
                                    <LinkIcon className="w-3.5 h-3.5" /> 
                                    {cls.meetingLink}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href={cls.meetingLink} target="_blank" rel="noreferrer">
                                <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">
                                    Join Now
                                </Button>
                            </a>
                            <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDelete(cls._id)}
                                className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-none"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}