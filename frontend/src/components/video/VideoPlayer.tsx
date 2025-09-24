"use client";

import { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { CheckCircle, Clock, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface VideoPlayerProps {
  lesson: Lesson;
  onMarkComplete?: (lessonId: string) => void;
  className?: string;
}

export function VideoPlayer({ lesson, onMarkComplete, className }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { accessToken } = useAuth();

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = lesson.videoUrl ? getYouTubeVideoId(lesson.videoUrl) : null;

  const handleMarkComplete = async () => {
    if (!onMarkComplete || lesson.isCompleted) return;
    
    setIsCompleting(true);
    try {
      // Call the parent component's handler
      await onMarkComplete(lesson.id);
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const youtubeOptions: YouTubeProps['opts'] = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setIsLoading(false);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // You can add logic here to track video progress
    // event.data === 0 means video ended
    if (event.data === 0 && !lesson.isCompleted) {
      // Optionally auto-mark as complete when video ends
      // handleMarkComplete();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          {videoId ? (
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}
              <YouTube
                videoId={videoId}
                opts={youtubeOptions}
                onReady={onReady}
                onStateChange={onStateChange}
                className="w-full h-full"
                iframeClassName="w-full h-full rounded-lg"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>No video available for this lesson</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">{lesson.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(lesson.duration)}</span>
                </div>
                <Badge variant="outline">
                  Lesson {lesson.order}
                </Badge>
                {lesson.isCompleted && (
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Mark as Complete Button */}
            <Button
              onClick={handleMarkComplete}
              disabled={lesson.isCompleted || isCompleting}
              variant={lesson.isCompleted ? "outline" : "default"}
              className={cn(
                "min-w-[140px]",
                lesson.isCompleted && "border-green-200 text-green-800 bg-green-50"
              )}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Marking...
                </>
              ) : lesson.isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </CardHeader>
        
        {lesson.description && (
          <CardContent>
            <CardDescription className="text-base leading-relaxed">
              {lesson.description}
            </CardDescription>
          </CardContent>
        )}
      </Card>

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lesson Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lesson.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}