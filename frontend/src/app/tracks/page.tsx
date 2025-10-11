"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Progress,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Search, Clock, BookOpen, Users, Star, ArrowRight, Play, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PageContainer } from "@/components/layouts/AppShell";
import { CustomButton } from "@/components/atoms/CustomButton";
import { LevelBadge } from "@/components/atoms/CustomBadge";
import { CustomAvatar, AvatarGroup } from "@/components/atoms/CustomAvatar";

import { MainLayout } from "@/components/layouts/MainLayout";
import { Track } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import { TrackCard as TrackCardComponent } from "@/components/cards/TrackCard";

// Mock data for tracks
const mockTracks: Track[] = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description: "Master both frontend and backend development with React, Node.js, and databases. Build complete web applications from scratch.",
    thumbnail: "/test.jpg",
    courses: [],
    totalDuration: 2400, // 40 hours
    level: "intermediate",
    category: "Web Development",
    enrollmentCount: 3420,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Data Science & Machine Learning",
    description: "Learn Python, statistics, machine learning algorithms, and data visualization. Work with real datasets and build predictive models.",
    thumbnail: "/test.jpg",
    courses: [],
    totalDuration: 3600, // 60 hours
    level: "advanced",
    category: "Data Science",
    enrollmentCount: 2180,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Mobile App Development",
    description: "Build native and cross-platform mobile apps using React Native and Flutter. Deploy to App Store and Google Play.",
    thumbnail: "/test.jpg",
    courses: [],
    totalDuration: 2880, // 48 hours
    level: "intermediate",
    category: "Mobile Development",
    enrollmentCount: 1890,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "UI/UX Design Mastery",
    description: "Learn design principles, user research, prototyping, and design systems. Master Figma, Adobe XD, and design thinking.",
    thumbnail: "/test.jpg",
    courses: [],
    totalDuration: 1800, // 30 hours
    level: "beginner",
    category: "Design",
    enrollmentCount: 4560,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "5",
    title: "DevOps & Cloud Engineering",
    description: "Master Docker, Kubernetes, AWS, CI/CD pipelines, and infrastructure as code. Build scalable cloud applications.",
    thumbnail: "/test.jpg",
    courses: [],
    totalDuration: 3000, // 50 hours
    level: "advanced",
    category: "DevOps",
    enrollmentCount: 1240,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "6",
    title: "Cybersecurity Fundamentals",
    description: "Learn ethical hacking, network security, cryptography, and security best practices. Prepare for security certifications.",
    thumbnail: "/test.jpg",
    courses: [],
    totalDuration: 2160, // 36 hours
    level: "intermediate",
    category: "Security",
    enrollmentCount: 980,
    isPublished: true,
    createdAt: new Date(),
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
  "DevOps",
  "Security",
];

const levels = ["All Levels", "beginner", "intermediate", "advanced"];

interface TrackCardProps {
  track: Track;
  progress?: number;
  showProgress?: boolean;
}

