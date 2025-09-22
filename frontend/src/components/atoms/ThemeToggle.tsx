"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "solid" | "bordered" | "flat";
  showLabel?: boolean;
}

export function ThemeToggle({ 
  className, 
  size = "md", 
  variant = "flat",
  showLabel = false 
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        isIconOnly={!showLabel}
        size={size}
        variant={variant}
        className={cn("animate-pulse", className)}
        disabled
      >
        <Sun className="h-4 w-4" />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light" || resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    return resolvedTheme === "dark" ? (
      <Moon className="h-4 w-4" />
    ) : (
      <Sun className="h-4 w-4" />
    );
  };

  const getLabel = () => {
    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  return (
    <Button
      isIconOnly={!showLabel}
      size={size}
      variant={variant}
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95",
        "bg-background/50 backdrop-blur-sm border border-border/50",
        "hover:bg-surface-hover hover:border-border",
        "focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      onPress={cycleTheme}
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${theme ?? "system"}-${resolvedTheme ?? ""}`}
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
           animate={{ scale: 1, opacity: 1, rotate: 0 }}
           exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
           transition={{ 
             duration: 0.3, 
             ease: "easeInOut",
             type: "spring",
             stiffness: 200,
             damping: 20
           }}
           className="flex items-center justify-center"
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
      {showLabel && (
        <motion.span 
          className="ml-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          {getLabel()}
        </motion.span>
      )}
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.4 }}
      />
    </Button>
  );
}