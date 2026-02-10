import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CourseCard({ course, icon }) {
  return (
    <div className="group flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 animate-fade-in h-full">
      <div className="p-6">
        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.description}
        </p>
      </div>

      <div className="p-6 pt-0 mt-auto">
        {/* FIX: সরাসরি কোর্স ডিটেইলস পেজের লিংক দেওয়া হয়েছে */}
        {/* আগে এখানে /auth লিংক ছিল, যা লগইন পেজের ঝলক তৈরি করত */}
        <Link href={`/courses/${course.id}`} className="w-full block">
          <Button className="w-full justify-between bg-primary/10 text-primary hover:bg-primary hover:text-white border-0 shadow-none font-bold transition-all duration-300">
            View Details 
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}