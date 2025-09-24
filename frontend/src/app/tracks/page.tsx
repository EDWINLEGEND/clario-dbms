"use client";

import { useState } from "react";
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
import { Search, Clock, BookOpen, Users, Star, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PageContainer } from "@/components/layouts/AppShell";
import { CustomButton } from "@/components/atoms/CustomButton";
import { LevelBadge } from "@/components/atoms/CustomBadge";
import { CustomAvatar, AvatarGroup } from "@/components/atoms/CustomAvatar";
import { PageTransition, staggerContainer, staggerItem, hoverScale, tapScale } from "@/components/atoms/PageTransition";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Track } from "@/types";
import { cn, formatDuration } from "@/lib/utils";

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

  return (
    <Card
      isPressable
      onPress={handleCardClick}
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-white/10 bg-black"
    >
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
          
          <CustomButton
            size="sm"
            variant="bordered"
            className="border-white/20 text-white bg-black hover:bg-white hover:text-black transition-all duration-200"
            rightIcon={ArrowRight}
          >
            Start Track
          </CustomButton>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popular");

  // Filter tracks based on search and filters
  const filteredTracks = mockTracks.filter(track => {
    const matchesSearch = !searchQuery || 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || 
      track.category === selectedCategory;
    
    const matchesLevel = selectedLevel === "All Levels" || 
      track.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case "popular":
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
      <PageTransition>
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
                Learning Tracks
              </h1>
              <p className="text-white/80">
                Structured learning paths to master complete skill sets
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search tracks..."
                    startContent={<Search className="h-4 w-4 text-white/60" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    classNames={{
                      inputWrapper: "h-12 bg-black border border-white/20 hover:border-white/40 focus-within:border-white",
                      input: "text-white placeholder:text-white/60",
                    }}
                  />
                </div>
                
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
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-white/80 text-sm">
                  {filteredTracks.length} tracks found
                </p>
                
                <Select
                  label="Sort by"
                  selectedKeys={new Set([sortBy])}
                  onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                  className="w-full sm:w-48"
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
                  }}>Most Popular</SelectItem>
                  <SelectItem key="newest" classNames={{
                    base: "text-white hover:bg-white/10 focus:bg-white/10",
                  }}>Newest</SelectItem>
                  <SelectItem key="duration-short" classNames={{
                    base: "text-white hover:bg-white/10 focus:bg-white/10",
                  }}>Shortest First</SelectItem>
                  <SelectItem key="duration-long" classNames={{
                    base: "text-white hover:bg-white/10 focus:bg-white/10",
                  }}>Longest First</SelectItem>
                </Select>
              </div>
            </motion.div>

            {/* Featured Track */}
            {filteredTracks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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
              </motion.div>
            )}

            {/* Tracks Grid */}
            {filteredTracks.length > 1 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white">
                  All Tracks
                </h2>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {filteredTracks.slice(1).map((track, index) => (
                    <motion.div
                      key={track.id}
                      variants={staggerItem}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TrackCard track={track} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
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
            )}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}