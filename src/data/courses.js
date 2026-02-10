import { Monitor, GraduationCap, Palette } from "lucide-react";

export const coursesData = [
  {
    id: 1,
    title: "Office Program",
    description: "Master Microsoft Office for professional administrative skills.",
    iconName: "Monitor",
    syllabus: [
      "Microsoft Word (Documentation)",
      "Microsoft Excel (Data Entry & Formulas)",
      "Microsoft PowerPoint (Presentation)",
      "Internet Browsing & Emailing",
      "Typing (Bangla & English)",
      "Basic Computer Hardware"
    ],
    options: [
      { 
        id: "office-private",
        type: "Private Certificate", 
        duration: "3 Months", 
        fee: "3,000",
        note: "Short course for quick learning"
      },
      { 
        id: "office-govt",
        type: "Govt Certificate (BTEB)", 
        duration: "6 Months", 
        fee: "4,500",
        note: "Government Recognized Certificate"
      }
    ]
  },
  {
    id: 2,
    title: "AutoCAD 2D & 3D",
    description: "Professional architectural and engineering design training.",
    iconName: "GraduationCap",
    syllabus: [
      "AutoCAD 2D Drafting (Floor Plans)",
      "AutoCAD 3D Modeling",
      "Elevation & Section Design",
      "Layer Management & Plotting",
      "Civil & Electrical Layouts",
      "Project Work"
    ],
    options: [
      { 
        id: "cad-private",
        type: "Private Certificate", 
        duration: "3 Months", 
        fee: "3,000",
        note: "Focus on core design skills"
      },
      { 
        id: "cad-govt",
        type: "Govt Certificate (BTEB)", 
        duration: "6 Months", 
        fee: "4,500",
        note: "Government Recognized Certificate"
      }
    ]
  },
  {
    id: 3,
    title: "Freelancing with Graphic Design",
    description: "Become a professional graphic designer and start earning.",
    iconName: "Palette",
    syllabus: [
      "Adobe Photoshop (Photo Editing)",
      "Adobe Illustrator (Vector Design)",
      "Logo & Brand Identity Design",
      "Social Media Post Design",
      "Freelancing Marketplace (Fiverr/Upwork)",
      "Portfolio Building"
    ],
    // Special Case: No options yet
    isUpcoming: true,
    duration: "6 Months",
    feeText: "Fee will be announced soon"
  }
];