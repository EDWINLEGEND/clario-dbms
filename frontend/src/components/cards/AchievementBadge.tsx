"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    total: number;
  };
  rarity?: "common" | "rare" | "epic" | "legendary";
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const rarityConfig = {
  common: {
    border: "border-gray-300",
    bg: "bg-gray-50",
    text: "text-gray-700",
    accent: "bg-gray-200"
  },
  rare: {
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    accent: "bg-blue-200"
  },
  epic: {
    border: "border-purple-300",
    bg: "bg-purple-50",
    text: "text-purple-700",
    accent: "bg-purple-200"
  },
  legendary: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    accent: "bg-yellow-200"
  }
};

const sizeConfig = {
  sm: {
    card: "p-3",
    icon: "text-2xl",
    title: "text-xs font-bold",
    description: "text-xs",
    badge: "text-xs"
  },
  md: {
    card: "p-4",
    icon: "text-3xl",
    title: "text-sm font-bold",
    description: "text-xs",
    badge: "text-xs"
  },
  lg: {
    card: "p-6",
    icon: "text-4xl",
    title: "text-base font-bold",
    description: "text-sm",
    badge: "text-sm"
  }
};

export function AchievementBadge({ 
  achievement, 
  size = "md", 
  className 
}: AchievementBadgeProps) {
  const rarity = achievement.rarity || "common";
  const config = rarityConfig[rarity];
  const sizeStyles = sizeConfig[size];
  
  const getDefaultIcon = () => {
    switch (rarity) {
      case "legendary": return "🏆";
      case "epic": return "💎";
      case "rare": return "🥇";
      default: return "🏅";
    }
  };

  return (
    <motion.div
      whileHover={achievement.isUnlocked ? { 
        scale: 1.05,
        rotateY: 5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      } : {}}
      whileTap={achievement.isUnlocked ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className={cn(
        "relative overflow-hidden border-2 transition-all duration-300",
        achievement.isUnlocked 
          ? cn(config.border, "hover:border-black bg-white") 
          : "border-gray-200 bg-gray-50 opacity-60",
        achievement.isUnlocked && rarity === "legendary" && "animate-pulse"
      )}>
        {/* Rarity accent */}
        {achievement.isUnlocked && (
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1",
            config.accent
          )} />
        )}
        
        {/* Lock overlay for locked achievements */}
        {!achievement.isUnlocked && (
          <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center z-10">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <CardContent className={cn("text-center space-y-3 relative", sizeStyles.card)}>
          {/* Achievement Icon */}
          <div className="flex justify-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              achievement.isUnlocked 
                ? "bg-black text-white" 
                : "bg-gray-200 text-gray-400"
            )}>
              <span className={sizeStyles.icon}>
                {achievement.icon || getDefaultIcon()}
              </span>
            </div>
          </div>
          
          {/* Achievement Info */}
          <div className="space-y-1">
            <h3 className={cn(
              sizeStyles.title,
              achievement.isUnlocked ? "text-black" : "text-gray-500"
            )}>
              {achievement.name}
            </h3>
            <p className={cn(
              sizeStyles.description,
              "text-gray-600 leading-tight"
            )}>
              {achievement.description}
            </p>
          </div>
          
          {/* Progress Bar (for locked achievements) */}
          {!achievement.isUnlocked && achievement.progress && (
            <div className="space-y-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(achievement.progress.current / achievement.progress.total) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {achievement.progress.current}/{achievement.progress.total}
              </p>
            </div>
          )}
          
          {/* Unlock Date */}
          {achievement.isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-gray-500">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
          
          {/* Rarity Badge */}
          {achievement.isUnlocked && rarity !== "common" && (
            <Badge 
              variant="outline" 
              className={cn(
                sizeStyles.badge,
                "capitalize font-bold border-black text-black"
              )}
            >
              {rarity}
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}