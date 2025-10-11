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
