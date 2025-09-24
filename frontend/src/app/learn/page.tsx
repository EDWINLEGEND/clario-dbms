"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/cards/CourseCard";
import { Course } from "@/types";
import { debounce } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useVideos } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { MainLayout } from "@/components/layouts/MainLayout";

import { VideoSearchResult, VideoSearchResponse } from "@/types";
import { videoApi, handleApiError, retryApiCall } from "@/lib/api";

// Transform video data to course format
const transformVideoToCourse = (video: VideoSearchResult): Course => ({
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
  duration: 0, // YouTube API doesn't provide duration in search results
  level: video.compatibilityScore > 0.8 ? "advanced" : video.compatibilityScore > 0.5 ? "intermediate" : "beginner",
  category: "Video Content",
  tags: video.title.split(' ').slice(0, 3), // Extract first 3 words as tags
  lessons: [],
  enrollmentCount: Math.floor(Math.random() * 1000) + 100, // Mock enrollment
  rating: Math.round((video.compatibilityScore * 5) * 10) / 10,
  price: 0, // YouTube videos are free
  isPublished: true,
  createdAt: new Date(video.publishedAt),
  updatedAt: new Date(video.publishedAt),
});

// Mock data for courses (fallback)
const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, state, and props. Perfect for beginners starting their React journey.",
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
    description: "Master advanced TypeScript concepts and patterns for building robust applications.",
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
    description: "Learn the fundamentals of user interface and experience design with practical examples.",
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
  {
    id: "4",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
    thumbnail: "/test.jpg",
    instructor: {
      id: "4",
      name: "Alex Rodriguez",
      email: "alex@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 320,
    level: "intermediate",
    category: "Backend Development",
    tags: ["Node.js", "Express", "MongoDB", "API"],
    lessons: [],
    enrollmentCount: 756,
    rating: 4.6,
    price: 59,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis, visualization, and machine learning.",
    thumbnail: "/test.jpg",
    instructor: {
      id: "5",
      name: "Dr. Lisa Wang",
      email: "lisa@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 280,
    level: "beginner",
    category: "Data Science",
    tags: ["Python", "Data Analysis", "Machine Learning", "Pandas"],
    lessons: [],
    enrollmentCount: 1890,
    rating: 4.8,
    price: 79,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native and Expo.",
    thumbnail: "/test.jpg",
    instructor: {
      id: "6",
      name: "James Wilson",
      email: "james@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 360,
    level: "intermediate",
    category: "Mobile Development",
    tags: ["React Native", "Mobile", "iOS", "Android"],
    lessons: [],
    enrollmentCount: 634,
    rating: 4.5,
    price: 69,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const categories = [
  "All Categories",
  "Video Content",
  "Web Development",
  "Mobile Development",
  "Backend Development",
  "Data Science",
  "Design",
  "Programming",
];

const levels = ["All Levels", "beginner", "intermediate", "advanced"];

export default function LearnPage() {
  const { accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch videos from backend API
  const fetchVideos = async (query: string) => {
    if (!query.trim() || !accessToken) return;

    setLoading(true);
    setError(null);

    try {
      // Use the centralized API with retry logic
      const response = await retryApiCall(() => videoApi.searchVideos(searchQuery, accessToken));
      const transformedCourses = (response as any).items.map(transformVideoToCourse);
      setCourses(transformedCourses);
      setHasSearched(true);
    } catch (err) {
      console.error('Error fetching videos:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      // Fallback to mock data on error
      setCourses(mockCourses);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        fetchVideos(query);
      } else {
        setCourses([]);
        setHasSearched(false);
      }
    }, 500),
    [accessToken]
  );

  // Initialize with mock data if no access token
  useEffect(() => {
    if (!accessToken) {
      setCourses(mockCourses);
      setHasSearched(true);
    }
  }, [accessToken]);

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
      
      return matchesCategory && matchesLevel;
    });
  }, [courses, selectedCategory, selectedLevel]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              Course Catalog
            </h1>
            <p className="text-white/80">
              {accessToken 
                ? "Search for videos and courses tailored to your learning style" 
                : "Browse our course collection (sign in for personalized video search)"
              }
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder={accessToken 
                    ? "Search for videos, topics, or skills..." 
                    : "Sign in to search personalized video content..."
                  }
                  className="pl-10 h-12 bg-black border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white"
                  onChange={(e) => debouncedSearch(e.target.value)}
                  disabled={!accessToken}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48 h-12 bg-black border-white/20 text-white focus:border-white focus:ring-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-white/10 focus:bg-white/10">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full lg:w-48 h-12 bg-black border-white/20 text-white focus:border-white focus:ring-white">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {levels.map((level) => (
                    <SelectItem key={level} value={level} className="text-white hover:bg-white/10 focus:bg-white/10">
                      {level === "All Levels" ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-4 bg-black border-white/20 text-white hover:bg-white/10"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Results Count and Error Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-white/80">
                  {hasSearched 
                    ? `Showing ${filteredCourses.length} of ${courses.length} results`
                    : accessToken 
                      ? "Enter a search term to find personalized video content"
                      : `Showing ${filteredCourses.length} sample courses`
                  }
                </p>
                {error && (
                  <p className="text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded-md border border-red-400/20">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Course Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse bg-black border-white/10">
                    <CardHeader>
                      <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-white/20 rounded mb-4"></div>
                      <div className="h-3 bg-white/20 rounded w-full mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="text-center py-12">
                <div className="text-white/60 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                <p className="text-white/80">
                  {searchQuery 
                    ? `No videos found for "${searchQuery}". Try different keywords.`
                    : "Try adjusting your search criteria or browse all courses."
                  }
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-black border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedLevel("All Levels");
                    setCourses([]);
                    setHasSearched(false);
                  }}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-white/60 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {accessToken ? "Start Your Learning Journey" : "Sample Course Collection"}
                </h3>
                <p className="text-white/80">
                  {accessToken 
                    ? "Search for topics you want to learn about and discover personalized video content."
                    : "Sign in to access personalized video search and recommendations."
                  }
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}