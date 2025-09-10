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
import { Track } from "@/types";
import { cn, formatDuration } from "@/lib/utils";

// Mock data for tracks
const mockTracks: Track[] = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description: "Master both frontend and backend development with React, Node.js, and databases. Build complete web applications from scratch.",
    thumbnail: "/api/placeholder/600/300",
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
    thumbnail: "/api/placeholder/600/300",
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
    thumbnail: "/api/placeholder/600/300",
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
    thumbnail: "/api/placeholder/600/300",
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
    thumbnail: "/api/placeholder/600/300",
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
    thumbnail: "/api/placeholder/600/300",
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
      className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/tracks/${track.id}`);
        }
      }}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-t-lg">
          <Image
            src={track.thumbnail}
            alt={track.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Overlay with play button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="rounded-full bg-white/90 p-4">
              <Play className="h-8 w-8 text-primary-600" fill="currentColor" />
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3">
            <Chip
              color="default"
              variant="solid"
              size="sm"
              className="bg-black/70 text-white"
              startContent={<Clock className="h-3 w-3" />}
            >
              {formatDuration(track.totalDuration)}
            </Chip>
          </div>
          
          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <LevelBadge level={track.level} />
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Track title */}
        <h3 className="font-manrope text-xl font-bold line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {track.title}
        </h3>
        
        {/* Track description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {track.description}
        </p>
        
        {/* Instructors */}
        <div className="flex items-center gap-3">
          <AvatarGroup users={mockInstructors} max={3} size="sm" />
          <span className="text-sm text-muted-foreground">
            {mockInstructors.length} instructors
          </span>
        </div>
        
        {/* Progress bar */}
        {showProgress && progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between pt-0">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>8 courses</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{track.enrollmentCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        
        {/* CTA */}
        <CustomButton
          as={Link}
          href={`/tracks/${track.id}`}
          color="primary"
          variant="flat"
          size="sm"
          rightIcon={ArrowRight}
          onClick={(e) => e.stopPropagation()}
        >
          {showProgress ? "Continue" : "Start Track"}
        </CustomButton>
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
    <PageTransition>
      <PageContainer className="h-full">
        <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 mb-6">
          <h1 className="font-manrope text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Learning Tracks
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
            Structured learning paths to master new skills step by step
          </p>
        </div>

        {/* Search and Filters - Fixed */}
        <div className="flex-shrink-0 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search tracks..."
                startContent={<Search className="h-4 w-4 text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                classNames={{
                  inputWrapper: "h-10",
                }}
              />
            </div>
            
            <Select
              label="Category"
              selectedKeys={[selectedCategory]}
              onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
              classNames={{
                trigger: "h-10",
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>
            
            <Select
              label="Level"
              selectedKeys={[selectedLevel]}
              onSelectionChange={(keys) => setSelectedLevel(Array.from(keys)[0] as string)}
              classNames={{
                trigger: "h-10",
              }}
            >
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {filteredTracks.length} tracks found
            </p>
            
            <Select
              label="Sort by"
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
              className="w-full sm:w-48"
              classNames={{
                trigger: "h-10",
              }}
            >
              <SelectItem key="popular" value="popular">Most Popular</SelectItem>
              <SelectItem key="newest" value="newest">Newest</SelectItem>
              <SelectItem key="duration-short" value="duration-short">Shortest First</SelectItem>
              <SelectItem key="duration-long" value="duration-long">Longest First</SelectItem>
            </Select>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-8">
          {/* Featured Track */}
          {filteredTracks.length > 0 && (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-manrope text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  Featured Track
                </h2>
              </div>
            
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                <div className="space-y-4 lg:space-y-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-3">
                      <LevelBadge level={filteredTracks[0].level} />
                      <Chip color="primary" variant="flat" size="sm">
                        {filteredTracks[0].category}
                      </Chip>
                    </div>
                    
                    <h3 className="font-manrope text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {filteredTracks[0].title}
                    </h3>
                    
                    <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
                      {filteredTracks[0].description}
                    </p>
                  </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(filteredTracks[0].totalDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>8 courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{filteredTracks[0].enrollmentCount.toLocaleString()} enrolled</span>
                  </div>
                </div>
                
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                    <CustomButton
                      as={Link}
                      href={`/tracks/${filteredTracks[0].id}`}
                      color="primary"
                      size="md"
                      rightIcon={ArrowRight}
                      className="w-full sm:w-auto"
                    >
                      Start Learning
                    </CustomButton>
                    <CustomButton
                      as={Link}
                      href={`/tracks/${filteredTracks[0].id}`}
                      variant="bordered"
                      size="md"
                      className="w-full sm:w-auto"
                    >
                      View Details
                    </CustomButton>
                  </div>
                </div>
                
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={filteredTracks[0].thumbnail}
                    alt={filteredTracks[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tracks Grid */}
          {filteredTracks.length > 1 ? (
            <div className="flex-shrink-0 space-y-6">
              <h2 className="font-manrope text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                All Tracks
              </h2>
              
              <motion.div 
                 className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
                 variants={staggerContainer}
                 initial="initial"
                 animate="in"
               >
                 <AnimatePresence mode="wait">
                   {filteredTracks.slice(1).map((track, index) => (
                     <motion.div
                       key={track.id}
                       variants={staggerItem}
                       custom={index}
                       whileHover={hoverScale}
                       whileTap={tapScale}
                     >
                       <TrackCard track={track} />
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </motion.div>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="flex-shrink-0 text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No tracks found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <CustomButton
                variant="bordered"
                onPress={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setSelectedLevel("All Levels");
                }}
              >
                Clear Filters
              </CustomButton>
            </div>
          ) : null}

          {/* CTA Section */}
          <div className="flex-shrink-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 lg:p-8 text-center">
            <h2 className="font-manrope text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Can't find the right track?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse our individual courses or suggest a new learning track
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CustomButton
                as={Link}
                href="/learn"
                color="primary"
                rightIcon={ArrowRight}
                className="w-full sm:w-auto"
              >
                Browse Courses
              </CustomButton>
              <CustomButton
                variant="bordered"
                onPress={() => console.log('Suggest track')}
                className="w-full sm:w-auto"
              >
                Suggest a Track
              </CustomButton>
            </div>
          </div>
        </div>
       </div>
     </PageContainer>
   </PageTransition>
   );
}