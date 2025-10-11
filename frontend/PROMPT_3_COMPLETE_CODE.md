# Prompt 3: Complete Code Reference

This document contains the complete, refactored code for all files modified in Prompt 3.

---

## 📁 File 1: `frontend/src/components/cards/CourseCard.tsx`

**Status**: ✅ Refactored with Framer Motion and interactive styles

```typescript
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Users, Star, Sparkles } from "lucide-react";
import { Course } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDuration } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  progress?: number;
  showProgress?: boolean;
  variant?: "default" | "compact" | "featured";
  className?: string;
  onCourseClick?: (courseId: string) => void;
}

// Animation variants for staggered entrance
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
};

export function CourseCard({
  course,
  progress,
  showProgress = false,
  variant = "default",
  className,
  onCourseClick,
}: CourseCardProps) {
  const getLevelColor = (level: string) => {
    // All levels use white border and white text for black-and-white theme
    return "border-white/20 text-white bg-black";
  };

  const handleCardClick = () => {
    if (onCourseClick) {
      onCourseClick(course.id);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300",
          "border-white/10 bg-black",
          "interactive-glow",
          "hover:-translate-y-2",
          variant === "featured" && "border-2 border-white",
          className
        )}
        onClick={handleCardClick}
      >
        {/* Course thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Duration badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white text-black border-0">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(course.duration)}
            </Badge>
          </div>
          
          {/* Level badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className={getLevelColor(course.level)}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </Badge>
          </div>

          {/* Compatibility Score badge */}
          {(course as any).compatibilityScore !== undefined && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                {Math.round((course as any).compatibilityScore)}% Match
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-lg line-clamp-2 text-white group-hover:text-white/80 transition-colors">
            {course.title}
          </CardTitle>
          {variant !== "compact" && (
            <CardDescription className="line-clamp-2 text-white/80">
              {course.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Category badge */}
          <Badge variant="outline" className="mb-3 border-white/20 text-white bg-black">
            {course.category}
          </Badge>
          
          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {course.instructor.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-white">
              {course.instructor.name}
            </span>
          </div>
          
          {/* Progress bar */}
          {showProgress && progress !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrollmentCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-white text-white" />
              <span>{course.rating}</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white bg-black hover:bg-white hover:text-black transition-all duration-200"
          >
            View Course
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
```

---

## 📁 File 2: `frontend/src/components/cards/ProjectCard.tsx`

**Status**: ✅ Refactored with Framer Motion and interactive styles

```typescript
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Clock, 
  Code, 
  Tag, 
  CheckCircle, 
  Calendar,
  FolderOpen,
  BookOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Project } from "@/types";

// Animation variants for staggered entrance
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
};

// Extended interface for dynamic project data from API
interface ApiProject {
  id: string | number;
  title: string;
  description: string | null;
  deadline?: string | Date | null;
  createdAt: string | Date;
  userId?: string;
  milestones?: any[];
  // Optional fields for compatibility with static data
  thumbnail?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: number;
  technologies?: string[];
  requirements?: string[];
  deliverables?: string[];
  category?: string;
  isPublished?: boolean;
  course?: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    instructor: {
      id: string;
      name: string;
    };
  };
}

interface ProjectCardProps {
  project: ApiProject;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-white text-black border-white hover:bg-white/90";
      case "medium":
        return "bg-white/80 text-black border-white/80 hover:bg-white";
      case "hard":
        return "bg-white/60 text-black border-white/60 hover:bg-white/80";
      default:
        return "bg-white text-black border-white hover:bg-white/90";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "Beginner";
      case "medium":
        return "Intermediate";
      case "hard":
        return "Advanced";
      default:
        return "Custom";
    }
  };

  // Helper function to format date
  const formatDate = (date?: string | Date | null) => {
    if (!date) return null;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get milestone count
  const getMilestoneCount = () => {
    return project.milestones?.length || 0;
  };

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group relative overflow-hidden border-white/10 bg-black transition-all duration-300",
          "interactive-glow hover:-translate-y-2",
          className
        )}
      >
      {/* Thumbnail Section */}
      <div className="relative h-48 overflow-hidden bg-black border-b border-white/20">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FolderOpen className="h-16 w-16 text-white/40" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.difficulty && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium px-2 py-1",
                getDifficultyColor(project.difficulty)
              )}
            >
              {getDifficultyLabel(project.difficulty)}
            </Badge>
          )}
          {project.estimatedTime && (
            <Badge
              variant="outline"
              className="bg-black/90 text-white border-white/30 text-xs font-medium px-2 py-1"
            >
              <Clock className="mr-1 h-3 w-3" />
              {project.estimatedTime}h
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-white/90 transition-colors">
            {project.title}
          </h3>
          <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Project Details */}
        <div className="space-y-3 mb-4">
          {/* Course Badge - Show when project is linked to a course */}
          {project.course && (
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-1 border-blue-400/50 text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-colors"
              >
                Course: {project.course.title}
              </Badge>
            </div>
          )}
          
          {project.category && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Tag className="h-4 w-4" />
              <span>{project.category}</span>
            </div>
          )}
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-white/70">
              <Code className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 border-white/30 text-white bg-black">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-white/30 text-white bg-black">
                    +{project.technologies.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Dynamic project info */}
          <div className="flex items-center gap-4 text-sm text-white/70">
            {getMilestoneCount() > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>{getMilestoneCount()} milestones</span>
              </div>
            )}
            
            {project.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Due {formatDate(project.deadline)}</span>
              </div>
            )}
          </div>

          {project.createdAt && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Clock className="h-4 w-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-4 text-xs text-white/50">
            {project.requirements && (
              <span>{project.requirements.length} requirements</span>
            )}
            {project.deliverables && (
              <span>{project.deliverables.length} deliverables</span>
            )}
          </div>
          
          <Link href={`/projects/${project.id}`}>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-white/90 transition-colors"
            >
              View Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
```

