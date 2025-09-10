"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  enableMotion?: boolean;
  motionProps?: {
    initial?: object;
    animate?: object;
    exit?: object;
    transition?: object;
  };
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full"
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-12"
};

const defaultMotionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.3,
    ease: "easeInOut"
  }
};

export function PageContainer({
  children,
  className,
  maxWidth = "full",
  padding = "md",
  enableMotion = true,
  motionProps = defaultMotionProps
}: PageContainerProps) {
  const containerClasses = cn(
    "w-full mx-auto",
    "bg-background text-foreground",
    "transition-colors duration-300 ease-in-out",
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    className
  );

  if (enableMotion) {
    return (
      <motion.div
        className={containerClasses}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}

// Specialized containers for different page types
export function DashboardContainer({ children, className, ...props }: Omit<PageContainerProps, 'maxWidth' | 'padding'>) {
  return (
    <PageContainer
      maxWidth="full"
      padding="lg"
      className={cn("min-h-screen", className)}
      {...props}
    >
      {children}
    </PageContainer>
  );
}

export function ContentContainer({ children, className, ...props }: Omit<PageContainerProps, 'maxWidth'>) {
  return (
    <PageContainer
      maxWidth="2xl"
      className={cn("min-h-screen", className)}
      {...props}
    >
      {children}
    </PageContainer>
  );
}

export function FormContainer({ children, className, ...props }: Omit<PageContainerProps, 'maxWidth' | 'padding'>) {
  return (
    <PageContainer
      maxWidth="md"
      padding="xl"
      className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-gradient-to-br from-background via-surface to-background",
        className
      )}
      {...props}
    >
      {children}
    </PageContainer>
  );
}

export function ModalContainer({ children, className, ...props }: Omit<PageContainerProps, 'maxWidth' | 'padding' | 'enableMotion'>) {
  return (
    <PageContainer
      maxWidth="lg"
      padding="lg"
      enableMotion={true}
      motionProps={{
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      }}
      className={cn(
        "bg-card border border-border rounded-xl shadow-xl",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </PageContainer>
  );
}