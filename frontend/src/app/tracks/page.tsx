"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layouts/MainLayout";
import { TrackCard } from "@/components/cards/TrackCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Types
interface Track {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  totalDuration: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  enrollmentCount: number;
  isPublished: boolean;
  createdAt: Date;
  courses?: Array<{
    id: string;
    title: string;
  }>;
}

// Mock data for tracks
const mockTracks: Track[] = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description: "Master both frontend and backend development with React, Node.js, and databases. Build complete web applications from scratch.",
    thumbnail: "/test.jpg",
    totalDuration: 2400,
    level: "intermediate",
    category: "Web Development",
    enrollmentCount: 3420,
    isPublished: true,
    createdAt: new Date(),
    courses: [
      { id: "1", title: "HTML & CSS Fundamentals" },
      { id: "2", title: "JavaScript Essentials" },
      { id: "3", title: "React Deep Dive" },
      { id: "4", title: "Node.js Backend" },
      { id: "5", title: "Database Design" },
    ]
  },
  {
    id: "2",
    title: "Data Science & Machine Learning",
    description: "Learn Python, statistics, machine learning algorithms, and data visualization. Work with real datasets and build predictive models.",
    thumbnail: "/test.jpg",
    totalDuration: 3600,
    level: "advanced",
    category: "Data Science",
    enrollmentCount: 2180,
    isPublished: true,
    createdAt: new Date(),
    courses: [
      { id: "6", title: "Python for Data Science" },
      { id: "7", title: "Statistics & Probability" },
      { id: "8", title: "Machine Learning Basics" },
      { id: "9", title: "Deep Learning" },
    ]
  },
  {
    id: "3",
    title: "Mobile App Development",
    description: "Build native and cross-platform mobile apps using React Native and Flutter. Deploy to App Store and Google Play.",
    thumbnail: "/test.jpg",
    totalDuration: 2880,
    level: "intermediate",
    category: "Mobile Development",
    enrollmentCount: 1890,
    isPublished: true,
    createdAt: new Date(),
    courses: [
      { id: "10", title: "React Native Basics" },
      { id: "11", title: "Flutter Development" },
      { id: "12", title: "Mobile UI/UX" },
    ]
  },
  {
    id: "4",
    title: "UI/UX Design Mastery",
    description: "Learn design principles, user research, prototyping, and design systems. Master Figma, Adobe XD, and design thinking.",
    thumbnail: "/test.jpg",
    totalDuration: 1800,
    level: "beginner",
    category: "Design",
    enrollmentCount: 4560,
    isPublished: true,
    createdAt: new Date(),
    courses: [
      { id: "13", title: "Design Principles" },
      { id: "14", title: "Figma Mastery" },
      { id: "15", title: "User Research" },
    ]
  },
  {
    id: "5",
    title: "DevOps & Cloud Engineering",
    description: "Master Docker, Kubernetes, AWS, CI/CD pipelines, and infrastructure as code. Build scalable cloud applications.",
    thumbnail: "/test.jpg",
    totalDuration: 3000,
    level: "advanced",
    category: "DevOps",
    enrollmentCount: 1240,
    isPublished: true,
    createdAt: new Date(),
    courses: [
      { id: "16", title: "Docker Fundamentals" },
      { id: "17", title: "Kubernetes Orchestration" },
      { id: "18", title: "AWS Cloud Services" },
      { id: "19", title: "CI/CD Pipelines" },
    ]
  },
];

const categories = ["All Categories", "Web Development", "Data Science", "Mobile Development", "Design", "DevOps"];
const levels = ["All Levels", "beginner", "intermediate", "advanced"];

export default function TracksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tracks from API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/tracks');
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        console.error('Error fetching tracks:', err);
        // Fallback to mock data if API fails
        setTracks(mockTracks);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Filter tracks based on search and filters
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = !searchTerm || 
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || 
      track.category === selectedCategory;
    
    const matchesLevel = selectedLevel === "All Levels" || 
      track.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 border-b border-white/10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] opacity-10 bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Learning Tracks
              </h1>
              <p className="text-base md:text-lg text-white/70 mb-8">
                Structured learning paths to master complete skill sets. Follow curated courses designed to take you from beginner to expert.
              </p>
            </motion.div>
          </div>
            </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                    <Input
                      placeholder="Search tracks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/20 hover:border-white/40 focus:border-white text-white placeholder:text-white/60"
                    />
                  </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px] h-12 bg-white/5 border-white/20 hover:border-white/40 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20 text-white">
                          {categories.map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-white/10">
                              {category}
                            </SelectItem>
                          ))}
                  </SelectContent>
                        </Select>
                        
                {/* Level Filter */}
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-[180px] h-12 bg-white/5 border-white/20 hover:border-white/40 text-white">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20 text-white">
                          {levels.map((level) => (
                      <SelectItem key={level} value={level} className="hover:bg-white/10">
                        {level === "All Levels" ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                  </SelectContent>
                  </Select>
                </div>
              </div>
          </motion.div>

            {/* Tracks Grid */}
            {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-lg bg-white/5 animate-pulse" />
                    ))}
                  </div>
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg mb-4">No tracks found matching your criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                  setSelectedLevel("All Levels");
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-black"
              >
                Clear Filters
              </Button>
                    </div>
                  ) : (
                    <motion.div
              initial="hidden"
              animate="visible"
                      variants={{
                        visible: {
                          transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filteredTracks.map((track) => (
                <TrackCard
                          key={track.id}
                          id={track.id}
                          title={track.title}
                          description={track.description}
                          category={track.category}
                          difficulty={track.level}
                          duration={formatDuration(track.totalDuration)}
                          thumbnail={track.thumbnail}
                          courseCount={track.courses?.length || 0}
                          enrollmentCount={track.enrollmentCount}
                  courses={track.courses}
                        />
                      ))}
                    </motion.div>
                  )}
        </div>
      </div>
    </MainLayout>
  );
}