---

## 📁 File 3: `frontend/src/components/cards/TrackCard.tsx`

**Status**: ✅ Complete rewrite with Framer Motion and unified design

```typescript
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Users, BookOpen, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TrackCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  thumbnail?: string;
  courseCount?: number;
  enrollmentCount?: number;
  progress?: number;
  isEnrolled?: boolean;
  className?: string;
  onEnroll?: (id: string) => void;
  onContinue?: (id: string) => void;
}

// Animation variants for staggered entrance
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
};

const getDifficultyColor = (difficulty: string) => {
  // Unified dark theme colors
  return "border-white/20 text-white bg-black";
};

export function TrackCard({
  id,
  title,
  description,
  category,
  difficulty,
  duration,
  thumbnail = "/test.jpg",
  courseCount = 0,
  enrollmentCount = 0,
  progress = 0,
  isEnrolled = false,
  className,
  onEnroll,
  onContinue,
}: TrackCardProps) {
  const handleAction = () => {
    if (isEnrolled && onContinue) {
      onContinue(id);
    } else if (!isEnrolled && onEnroll) {
      onEnroll(id);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300",
          "border-white/10 bg-black",
          "interactive-glow hover:-translate-y-2",
          className
        )}
        onClick={handleAction}
      >
        {/* Track thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Duration badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white text-black border-0">
              <Clock className="w-3 h-3 mr-1" />
              {duration}
            </Badge>
          </div>
          
          {/* Difficulty badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className={getDifficultyColor(difficulty)}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>

          {/* Enrollment badge */}
          {isEnrolled && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-lg line-clamp-2 text-white group-hover:text-white/80 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-white/80">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Category badge */}
          <Badge variant="outline" className="mb-3 border-white/20 text-white bg-black">
            {category}
          </Badge>
          
          {/* Track metadata */}
          <div className="flex items-center gap-4 text-sm text-white/80 mb-3">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{courseCount} courses</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{enrollmentCount.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          {isEnrolled && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Track Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </Progress>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          {/* Progress indicator */}
          {isEnrolled && progress > 0 && (
            <div className="flex items-center gap-1 text-sm text-white/80">
              <TrendingUp className="w-4 h-4" />
              <span>{progress}% complete</span>
            </div>
          )}
          
          {/* CTA Button */}
          <Button
            variant={isEnrolled ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all duration-200",
              isEnrolled 
                ? "bg-white text-black hover:bg-white/90" 
                : "border-white/20 text-white bg-black hover:bg-white hover:text-black"
            )}
          >
            {isEnrolled ? "Continue Learning" : "Start Track"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default TrackCard;
```

---

## 📄 File 4: `frontend/src/app/learn/page.tsx` (Animation Section Only)

**Changes**: Updated grid container to use staggerChildren pattern

```typescript
{/* Course Grid */}
<div>
  {loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="bg-black border-white/10">
          <CardHeader>
            <Skeleton className="h-4 w-3/4 mb-2 bg-white/20" />
            <Skeleton className="h-3 w-1/2 bg-white/20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full mb-4 bg-white/20" />
            <Skeleton className="h-3 w-full mb-2 bg-white/20" />
            <Skeleton className="h-3 w-2/3 bg-white/20" />
          </CardContent>
        </Card>
      ))}
    </div>
  ) : filteredCourses.length > 0 ? (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
      {filteredCourses.map((course) => (
        <CourseCard 
          key={course.id}
          course={course} 
          onCourseClick={(courseId) => setSelectedCourseId(courseId)}
        />
      ))}
    </motion.div>
  ) : (
    {/* Empty state */}
  )}
</div>
```

---

## 📄 File 5: `frontend/src/app/projects/page.tsx` (Animation Section Only)

**Changes**: Updated grid container to use staggerChildren pattern

```typescript
{/* Projects Grid */}
{filteredAndSortedProjects.length > 0 ? (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
    {filteredAndSortedProjects.map((project) => (
      <ProjectCard key={project.id} project={project} />
    ))}
  </motion.div>
) : (
  {/* Empty state */}
)}
```

---

## 📄 File 6: `frontend/src/app/tracks/page.tsx` (Key Changes)

**Changes**: 
1. Added import for TrackCardComponent
2. Updated grid container to use staggerChildren pattern
3. Mapped track data to new TrackCard props

```typescript
// At top of file
import { TrackCard as TrackCardComponent } from "@/components/cards/TrackCard";

// In the render section
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
```

---

## ✅ Verification Checklist

- [x] All card components wrapped in `motion.div` with `itemVariants`
- [x] All cards have `.interactive-glow` class
- [x] All cards have `hover:-translate-y-2`
- [x] All cards have unified border styling (`border-white/10`)
- [x] All parent grids use `staggerChildren` pattern
- [x] All animations use spring physics
- [x] No linter errors in any file
- [x] TrackCard completely rewritten to match design
- [x] All components using only `shadcn/ui`
- [x] All icons from `lucide-react`

**Status**: ✅ **COMPLETE** - All code refactored and tested

