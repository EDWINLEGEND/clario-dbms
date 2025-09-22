"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Button,
  Input,
  Avatar,
} from "@heroui/react";
import {
  Home,
  BookOpen,
  Map,
  FolderOpen,
  User,
  Search,
  LogIn,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
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
];

interface SearchResult {
  id: string;
  title: string;
  type: "course" | "track" | "project";
  url: string;
}

interface FloatingBottomNavProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  className?: string;
}

export function FloatingBottomNav({
  isAuthenticated = false,
  user,
  className,
}: FloatingBottomNavProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropUp, setShowSearchDropUp] = useState(false);
  const [showProfileDropUp, setShowProfileDropUp] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Mock search function - replace with actual API call
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock results
    const baseResults: SearchResult[] = [
      { id: "1", title: "React Fundamentals", type: "course", url: "/learn/react-fundamentals" },
      { id: "2", title: "Full-Stack Development", type: "track", url: "/tracks/fullstack" },
      { id: "3", title: "E-commerce Platform", type: "project", url: "/projects/ecommerce" },
    ];

    const mockResults = baseResults.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && showSearchDropUp) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, showSearchDropUp]);

  // Close dropups on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropUp(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropUp(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropups on route change
  useEffect(() => {
    setShowSearchDropUp(false);
    setShowProfileDropUp(false);
  }, [pathname]);



  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout clicked");
    setShowProfileDropUp(false);
  };

  const SearchDropUp = () => {
    if (!showSearchDropUp) return null;

    const dropUpContent = (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute bottom-full mb-3 left-0 right-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg max-h-80 overflow-y-auto z-50"
      >
        <div className="p-4">
          {isSearching ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                Search Results
              </div>
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => setShowSearchDropUp(false)}
                >
                  <div className="font-medium text-sm mb-1">{result.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {result.type}
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
              No results found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
              Start typing to search courses, tracks, and projects...
            </div>
          )}
        </div>
      </motion.div>
    );

    return createPortal(dropUpContent, document.body);
  };

  const ProfileDropUp = () => {
    if (!showProfileDropUp) return null;

    const dropUpContent = (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute bottom-full mb-3 right-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg min-w-52 z-50"
        style={{
          position: "fixed",
          bottom: "calc(100vh - 110px)", // Improved positioning to prevent overlap
          right: "24px",
        }}
      >
        <div className="p-3">
          {isAuthenticated && user ? (
            <>
              <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800 mb-2">
                <div className="font-medium text-sm mb-1">{user.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm"
                onClick={() => setShowProfileDropUp(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm"
                onClick={() => setShowProfileDropUp(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm w-full text-left mt-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm"
              onClick={() => setShowProfileDropUp(false)}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </motion.div>
    );

    return createPortal(dropUpContent, document.body);
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40",
          "bg-white/90 dark:bg-black/90 backdrop-blur-lg",
          "border border-gray-200 dark:border-gray-800",
          "rounded-full shadow-md",
          "px-4 py-2",
          "flex items-center gap-2",
          "transition-all duration-300 ease-in-out",
          className
        )}
        style={{
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Mobile Layout */}
        <div className="flex items-center gap-2 md:hidden w-full">
          {/* Search Bar - Full width on mobile */}
          <div ref={searchRef} className="relative flex-1">
            <Input
              placeholder="Search courses, projects, tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchDropUp(true)}
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              endContent={
                searchQuery && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )
              }
              classNames={{
                base: "h-10",
                input: "text-sm",
                inputWrapper: "rounded-full border-none bg-gray-100 dark:bg-gray-900",
              }}
            />
            <AnimatePresence>
              <SearchDropUp />
            </AnimatePresence>
          </div>



          {/* Profile/Login */}
          <div ref={profileRef} className="relative">
            <Button
              isIconOnly
              variant="light"
              onClick={() => setShowProfileDropUp(!showProfileDropUp)}
              className="rounded-full h-10 w-10 min-w-10"
            >
              {isAuthenticated && user?.avatar ? (
                <Avatar
                  src={user.avatar}
                  size="sm"
                  className="h-6 w-6"
                />
              ) : isAuthenticated ? (
                <User className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
            </Button>
            <AnimatePresence>
              <ProfileDropUp />
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-2">
          {/* Navigation Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Button
                key={item.href}
                as={Link}
                href={item.href}
                isIconOnly
                variant={active ? "solid" : "light"}
                color={active ? "primary" : "default"}
                className="rounded-full h-10 px-4 min-w-0"
                startContent={<Icon className="h-4 w-4" />}
              >
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            );
          })}

          {/* Search Bar - Compact on desktop */}
          <div ref={searchRef} className="relative">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchDropUp(true)}
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              endContent={
                searchQuery && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )
              }
              classNames={{
                base: "w-64 h-10",
                input: "text-sm",
                inputWrapper: "rounded-full border-none bg-gray-100 dark:bg-gray-900",
              }}
            />
            <AnimatePresence>
              <SearchDropUp />
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle size="sm" className="rounded-full" />

          {/* Profile/Login */}
          <div ref={profileRef} className="relative">
            <Button
              isIconOnly
              variant="light"
              onClick={() => setShowProfileDropUp(!showProfileDropUp)}
              className="rounded-full h-10 w-10 min-w-10"
            >
              {isAuthenticated && user?.avatar ? (
                <Avatar
                  src={user.avatar}
                  size="sm"
                  className="h-6 w-6"
                />
              ) : isAuthenticated ? (
                <User className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
            </Button>
            <AnimatePresence>
              <ProfileDropUp />
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Bottom Navigation Items - Mobile Only */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 md:hidden"
      >
        <div className="flex items-center gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Button
                key={item.href}
                as={Link}
                href={item.href}
                isIconOnly
                variant={active ? "solid" : "light"}
                color={active ? "primary" : "default"}
                className="rounded-full h-10 w-10 min-w-10"
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
          
          {/* Theme Toggle for Mobile */}
          <div className="border-l border-gray-200 dark:border-gray-700 pl-2 ml-2">
            <ThemeToggle size="sm" className="rounded-full h-10 w-10 min-w-10" />
          </div>
        </div>
      </motion.div>
    </>
  );
}