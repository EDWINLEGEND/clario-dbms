"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Users, BookOpen, Award, TrendingUp, Play, CheckCircle } from "lucide-react";
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
  courses?: Array<{
    id: string;
    title: string;
  }>;
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
  switch (difficulty) {
    case "beginner":
      return "border-green-500/30 text-green-300 bg-green-500/10";
    case "intermediate":
      return "border-yellow-500/30 text-yellow-300 bg-yellow-500/10";
    case "advanced":
      return "border-red-500/30 text-red-300 bg-red-500/10";
    default:
      return "border-white/20 text-white bg-black";
  }
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
  courses,
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
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300",
          "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl",
          "hover:border-white/20 hover:from-white/10 hover:to-white/5",
          "shadow-xl hover:shadow-2xl",
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
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-black" fill="currentColor" />
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-black border-0 shadow-lg">
              <Clock className="w-3 h-3 mr-1" />
              {duration}
            </Badge>
          </div>
          
          {/* Difficulty badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={cn("backdrop-blur-sm", getDifficultyColor(difficulty))}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>

          {/* Enrollment badge */}
          {isEnrolled && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="bg-green-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-lg line-clamp-2 text-white group-hover:text-white/90 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-white/70 text-sm mt-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Category badge */}
          <Badge variant="outline" className="border-white/20 text-white bg-white/5">
            {category}
          </Badge>
          
          {/* Track metadata */}
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">{courseCount} courses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium">{enrollmentCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Course preview */}
          {courses && courses.length > 0 && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs font-medium text-white/70 mb-2">Courses included:</div>
              <div className="space-y-1.5">
                {courses.slice(0, 3).map((course, index) => (
                  <div key={course.id} className="flex items-center gap-2 text-xs text-white/70">
                    <div className="flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{index + 1}</span>
                    </div>
                    <span className="truncate">{course.title}</span>
                  </div>
                ))}
                {courses.length > 3 && (
                  <div className="text-xs text-white/50 pl-7">
                    +{courses.length - 3} more courses
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Progress bar */}
          {isEnrolled && (
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-2">
                <span className="font-medium">Your Progress</span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-white h-2.5 rounded-full shadow-lg"
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between border-t border-white/10 pt-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-sm text-white/70">
            {isEnrolled && progress > 0 ? (
              <>
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">{progress}% complete</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span className="font-medium">{duration} total</span>
              </>
            )}
          </div>
          
          {/* CTA Button */}
          <Button
            variant={isEnrolled ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all duration-200 font-medium",
              isEnrolled 
                ? "bg-white text-black hover:bg-white/90 hover:scale-105 shadow-lg" 
                : "border-white/20 text-white bg-white/5 hover:bg-white hover:text-black"
            )}
          >
            {isEnrolled ? "Continue" : "Start Track"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default TrackCard;