function TrackCard({ track, progress, showProgress = false }: TrackCardProps) {
  const mockInstructors = [
    { name: "Sarah Johnson", src: undefined },
    { name: "Mike Chen", src: undefined },
    { name: "Emma Davis", src: undefined },
  ];

  const router = useRouter();
  const handleCardClick = () => {
    router.push(`/tracks/${track.id}`);
  };

  const handleStartTrack = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    router.push(`/tracks/${track.id}`);
  };

  return (
    <Link href={`/tracks/${track.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-white/10 bg-black">
        <CardHeader className="p-0 relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image
              src={track.thumbnail}
              alt={track.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* Duration badge */}
            <div className="absolute bottom-2 right-2">
              <Chip size="sm" className="bg-white text-black border-0">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(track.totalDuration)}
              </Chip>
            </div>
            
            {/* Level badge */}
            <div className="absolute top-3 left-3">
              <Chip variant="bordered" size="sm" className="border-white/20 text-white bg-black">
                {track.level.charAt(0).toUpperCase() + track.level.slice(1)}
              </Chip>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-4 bg-black">
          {/* Track title */}
          <h3 className="font-manrope text-xl font-bold line-clamp-2 text-white group-hover:text-white/80 transition-colors">
            {track.title}
          </h3>
          
          {/* Track description */}
          <p className="text-sm text-white/80 line-clamp-3">
            {track.description}
          </p>
          
          {/* Category badge */}
          <Chip variant="bordered" size="sm" className="border-white/20 text-white bg-black">
            {track.category}
          </Chip>
          
          {/* Course Preview Section */}
          {track.courses && track.courses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <BookOpen className="h-4 w-4" />
                <span>Courses in this track:</span>
              </div>
              <div className="space-y-1">
                {track.courses.slice(0, 3).map((course, index) => (
                  <div key={course.id} className="flex items-center gap-2 text-xs text-white/70">
                    <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white font-medium">
                      {index + 1}
                    </span>
                    <span className="truncate">{course.title}</span>
                  </div>
                ))}
                {track.courses.length > 3 && (
                  <div className="text-xs text-white/50 pl-7">
                    +{track.courses.length - 3} more courses
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Progress bar (if applicable) */}
          {showProgress && progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/80">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-1"
                classNames={{
                  track: "bg-white/20",
                  indicator: "bg-white"
                }}
              />
            </div>
          )}
          
          {/* Instructors */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AvatarGroup users={mockInstructors} size="sm" max={3} />
              <span className="text-xs text-white/80">
                {mockInstructors.length} instructors
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-white/80">
              <Users className="h-3 w-3 text-white" />
              <span>{track.enrollmentCount.toLocaleString()}</span>
            </div>
          </div>
        </CardBody>

        <CardFooter className="bg-black border-t border-white/10">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-white" />
                <span>{track.courses?.length || 0} courses</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-white" />
                <span>{formatDuration(track.totalDuration)}</span>
              </div>
            </div>
            
            <div 
              onClick={handleStartTrack}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-white/20 text-white bg-black hover:bg-white hover:text-black transition-all duration-200 rounded-md cursor-pointer"
            >
              Start Track
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function TracksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("most-popular");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tracks from API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/tracks');
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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
  }).sort((a, b) => {
    switch (sortBy) {
      case "most-popular":
        return b.enrollmentCount - a.enrollmentCount;
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "duration-short":
        return a.totalDuration - b.totalDuration;
      case "duration-long":
        return b.totalDuration - a.totalDuration;
      default:
        return 0;
    }
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-4">
                Learning Tracks
              </h1>
              <p className="text-white/80">
                Structured learning paths to master complete skill sets
              </p>
            </div>

            {/* Search and Filters */}
            <div
              className="mb-8"
            >
              {/* Search Bar - Always Visible */}
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search tracks..."
                      startContent={<Search className="h-4 w-4 text-white/60" />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      classNames={{
                        inputWrapper: "h-12 bg-black border border-white/20 hover:border-white/40 focus-within:border-white",
                        input: "text-white placeholder:text-white/60",
                      }}
                    />
                  </div>

                  {/* Mobile Filter Toggle */}
                  <div className="sm:hidden">
                    <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="bordered"
                          className="w-full h-12 bg-black border-white/20 text-white hover:bg-white/10"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Show Filters
                          {isFiltersOpen ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 mt-4">
                        {/* Mobile Filters */}
                        <Select
                          label="Category"
                          selectedKeys={new Set([selectedCategory])}
                          onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                          classNames={{
                            trigger: "h-12 bg-black border border-white/20 hover:border-white/40 focus:border-white",
                            label: "text-white/80",
                            value: "text-white",
                            selectorIcon: "text-white",
                            popoverContent: "bg-black border border-white/20",
                          }}
                        >
                          {categories.map((category) => (
                            <SelectItem key={category} classNames={{
                              base: "text-white hover:bg-white/10 focus:bg-white/10",
                            }}>
                              {category}
                            </SelectItem>
                          ))}
                        </Select>
                        
                        <Select
                          label="Level"
                          selectedKeys={new Set([selectedLevel])}
                          onSelectionChange={(keys) => setSelectedLevel(Array.from(keys)[0] as string)}
                          classNames={{
                            trigger: "h-12 bg-black border border-white/20 hover:border-white/40 focus:border-white",
                            label: "text-white/80",
                            value: "text-white",
                            selectorIcon: "text-white",
                            popoverContent: "bg-black border border-white/20",
                          }}
                        >
                          {levels.map((level) => (
                            <SelectItem key={level} classNames={{
                              base: "text-white hover:bg-white/10 focus:bg-white/10",
                            }}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </Select>

                        <Select
                          label="Sort by"
                          selectedKeys={new Set([sortBy])}
                          onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                          classNames={{
                            trigger: "h-12 bg-black border border-white/20 hover:border-white/40 focus:border-white",
                            label: "text-white/80",
                            value: "text-white",
                            selectorIcon: "text-white",
                            popoverContent: "bg-black border border-white/20",
                          }}
                        >
                          <SelectItem key="popular" classNames={{
                            base: "text-white hover:bg-white/10 focus:bg-white/10",
                          }}>
                            Most Popular
                          </SelectItem>
                          <SelectItem key="newest" classNames={{
                            base: "text-white hover:bg-white/10 focus:bg-white/10",
                          }}>
                            Newest
                          </SelectItem>
                          <SelectItem key="duration-short" classNames={{
                            base: "text-white hover:bg-white/10 focus:bg-white/10",
                          }}>
                            Shortest Duration
                          </SelectItem>
                          <SelectItem key="duration-long" classNames={{
                            base: "text-white hover:bg-white/10 focus:bg-white/10",
                          }}>
                            Longest Duration
                          </SelectItem>
                        </Select>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>

                {/* Desktop Filters - Always Visible on Large Screens */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-4">
                  <Select
                    label="Category"
                    selectedKeys={new Set([selectedCategory])}
                    onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                    classNames={{
                      trigger: "h-12 bg-black border border-white/20 hover:border-white/40 focus:border-white",
                      label: "text-white/80",
                      value: "text-white",
                      selectorIcon: "text-white",
                      popoverContent: "bg-black border border-white/20",
                    }}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category} classNames={{
                        base: "text-white hover:bg-white/10 focus:bg-white/10",
                      }}>
                        {category}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Level"
                    selectedKeys={new Set([selectedLevel])}
                    onSelectionChange={(keys) => setSelectedLevel(Array.from(keys)[0] as string)}
                    classNames={{
                      trigger: "h-12 bg-black border border-white/20 hover:border-white/40 focus:border-white",
                      label: "text-white/80",
                      value: "text-white",
                      selectorIcon: "text-white",
                      popoverContent: "bg-black border border-white/20",
                    }}
                  >
                    {levels.map((level) => (
                      <SelectItem key={level} classNames={{
                        base: "text-white hover:bg-white/10 focus:bg-white/10",
                      }}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Sort by"
                    selectedKeys={new Set([sortBy])}
                    onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                    classNames={{
                      trigger: "h-12 bg-black border border-white/20 hover:border-white/40 focus:border-white",
                      label: "text-white/80",
                      value: "text-white",
                      selectorIcon: "text-white",
                      popoverContent: "bg-black border border-white/20",
                    }}
                  >
                    <SelectItem key="popular" classNames={{
                      base: "text-white hover:bg-white/10 focus:bg-white/10",
                    }}>
                      Most Popular
                    </SelectItem>
                    <SelectItem key="newest" classNames={{
                      base: "text-white hover:bg-white/10 focus:bg-white/10",
                    }}>
                      Newest
                    </SelectItem>
                    <SelectItem key="duration-short" classNames={{
                      base: "text-white hover:bg-white/10 focus:bg-white/10",
                    }}>
                      Shortest Duration
                    </SelectItem>
                    <SelectItem key="duration-long" classNames={{
                      base: "text-white hover:bg-white/10 focus:bg-white/10",
                    }}>
                      Longest Duration
                    </SelectItem>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-white/80 text-sm">
                  {filteredTracks.length} tracks found
                </p>
              </div>
            </div>

            {/* Featured Track */}
            {filteredTracks.length > 0 && (
              <div
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Featured Track
                  </h2>
                </div>
              
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  <div className="space-y-4 lg:space-y-6">
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex items-center gap-3">
                        <Chip variant="bordered" size="sm" className="border-white/20 text-white bg-black">
                          {filteredTracks[0].level.charAt(0).toUpperCase() + filteredTracks[0].level.slice(1)}
                        </Chip>
                        <Chip size="sm" className="bg-white text-black">
                          {filteredTracks[0].category}
                        </Chip>
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-bold text-white">
                        {filteredTracks[0].title}
                      </h3>
                      
                      <p className="text-base lg:text-lg text-white/80">
                        {filteredTracks[0].description}
                      </p>
                    </div>
                  
                    <div className="flex items-center gap-6 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white" />
                        <span>{formatDuration(filteredTracks[0].totalDuration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-white" />
                        <span>{filteredTracks[0].courses?.length || 0} courses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-white" />
                        <span>{filteredTracks[0].enrollmentCount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <CustomButton
                        as={Link}
                        href={`/tracks/${filteredTracks[0].id}`}
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 transition-all duration-200"
                        rightIcon={ArrowRight}
                      >
                        Start Learning
                      </CustomButton>
                      <CustomButton
                        variant="bordered"
                        size="lg"
                        className="border-white/20 text-white bg-black hover:bg-white hover:text-black transition-all duration-200"
                        onPress={() => console.log('Preview track')}
                      >
                        Preview
                      </CustomButton>
                    </div>
                  </div>
                  
                  <div className="mt-6 lg:mt-0">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black border border-white/10">
                      <Image
                        src={filteredTracks[0].thumbnail}
                        alt={filteredTracks[0].title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="rounded-full bg-white/90 p-6 transition-transform hover:scale-110">
                          <Play className="h-12 w-12 text-black" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracks Grid */}
            {loading ? (
              <div className="space-y-6">
                {/* Featured Track Skeleton */}
                <div className="mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 bg-white/20" />
                        <Skeleton className="h-6 w-24 bg-white/20" />
                      </div>
                      <Skeleton className="h-8 w-3/4 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                      <Skeleton className="h-4 w-2/3 bg-white/20" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20 bg-white/20" />
                        <Skeleton className="h-4 w-16 bg-white/20" />
                        <Skeleton className="h-4 w-24 bg-white/20" />
                      </div>
                      <Skeleton className="h-12 w-32 bg-white/20" />
                    </div>
                    <div className="mt-6 lg:mt-0">
                      <Skeleton className="aspect-[16/9] w-full bg-white/20" />
                    </div>
                  </div>
                </div>
                
                {/* Tracks Grid Skeleton */}
                <div className="space-y-6">
                  <Skeleton className="h-8 w-48 bg-white/20" />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="bg-black border-white/10">
                        <CardBody className="p-0">
                          <Skeleton className="aspect-video w-full bg-white/20" />
                          <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-16 bg-white/20" />
                              <Skeleton className="h-5 w-20 bg-white/20" />
                            </div>
                            <Skeleton className="h-6 w-3/4 bg-white/20" />
                            <Skeleton className="h-4 w-full bg-white/20" />
                            <Skeleton className="h-4 w-2/3 bg-white/20" />
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-4 w-20 bg-white/20" />
                              <Skeleton className="h-4 w-16 bg-white/20" />
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Featured Track */}
                {filteredTracks.length > 0 && (
                  <div className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <Chip variant="bordered" size="sm" className="border-white/20 text-white bg-black">
                            Featured
                          </Chip>
                          <LevelBadge level={filteredTracks[0].level} />
                        </div>
                        
                        <h1 className="font-manrope text-4xl font-bold text-white">
                          {filteredTracks[0].title}
                        </h1>
                        
                        <p className="text-lg text-white/80 leading-relaxed">
                          {filteredTracks[0].description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-white/80">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-white" />
                            <span>{formatDuration(filteredTracks[0].totalDuration)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-white" />
                            <span>{filteredTracks[0].courses?.length || 0} courses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-white" />
                            <span>{filteredTracks[0].enrollmentCount.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <CustomButton
                            as={Link}
                            href={`/tracks/${filteredTracks[0].id}`}
                            size="lg"
                            className="bg-white text-black hover:bg-white/90 transition-all duration-200"
                            rightIcon={ArrowRight}
                          >
                            Start Learning
                          </CustomButton>
                          <CustomButton
                            variant="bordered"
                            size="lg"
                            className="border-white/20 text-white bg-black hover:bg-white hover:text-black transition-all duration-200"
                            onPress={() => console.log('Preview track')}
                          >
                            Preview
                          </CustomButton>
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black border border-white/10">
                          <Image
                            src={filteredTracks[0].thumbnail}
                            alt={filteredTracks[0].title}
                            fill
                            className="object-cover"
                          />
                          
                          {/* Play overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="rounded-full bg-white/90 p-6 transition-transform hover:scale-110">
                              <Play className="h-12 w-12 text-black" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* All Tracks Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-manrope text-2xl font-bold text-white">
                      All Learning Tracks ({filteredTracks.length})
                    </h2>
                  </div>

                  {filteredTracks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-white/60 text-lg">No tracks found matching your criteria.</div>
                      <div className="text-white/40 text-sm mt-2">Try adjusting your search or filters.</div>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredTracks.map((track) => (
                        <TrackCardComponent 
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
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              </>
            )}
              <div className="space-y-6">
                {/* Featured Track Skeleton */}
                <div className="mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 bg-white/20" />
                        <Skeleton className="h-6 w-24 bg-white/20" />
                      </div>
                      <Skeleton className="h-8 w-3/4 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                      <Skeleton className="h-4 w-2/3 bg-white/20" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20 bg-white/20" />
                        <Skeleton className="h-4 w-16 bg-white/20" />
                        <Skeleton className="h-4 w-24 bg-white/20" />
                      </div>
                      <Skeleton className="h-12 w-32 bg-white/20" />
                    </div>
                    <div className="mt-6 lg:mt-0">
                      <Skeleton className="aspect-[16/9] w-full bg-white/20" />
                    </div>
                  </div>
                </div>
                
                {/* Tracks Grid Skeleton */}
                <div className="space-y-6">
                  <Skeleton className="h-8 w-48 bg-white/20" />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="bg-black border-white/10">
                        <CardBody className="p-0">
                          <Skeleton className="aspect-video w-full bg-white/20" />
                          <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-16 bg-white/20" />
                              <Skeleton className="h-5 w-20 bg-white/20" />
                            </div>
                            <Skeleton className="h-6 w-3/4 bg-white/20" />
                            <Skeleton className="h-4 w-full bg-white/20" />
                            <Skeleton className="h-4 w-2/3 bg-white/20" />
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-4 w-20 bg-white/20" />
                              <Skeleton className="h-4 w-16 bg-white/20" />
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredTracks.length &gt; 1 ? (
              <div
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white">
                  All Tracks
                </h2>
                
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredTracks.slice(1).map((track, index) => (
                    <div
                      key={track.id}
                    >
                      <TrackCard track={track} />
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredTracks.length === 1 ? (
              <div className="text-center py-12">
                <p className="text-white/80 text-lg">
                  Only one track matches your criteria. Check out the featured track above!
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/80 text-lg">
                  No tracks found matching your criteria.
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Try adjusting your search or filters.
                </p>
              </div>
            {'}'}
        </div>
      </div>
    </MainLayout>
  );
}