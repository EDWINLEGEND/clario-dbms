"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className 
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-black transition-all duration-300 bg-white">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30" />
        
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-black">
                  {value}
                </p>
                {trend && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                    trend.isPositive 
                      ? "bg-black text-white" 
                      : "bg-gray-200 text-black"
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
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Decorative bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-gray-400 to-black" />
        </CardContent>
      </Card>
    </motion.div>
  );
}