"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";

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
  className?: string;
}

export function FloatingBottomNav({
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
  const { user, isAuthenticated, logout } = useAuth();

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
    logout();
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
        className="absolute bottom-full mb-3 left-0 right-0 bg-black border border-white/20 rounded-2xl shadow-lg max-h-80 overflow-y-auto z-50 interactive-glow"
      >
        <div className="p-4">
          {isSearching ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-medium text-white/60 mb-3">
                Search Results
              </div>
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  className="block p-3 rounded-lg hover:bg-white/10 transition-colors text-white"
                  onClick={() => setShowSearchDropUp(false)}
                >
                  <div className="font-medium text-sm mb-1">{result.title}</div>
                  <div className="text-xs text-white/60 capitalize">
                    {result.type}
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-6 text-white/60 text-sm">
              No results found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="text-center py-6 text-white/60 text-sm">
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
        className="absolute bottom-full mb-3 right-0 bg-black border border-white/20 rounded-2xl shadow-lg min-w-52 z-50 interactive-glow"
        style={{
          position: "fixed",
          bottom: "calc(100vh - 110px)",
          right: "24px",
        }}
      >
        <div className="p-3">
          {isAuthenticated && user ? (
            <>
              <div className="px-3 py-3 border-b border-white/10 mb-2">
                <div className="font-medium text-sm mb-1 text-white">{user.name}</div>
                <div className="text-xs text-white/60">{user.email}</div>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white"
                onClick={() => setShowProfileDropUp(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white"
                onClick={() => setShowProfileDropUp(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white"
                onClick={() => setShowProfileDropUp(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Separator className="my-2 bg-white/10" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm w-full text-left text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white"
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
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40",
          "bg-black/90 backdrop-blur-lg",
          "border border-white/20",
          "rounded-full shadow-lg",
          "px-4 py-2",
          "flex items-center gap-2",
          "transition-all duration-300 ease-in-out",
          "interactive-glow",
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 z-10" />
              <Input
                placeholder="Search courses, projects, tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropUp(true)}
                className="h-10 pl-10 pr-10 rounded-full border-none bg-white/10 text-white placeholder:text-white/60 text-sm focus-visible:ring-white/20"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                >
                  <X className="h-3 w-3 text-white" />
                </Button>
              )}
            </div>
            <AnimatePresence>
              <SearchDropUp />
            </AnimatePresence>
          </div>

          {/* Profile/Login */}
          <div ref={profileRef} className="relative">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowProfileDropUp(!showProfileDropUp)}
              className="rounded-full h-10 w-10 text-white hover:bg-white/10"
              data-cy="profile-avatar-button"
            >
              {isAuthenticated && user?.avatar ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-white/10 text-white text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ) : isAuthenticated ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <LogIn className="h-4 w-4 text-white" />
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
                asChild
                size="sm"
                variant={active ? "default" : "ghost"}
                className={cn(
                  "rounded-full h-10 px-4 gap-2",
                  !active && "text-white hover:bg-white/10"
                )}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              </Button>
            );
          })}

          {/* Search Bar - Compact on desktop */}
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 z-10" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropUp(true)}
                className="w-64 h-10 pl-10 pr-10 rounded-full border-none bg-white/10 text-white placeholder:text-white/60 text-sm focus-visible:ring-white/20"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                >
                  <X className="h-3 w-3 text-white" />
                </Button>
              )}
            </div>
            <AnimatePresence>
              <SearchDropUp />
            </AnimatePresence>
          </div>

          {/* Profile/Login */}
          <div ref={profileRef} className="relative">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowProfileDropUp(!showProfileDropUp)}
              className="rounded-full h-10 w-10 text-white hover:bg-white/10"
              data-cy="profile-avatar-button"
            >
              {isAuthenticated && user?.avatar ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-white/10 text-white text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ) : isAuthenticated ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <LogIn className="h-4 w-4 text-white" />
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
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 md:hidden"
      >
        <div className="flex items-center gap-2 bg-black/90 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 shadow-lg interactive-glow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Button
                key={item.href}
                asChild
                size="icon"
                variant={active ? "default" : "ghost"}
                className={cn(
                  "rounded-full h-10 w-10",
                  !active && "text-white hover:bg-white/10"
                )}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                </Link>
              </Button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}