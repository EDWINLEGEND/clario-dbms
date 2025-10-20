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
  BookOpen,
  MoreVertical,
  AlertCircle,
  Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  status?: "active" | "completed" | "on-hold";
  priority?: "low" | "medium" | "high";
  milestones?: Array<{
    id: string | number;
    title: string;
    status: string;
    dueDate?: string | Date | null;
  }>;
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

// Circular progress indicator component
function CircularProgress({ value, size = 60 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="transparent"
          className="text-white/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-white transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{Math.round(value)}%</span>
      </div>
    </div>
  );
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "on-hold":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "active":
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

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

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!project.deadline) return null;
    const deadline = typeof project.deadline === 'string' ? new Date(project.deadline) : project.deadline;
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  // Calculate progress based on milestones
  const getProgress = () => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completed = project.milestones.filter(m => m.status === 'COMPLETED').length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  const progress = getProgress();
  const daysRemaining = getDaysRemaining();
  const completedMilestones = project.milestones?.filter(m => m.status === 'COMPLETED').length || 0;
  const totalMilestones = project.milestones?.length || 0;

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl",
          "hover:border-white/20 hover:from-white/10 hover:to-white/5",
          "shadow-xl hover:shadow-2xl transition-all duration-300",
          className
        )}
      >
        {/* Thumbnail Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-black to-gray-900 border-b border-white/20">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FolderOpen className="h-16 w-16 text-white/40" />
            </div>
          )}
          
          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="flex gap-2 flex-wrap">
              {project.difficulty && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-medium px-2 py-1 shadow-lg",
                    getDifficultyColor(project.difficulty)
                  )}
                >
                  {getDifficultyLabel(project.difficulty)}
                </Badge>
              )}
              {project.status && (
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium px-2 py-1 backdrop-blur-sm", getStatusColor(project.status))}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              )}
            </div>

            {/* Quick actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                <DropdownMenuItem className="hover:bg-white/10">Edit Project</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10">Add Milestone</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 text-red-400">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress circle overlay */}
          {totalMilestones > 0 && (
            <div className="absolute bottom-3 right-3">
              <CircularProgress value={progress} size={56} />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-white/90 transition-colors flex-1">
                {project.title}
              </h3>
              {project.priority && (
                <Badge 
                  variant="outline" 
                  className={cn("text-xs px-2 py-1 font-medium flex-shrink-0", getPriorityColor(project.priority))}
                >
                  {project.priority.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Milestones preview */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Target className="h-4 w-4" />
                  <span>Milestones</span>
                </div>
                <span className="text-xs text-white/70">
                  {completedMilestones}/{totalMilestones} completed
                </span>
              </div>
              <div className="space-y-1.5">
                {project.milestones.slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle 
                      className={cn(
                        "h-3.5 w-3.5 flex-shrink-0",
                        milestone.status === 'COMPLETED' ? "text-green-400" : "text-white/30"
                      )} 
                    />
                    <span className="truncate">{milestone.title}</span>
                  </div>
                ))}
                {project.milestones.length > 3 && (
                  <div className="text-xs text-white/50 pl-5">
                    +{project.milestones.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="space-y-2.5 mb-4">
            {/* Course Badge */}
            {project.course && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-1 border-blue-400/30 text-blue-400 bg-blue-400/10"
                >
                  {project.course.title}
                </Badge>
              </div>
            )}
            
            {project.category && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Tag className="h-4 w-4 flex-shrink-0" />
                <span>{project.category}</span>
              </div>
            )}
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex items-start gap-2">
                <Code className="h-4 w-4 mt-0.5 flex-shrink-0 text-white/70" />
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 border-white/20 text-white bg-white/5">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-white/20 text-white bg-white/5">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Deadline with countdown */}
            {project.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-white/70 flex-shrink-0" />
                <span className="text-white/70">Due {formatDate(project.deadline)}</span>
                {daysRemaining !== null && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs px-2 py-0.5 ml-auto",
                      daysRemaining < 0 ? "border-red-500/30 text-red-400 bg-red-500/10" :
                      daysRemaining < 7 ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                      "border-green-500/30 text-green-400 bg-green-500/10"
                    )}
                  >
                    {daysRemaining < 0 ? (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1 inline" />
                        {Math.abs(daysRemaining)}d overdue
                      </>
                    ) : daysRemaining === 0 ? (
                      "Due today"
                    ) : (
                      `${daysRemaining}d left`
                    )}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Clock className="h-3.5 w-3.5" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            
            <Link href={`/projects/${project.id}`}>
              <Button
                size="sm"
                className="bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                View
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
