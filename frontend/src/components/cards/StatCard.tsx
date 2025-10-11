"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGlaze } from "@/hooks/useGlaze";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
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

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className 
}: StatCardProps) {
  const { ref: glazeRef } = useGlaze({ enableMouseTracking: true });

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card 
        ref={glazeRef}
        className="relative overflow-hidden border-white/10 bg-black interactive-glow btn-glaze-hover transition-all duration-300 hover:-translate-y-1"
      >
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white/60 uppercase tracking-wide mb-2">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">
                  {value}
                </p>
                {trend && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                    trend.isPositive 
                      ? "bg-white text-black" 
                      : "bg-white/20 text-white"
                  )}>
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(trend.value)}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}