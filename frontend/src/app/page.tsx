"use client";

import { Button } from "@heroui/react";
import { ArrowRight, BookOpen, Users, Award, Zap } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/molecules/CourseCard";
import { CustomButton } from "@/components/atoms/CustomButton";
import { Course } from "@/types";

// Mock data for featured courses
const featuredCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, state, and props",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 180,
    level: "beginner",
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend"],
    lessons: [],
    enrollmentCount: 1250,
    rating: 4.8,
    price: 0,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master advanced TypeScript concepts and patterns",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "2",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 240,
    level: "advanced",
    category: "Programming",
    tags: ["TypeScript", "JavaScript", "Types"],
    lessons: [],
    enrollmentCount: 890,
    rating: 4.9,
    price: 49,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and experience design",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "3",
      name: "Emma Davis",
      email: "emma@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 200,
    level: "intermediate",
    category: "Design",
    tags: ["UI", "UX", "Design", "Figma"],
    lessons: [],
    enrollmentCount: 2100,
    rating: 4.7,
    price: 39,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Home() {
  return (
    <>
      {/* Full-Screen Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')"
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-manrope text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
              CLARIO
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn, Track, and Build Your Future
            </p>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of learners on the modern platform for courses, learning tracks, and real-world projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <CustomButton
                as={Link}
                href="/learn"
                color="primary"
                size="lg"
                className="text-lg px-8 py-4 min-w-[200px]"
                rightIcon={ArrowRight}
              >
                Start Learning
              </CustomButton>
              <CustomButton
                as={Link}
                href="/tracks"
                variant="bordered"
                size="lg"
                className="text-lg px-8 py-4 min-w-[200px] border-white text-white hover:bg-white hover:text-black"
              >
                Browse Tracks
              </CustomButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
