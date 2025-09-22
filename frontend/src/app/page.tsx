"use client";

import { Button } from "@heroui/react";
import { ArrowRight, BookOpen, Users, Award, Zap, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/molecules/CourseCard";
import { CustomButton } from "@/components/atoms/CustomButton";
import { Course } from "@/types";

// Mock data for featured courses
const featuredCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, state, and props",
    thumbnail: "/test.jpg",
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
    thumbnail: "/test.jpg",
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
    thumbnail: "/test.jpg",
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
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/test.jpg"
            alt="Learning background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-manrope leading-tight">
              Master Database
              <br />
              <span className="text-primary-400">Management</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4">
              Learn SQL, NoSQL, and advanced database concepts through hands-on projects and real-world scenarios
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-8">
              <Button
                as={Link}
                href="/learn"
                size="lg"
                color="primary"
                className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-12 text-base sm:text-lg font-semibold rounded-full"
                startContent={<BookOpen className="h-5 w-5" />}
              >
                Start Learning
              </Button>
              
              <Button
                as={Link}
                href="/tracks"
                size="lg"
                variant="bordered"
                className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-12 text-base sm:text-lg font-semibold rounded-full border-white/30 text-white hover:bg-white/10"
                startContent={<Map className="h-5 w-5" />}
              >
                View Tracks
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-manrope text-gray-900 dark:text-white mb-4 sm:mb-6">
              Featured Courses
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Start your database journey with our most popular and comprehensive courses
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <CourseCard course={course} className="h-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
