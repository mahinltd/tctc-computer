"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus, Edit, BookOpen, Clock, Banknote } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- Form State ---
  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    description: "",
    descriptionBn: "",
    fee: "",
    duration: ""
  });

  // --- ১. সব কোর্স লোড করা ---
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- ২. নতুন কোর্স তৈরি বা আপডেট ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.title || !formData.fee || !formData.duration) {
        return toast.error("Please fill required fields");
    }

    setSubmitLoading(true);
    try {
      if (editingId) {
        // Update Existing
        await api.put(`/courses/${editingId}`, formData);
        toast.success("Course updated successfully!");
      } else {
        // Create New
        await api.post("/courses", formData);
        toast.success("Course created successfully!");
      }
      
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- ৩. এডিট মোড অন করা ---
  const handleEdit = (course) => {
    setFormData({
        title: course.title,
        titleBn: course.titleBn || "",
        description: course.description || "",
        descriptionBn: course.descriptionBn || "",
        fee: course.fee,
        duration: course.duration
    });
    setEditingId(course._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ৪. কোর্স ডিলিট করা ---
  const handleDelete = async (id) => {
    if(!confirm("Are you sure? This will hide the course from students.")) return;
    try {
        await api.delete(`/courses/${id}`);
        toast.success("Course deleted");
        fetchCourses();
    } catch (error) {
        toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", titleBn: "", description: "", descriptionBn: "", fee: "", duration: "" });
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Manage Courses
        </h1>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-2">
            {showForm ? "Cancel" : <><Plus className="w-4 h-4"/> Add Course</>}
        </Button>
      </div>

      {/* --- Form Section --- */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border shadow-sm animate-in slide-in-from-top-2">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
                {editingId ? "Edit Course" : "Add New Course"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Course Title (English) *</Label>
                    <Input placeholder="e.g. Office Applications" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                    <Label>Course Title (Bangla)</Label>
                    <Input placeholder="e.g. অফিস অ্যাপ্লিকেশন" value={formData.titleBn} onChange={e => setFormData({...formData, titleBn: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Course Fee (BDT) *</Label>
                    <Input type="number" placeholder="e.g. 1500" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} required />
                </div>
                <div className="space-y-2">
                    <Label>Duration *</Label>
                    <Input placeholder="e.g. 3 Months" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label>Description (English)</Label>
                    <Input placeholder="Short details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="md:col-span-2 mt-2">
                    <Button type="submit" disabled={submitLoading} className="w-full">
                        {submitLoading ? <Loader2 className="animate-spin" /> : (editingId ? "Update Course" : "Create Course")}
                    </Button>
                </div>
            </form>
        </div>
      )}

      {/* --- Course List --- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 border-b">
            <tr>
              <th className="p-4">Course Name</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Duration</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-gray-50">
                <td className="p-4">
                    <p className="font-bold text-gray-800">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.titleBn}</p>
                </td>
                <td className="p-4 font-bold text-green-600 flex items-center gap-1">
                    <Banknote className="w-4 h-4"/> {course.fee}
                </td>
                <td className="p-4">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs w-fit">
                        <Clock className="w-3 h-3"/> {course.duration}
                    </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                        <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(course._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400">No courses found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}