"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, Users, Clock, Star, AlertCircle } from "lucide-react";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { SyllabusSidebar } from "@/components/course/SyllabusSidebar";
import { Course, Lesson } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { videoApi, handleApiError, retryApiCall } from "@/lib/api";

// Mock course data generator based on courseId
const generateMockCourse = (courseId: string): Course => {
  const courses = {
    "1": {
      id: "1",
      title: "Complete React Development Course",
      description: "Master React from basics to advanced concepts including hooks, context, and modern patterns. Build real-world applications and learn best practices for scalable React development.",
      thumbnail: "/test.jpg",
      instructor: {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "instructor" as const,
        badges: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      duration: 480,
      level: "intermediate" as const,
      category: "Frontend Development",
      tags: ["React", "JavaScript", "Frontend", "Web Development"],
      lessons: [
        {
          id: "1",
          title: "Introduction to React",
          description: "Learn the fundamentals of React and why it's popular for building user interfaces.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 25,
          order: 1,
          isCompleted: false,
          courseId: "1",
          resources: [
            {
              id: "1",
              title: "React Documentation",
              description: "Official React documentation",
              url: "https://react.dev",
              type: "documentation" as const
            }
          ]
        },
        {
          id: "2", 
          title: "Components and JSX",
          description: "Understanding React components and JSX syntax for building UI elements.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 30,
          order: 2,
          isCompleted: false,
          courseId: "1",
          resources: []
        },
        {
          id: "3",
          title: "State and Props",
          description: "Learn how to manage component state and pass data between components using props.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
          duration: 35,
          order: 3,
          isCompleted: false,
          courseId: "1",
          resources: []
        },
        {
          id: "4",
          title: "React Hooks",
          description: "Master useState, useEffect, and other essential React hooks for modern development.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 40,
          order: 4,
          isCompleted: false,
          courseId: "1",
          resources: []
        }
      ],
      enrollmentCount: 1250,
      rating: 4.8,
      price: 89,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    "2": {
      id: "2",
      title: "Node.js Backend Development",
      description: "Build scalable backend applications with Node.js, Express, and MongoDB. Learn API development, authentication, and deployment strategies.",
      thumbnail: "/test.jpg",
      instructor: {
        id: "2",
        name: "Mike Chen",
        email: "mike@example.com",
        role: "instructor" as const,
        badges: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      duration: 360,
      level: "intermediate" as const,
      category: "Backend Development",
      tags: ["Node.js", "Express", "MongoDB", "API"],
      lessons: [
        {
          id: "5",
          title: "Node.js Fundamentals",
          description: "Introduction to Node.js runtime and its core modules.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 28,
          order: 1,
          isCompleted: false,
          courseId: "2",
          resources: []
        },
        {
          id: "6",
          title: "Express.js Framework",
          description: "Building web applications and APIs with Express.js framework.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 32,
          order: 2,
          isCompleted: false,
          courseId: "2",
          resources: []
        },
        {
          id: "7",
          title: "Database Integration",
          description: "Connecting to MongoDB and performing CRUD operations.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 38,
          order: 3,
          isCompleted: false,
          courseId: "2",
          resources: []
        }
      ],
      enrollmentCount: 890,
      rating: 4.6,
      price: 79,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  };

  return courses[courseId as keyof typeof courses] || courses["1"];
};

// SWR fetcher function
const fetcher = async (url: string, accessToken?: string) => {
  const courseId = url.split('/').pop();
  
  // For now, return mock data since we don't have a courses endpoint
  // In a real implementation, this would call the backend API
  return generateMockCourse(courseId || "1");
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const courseId = params.courseId as string;

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // Use SWR for data fetching with automatic revalidation
  const { data: course, error, isLoading, mutate } = useSWR(
    courseId ? `/courses/${courseId}` : null,
    (url) => fetcher(url, accessToken || undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  // Set initial lesson when course data loads
  useEffect(() => {
    if (course && course.lessons && course.lessons.length > 0 && !currentLesson) {
      setCurrentLesson(course.lessons[0]);
    }
  }, [course, currentLesson]);

  // Handle lesson selection
  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  // Handle marking lesson as complete
  const handleMarkComplete = async (lessonId: string) => {
    if (!course || !accessToken) return;

    try {
      // In a real implementation, this would call the backend API
      // await retryApiCall(() => courseApi.markLessonComplete(courseId, lessonId, accessToken));
      
      // For now, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state optimistically
      const updatedCourse = {
        ...course,
        lessons: course.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
        )
      };
      
      // Update SWR cache
      mutate(updatedCourse, false);
      
    } catch (err) {
      console.error('Error marking lesson as complete:', err);
      // Handle error (show toast, etc.)
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-4 bg-gray-800" />
            <Skeleton className="h-8 w-96 mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-full max-w-2xl bg-gray-800" />
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Skeleton */}
            <div className="lg:col-span-2">
              <Skeleton className="aspect-video w-full mb-4 bg-gray-800" />
              <Skeleton className="h-6 w-3/4 mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-2/3 bg-gray-800" />
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48 bg-gray-800" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 p-3">
                    <Skeleton className="h-6 w-6 rounded-full bg-gray-800" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                      <Skeleton className="h-3 w-2/3 bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Course Not Found</h3>
                  <p className="text-sm text-red-700">
                    The course you're looking for doesn't exist or has been removed.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/learn')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {course.title}
              </h1>
              <p className="text-white/80 text-lg mb-4 leading-relaxed">
                {course.description}
              </p>

              {/* Course Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollmentCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <Badge variant="outline" className="border-white/20 text-white">
                  {course.level}
                </Badge>
              </div>
            </div>

            {/* Instructor Info */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {course.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{course.instructor.name}</p>
                    <p className="text-sm text-white/70">Course Instructor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Player and Lesson Details */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <VideoPlayer
                lesson={currentLesson}
                onMarkComplete={handleMarkComplete}
              />
            ) : (
              <Card>
                <CardContent className="aspect-video flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-2" />
                    <p>Select a lesson from the syllabus to start learning</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Syllabus Sidebar */}
          <div className="lg:col-span-1">
            <SyllabusSidebar
              lessons={course.lessons}
              currentLessonId={currentLesson?.id || ''}
              onLessonSelect={handleLessonSelect}
              courseTitle={course.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}