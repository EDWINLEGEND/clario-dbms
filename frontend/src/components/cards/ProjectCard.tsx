"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Clock, 
  Code, 
  Tag, 
  CheckCircle, 
  Calendar,
  FolderOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Project } from "@/types";

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
    <Card
      className={cn(
        "group relative overflow-hidden border-2 border-white/20 bg-black transition-all duration-300 hover:border-white hover:shadow-lg",
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
  );
}