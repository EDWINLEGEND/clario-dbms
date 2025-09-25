"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types";

interface AppShellProps {
  children: ReactNode;
  user?: UserType;
  className?: string;
}

export function AppShell({ children, user, className }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("min-h-full", className)}
        >
          {children}
        </motion.div>
      </main>
     </div>
   );
}

// Page Container for consistent content spacing
export function PageContainer({
  children,
  className,
  maxWidth = "7xl",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
}) {
  return (
    <div className={cn(`container mx-auto px-4 py-6 max-w-${maxWidth}`, className)}>
      {children}
    </div>
  );
}