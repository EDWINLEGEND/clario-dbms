import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TrackCardProps {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  progress?: number
  isEnrolled?: boolean
  className?: string
  onEnroll?: (id: string) => void
  onContinue?: (id: string) => void
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

export function TrackCard({
  id,
  title,
  description,
  category,
  difficulty,
  duration,
  progress = 0,
  isEnrolled = false,
  className,
  onEnroll,
  onContinue,
}: TrackCardProps) {
  return (
    <Card className={cn("h-full transition-shadow hover:shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          <Badge variant="secondary" className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{category}</Badge>
          <span>•</span>
          <span>{duration}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Button
          className="w-full"
          variant={isEnrolled ? "default" : "outline"}
          onClick={() => {
            if (isEnrolled && onContinue) {
              onContinue(id)
            } else if (!isEnrolled && onEnroll) {
              onEnroll(id)
            }
          }}
        >
          {isEnrolled ? "Continue Learning" : "Enroll Now"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default TrackCard