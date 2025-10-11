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
    border: "border-white/20",
    bg: "bg-black",
    text: "text-white",
    accent: "bg-white/20"
  },
  rare: {
    border: "border-blue-500/30",
    bg: "bg-black",
    text: "text-blue-400",
    accent: "bg-blue-500/20"
  },
  epic: {
    border: "border-purple-500/30",
    bg: "bg-black",
    text: "text-purple-400",
    accent: "bg-purple-500/20"
  },
  legendary: {
    border: "border-yellow-500/30",
    bg: "bg-black",
    text: "text-yellow-400",
    accent: "bg-yellow-500/20"
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
      } : {}}
      whileTap={achievement.isUnlocked ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className={cn(
        "relative overflow-hidden border transition-all duration-300",
        achievement.isUnlocked 
          ? cn(config.border, config.bg, "interactive-glow hover:-translate-y-1") 
          : "border-white/10 bg-black/50 opacity-60",
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
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <Lock className="h-8 w-8 text-white/40" />
          </div>
        )}
        
        <CardContent className={cn("text-center space-y-3 relative", sizeStyles.card)}>
          {/* Achievement Icon */}
          <div className="flex justify-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              achievement.isUnlocked 
                ? "bg-white/10 text-white backdrop-blur-sm" 
                : "bg-white/5 text-white/40"
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
              achievement.isUnlocked ? config.text : "text-white/50"
            )}>
              {achievement.name}
            </h3>
            <p className={cn(
              sizeStyles.description,
              "text-white/60 leading-tight"
            )}>
              {achievement.description}
            </p>
          </div>
          
          {/* Progress Bar (for locked achievements) */}
          {!achievement.isUnlocked && achievement.progress && (
            <div className="space-y-1">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(achievement.progress.current / achievement.progress.total) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-white/50">
                {achievement.progress.current}/{achievement.progress.total}
              </p>
            </div>
          )}
          
          {/* Unlock Date */}
          {achievement.isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-white/50">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
          
          {/* Rarity Badge */}
          {achievement.isUnlocked && rarity !== "common" && (
            <Badge 
              variant="outline" 
              className={cn(
                sizeStyles.badge,
                "capitalize font-bold border-white/20 text-white bg-white/5"
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