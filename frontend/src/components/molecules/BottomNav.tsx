"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { 
  Home, 
  BookOpen, 
  Map, 
  FolderOpen, 
  User, 
  LogIn,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/learn", icon: BookOpen, label: "Learn" },
  { href: "/tracks", icon: Map, label: "Tracks" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/account", icon: User, label: "Account", requiresAuth: true },
];

interface BottomNavProps {
  isAuthenticated?: boolean;
  className?: string;
}

export function BottomNav({ isAuthenticated = false, className }: BottomNavProps) {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg",
          "border-t border-gray-200 dark:border-gray-800",
          "safe-area-pb",
          className
        )}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            // Show login button instead of account if not authenticated
            if (item.requiresAuth && !isAuthenticated) {
              return (
                <motion.div
                  key="auth"
                  className="flex-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    as={Link}
                    href="/auth"
                    variant="light"
                    className={cn(
                      "flex h-12 w-full flex-col items-center justify-center gap-1 px-2 relative",
                      "text-xs font-medium transition-all duration-200",
                      isActive("/auth")
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <motion.div
                      animate={isActive("/auth") ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <LogIn className="h-5 w-5" />
                    </motion.div>
                    <span>Login</span>
                    {isActive("/auth") && (
                      <motion.div
                        className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
                        layoutId="bottomActiveIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={item.href}
                className="flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  as={Link}
                  href={item.href}
                  variant="light"
                  className={cn(
                    "flex h-12 w-full flex-col items-center justify-center gap-1 px-2 relative",
                      "text-xs font-medium transition-all duration-200",
                      active
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary-500"
                    )}
                  >
                    <motion.div
                      animate={active ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
                        layoutId="bottomActiveIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
            );
          })}
          
          {/* More button with theme toggle */}
          <div className="flex-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="light"
                className={cn(
                  "flex h-12 w-full flex-col items-center justify-center gap-1 px-2",
                  "text-xs font-medium transition-all duration-200",
                  "text-gray-600 dark:text-gray-400 hover:text-primary-500"
                )}
                onPress={() => setShowMore(!showMore)}
              >
                <motion.div
                  animate={showMore ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Settings className="h-5 w-5" />
                </motion.div>
                <span>More</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowMore(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div 
              className="fixed bottom-16 right-4 z-50 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ThemeToggle showLabel className="justify-start" />
                </motion.div>
                {isAuthenticated && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Button
                        as={Link}
                        href="/dashboard"
                        variant="light"
                        className="w-full justify-start hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        onPress={() => setShowMore(false)}
                      >
                        Dashboard
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        as={Link}
                        href="/settings"
                        variant="light"
                        className="w-full justify-start hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        onPress={() => setShowMore(false)}
                      >
                        Settings
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for bottom navigation */}
      <div className="h-16" />
    </>
  );
}