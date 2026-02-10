"use client";

import Link from "next/link";
import Image from "next/image"; 
import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation"; 
// Navbar import is removed here because it comes from ClientLayout
import { Button } from "@/components/ui/button";
import { Monitor, GraduationCap, Palette, ArrowRight, CheckCircle2, Users, Camera, Star, X, Loader2, BadgeCheck, Ruler, PenTool } from "lucide-react";
import { toast } from "react-hot-toast"; 
import api from "@/lib/api"; 
import ContactSection from "@/components/ContactSection";

export default function Home() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  
  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCourses, setModalCourses] = useState([]);
  const [modalTitle, setModalTitle] = useState("");


  // --- Fetch Courses from Backend ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const scrollToCourses = () => {
    const section = document.getElementById("courses");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- Handle Course Click (Logic for Popup) ---
  const handleCourseClick = (categoryName) => {
    // 1. Filter courses based on category keyword
    const relatedCourses = courses.filter(c => 
      c.title.toLowerCase().includes(categoryName.toLowerCase())
    );

    if (relatedCourses.length === 0) {
      toast.error("Course details not found.");
      return;
    }

    // 2. If multiple options (Govt/Private), show Modal
    if (relatedCourses.length > 1) {
      setModalTitle(categoryName === "office" ? "Office Applications" : "AutoCAD 2D & 3D");
      setModalCourses(relatedCourses);
      setIsModalOpen(true);
    } 
    // 3. If single course (Graphics), go directly
    else {
      router.push(`/courses/${relatedCourses[0]._id}`);
    }
  };

  // Gallery Data
  const galleryImages = [
    {
      src: "https://res.cloudinary.com/dfmjmwdrr/image/upload/v1770455574/lab-class_x3i9gy.jpg",
      title: "Modern Lab Facilities",
      desc: "Every student gets a dedicated computer.",
      icon: <Monitor className="h-5 w-5" />
    },
    {
      src: "https://res.cloudinary.com/dfmjmwdrr/image/upload/v1770455567/campus-group_y2zsc1.jpg",
      title: "Our Community",
      desc: "Join a vibrant community of learners.",
      icon: <Users className="h-5 w-5" /> 
    },
    {
      src: "https://res.cloudinary.com/dfmjmwdrr/image/upload/v1770456322/group_photo_1_y3pnlo.jpg",
      title: "Student Activities",
      desc: "Regular workshops and group studies.",
      icon: <Camera className="h-5 w-5" />
    },
    {
      src: "https://res.cloudinary.com/dfmjmwdrr/image/upload/v1770456322/group_photo_urrgor.jpg",
      title: "Success Stories",
      desc: "Our students are ready for the industry.",
      icon: <Star className="h-5 w-5" />
    }
  ];

  // --- Main Categories for Landing Page ---
  const mainCategories = [
    {
      id: "office",
      title: "Office Applications",
      description: "Master MS Word, Excel, PowerPoint & Access. Choose between Govt. Certified or Private Short Course.",
      icon: <Monitor className="h-10 w-10" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "autocad",
      title: "AutoCAD 2D & 3D",
      description: "Professional Engineering Drawing & Drafting. Available in both Govt. (6 Months) and Private (3 Months) options.",
      icon: <Ruler className="h-10 w-10" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: "graphics",
      title: "Graphics Design & Freelancing",
      description: "Become a creative designer and learn freelancing. Professional certification from our center.",
      icon: <Palette className="h-10 w-10" />,
      color: "bg-pink-100 text-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ❌ <Navbar /> Removed from here because Layout handles it now */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero text-primary-foreground py-20 md:py-28">
          <div className="container relative z-10 text-center">
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-secondary animate-pulse-soft" />
              Admissions Open for 2026
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl max-w-5xl mx-auto">
              Welcome to <span className="text-secondary">Technical Computer Training Center</span>
            </h1>

            <p className="mt-4 font-bengali text-lg md:text-xl text-primary-foreground/90 font-medium">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার কারিগরি শিক্ষা বোর্ড (BTEB) কর্তৃক অনুমোদিত
            </p>

            <p className="mt-3 text-primary-foreground/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Build your career with our Govt. Approved Computer Courses. Expert Mentors, Modern Labs & Freelancing Support.
            </p>

            <div className="mt-8 flex justify-center">
              <Button 
                onClick={scrollToCourses}
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg gap-2 font-bold"
              >
                Browse Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }} />
          </div>
        </section>

        {/* --- COURSES SECTION (UPDATED 3 CARDS LAYOUT) --- */}
        <section id="courses" className="container py-20 scroll-mt-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">Our Premium Courses</h2>
            <p className="mt-2 font-bengali text-muted-foreground">আপনার পছন্দের কোর্সটি বেছে নিন</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Displaying 3 Main Categories */}
              {mainCategories.map((cat) => (
                <div key={cat.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
                  
                  <div className="p-8 flex-1 flex flex-col items-center text-center">
                    <div className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl ${cat.color} mb-6`}>
                      {cat.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <Button 
                      onClick={() => handleCourseClick(cat.id)}
                      className="w-full gap-2 font-bold h-12 text-lg"
                    >
                      View Details <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="bg-muted/30 py-20 scroll-mt-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl text-foreground">Life at TCTC</h2>
              <p className="mt-2 font-bengali text-muted-foreground">আমাদের ল্যাব এবং ক্যাম্পাসের এক ঝলক</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {galleryImages.map((img, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-2xl shadow-lg h-[300px] md:h-[350px] cursor-pointer"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <Image 
                    src={img.src} 
                    alt={img.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-6">
                    <div>
                      <div className="flex items-center gap-2 text-secondary font-bold mb-1">
                        {img.icon} {img.title}
                      </div>
                      <p className="text-white text-sm opacity-90">{img.desc}</p>
                      <p className="text-xs text-white/70 mt-2 font-medium group-hover:text-secondary transition-colors">Click to view</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-10">
        <div className="container text-center">
          <div className="mb-4 flex items-center justify-center gap-2 font-bold text-xl text-primary">
            <GraduationCap className="h-6 w-6" />
            <span>TCTC</span>
          </div>
          <p className="font-bengali text-sm text-muted-foreground">
            টেকনিক্যাল কম্পিউটার ট্রেনিং সেন্টার © {new Date().getFullYear()}
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Develop By Tanvir. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* --- MODAL FOR COURSE SELECTION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="bg-primary/5 p-6 text-center border-b">
              <h3 className="text-xl font-bold text-primary">{modalTitle}</h3>
              <p className="text-sm text-gray-500 mt-1">Please select your preferred course type</p>
            </div>
            
            <div className="p-6 space-y-4">
              {modalCourses.map((course) => (
                <div 
                  key={course._id}
                  onClick={() => router.push(`/courses/${course._id}`)}
                  className="flex items-center justify-between p-4 border rounded-xl hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {course.type === 'Govt' ? (
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <PenTool className="h-5 w-5 text-gray-600" />
                      )}
                      <span className="font-bold text-gray-800">
                        {course.type === 'Govt' ? "Government Course" : "Private Course"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{course.duration} • {course.type === 'Govt' ? "BTEB Certified" : "Short Course"}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="block font-bold text-primary text-lg">৳ {course.fee}</span>
                    <span className="text-xs text-gray-400 group-hover:text-primary transition-colors">Select &rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 text-center border-t">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-gray-500 hover:text-red-500 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-10 w-10" />
          </button>

          <div className="relative w-full max-w-6xl h-[85vh] rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={selectedImage} 
              alt="Gallery View"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}