"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Users, Star, Globe, Tag, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { SyllabusSidebar } from "@/components/course/SyllabusSidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useAuth } from "@/contexts/AuthContext";
import { formatDuration } from "@/lib/utils";

import { VideoDetail, Course, Lesson } from "@/types";
import { videoApi, courseApi, handleApiError, retryApiCall } from "@/lib/api";

// Transform video detail to lesson format
const transformVideoToLesson = (video: VideoDetail) => ({
  id: video.videoId,
  title: video.title,
  description: video.description,
  videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
  duration: 0, // YouTube duration format needs parsing
  order: 1,
  isCompleted: false,
  resources: [],
  courseId: video.videoId,
});

// Transform video detail to course format
const transformVideoToCourse = (video: VideoDetail) => ({
  id: video.videoId,
  title: video.title,
  description: video.description,
  thumbnail: video.thumbnailUrl,
  instructor: {
    id: video.channelTitle.toLowerCase().replace(/\s+/g, '-'),
    name: video.channelTitle,
    email: `${video.channelTitle.toLowerCase().replace(/\s+/g, '.')}@youtube.com`,
    role: "instructor" as const,
    badges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  duration: 0, // Will be parsed from YouTube duration
  level: "intermediate" as const,
  category: "Video Content",
  tags: video.tags || [],
  lessons: [transformVideoToLesson(video)],
  enrollmentCount: parseInt(video.viewCount) || 0,
  rating: 4.5, // Default rating
  price: 0,
  isPublished: true,
  createdAt: new Date(video.publishedAt),
  updatedAt: new Date(video.publishedAt),
});

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course details from backend API
  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        // Use the centralized API with retry logic
        const data = await retryApiCall(() => courseApi.getCourseDetail(courseId, accessToken || undefined));
        const courseData = data as Course;
        setCourse(courseData);
        
        // Set the first lesson as current if available
        if (courseData.lessons && courseData.lessons.length > 0) {
          setCurrentLesson(courseData.lessons[0]);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId, accessToken]);

  // Handle lesson selection
  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  // Handle marking lesson as complete
  const handleMarkComplete = async (lessonId: string) => {
    try {
      await retryApiCall(() => courseApi.markLessonComplete(courseId, lessonId, accessToken || undefined));
      
      // Update local state
      setCourse(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lessons: prev.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
          )
        };
      });
      
      // Update current lesson if it's the one being marked complete

      if (currentLesson?.id === lessonId) {
        setCurrentLesson(prev => prev ? { ...prev, isCompleted: true } : prev);
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      throw error; // Re-throw to let VideoPlayer handle the error
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Course</CardTitle>
            <CardDescription>
              {error || 'Course not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            {/* Course Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.enrollmentCount} enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span className="capitalize">{course.level}</span>
              </div>
            </div>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Instructor */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {course.instructor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Instructor</p>
                <p className="text-sm text-gray-600">{course.instructor.name}</p>
              </div>
            </div>
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