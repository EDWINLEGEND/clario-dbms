"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Home,
  BookOpen,
  Map,
  FolderOpen,
  Users,
  Search,
  Bell,
  User,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { CustomAvatar } from "@/components/atoms/CustomAvatar";
import { User as UserType } from "@/types";

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
  { href: "/community", icon: Users, label: "Community" },
];

interface ModernNavbarProps {
  user?: UserType;
  className?: string;
}

export function ModernNavbar({ user, className }: ModernNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl",
          "border-b border-gray-200/50 dark:border-gray-800/50",
          "shadow-sm",
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand */}
            <div className="flex items-center">
              <Link href="/" className="font-bold text-xl sm:text-2xl font-manrope">
                <span className="text-primary-600 dark:text-primary-400">CLARIO</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      as={Link}
                      href={item.href}
                      variant={active ? "flat" : "light"}
                      color={active ? "primary" : "default"}
                      className={cn(
                        "h-9 lg:h-10 px-3 lg:px-4 rounded-full transition-all duration-200",
                        "flex items-center gap-1.5 lg:gap-2 font-medium",
                        active
                          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      <span className="text-xs lg:text-sm xl:text-sm">{item.label}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Tablet Navigation - Icons Only */}
            <div className="hidden md:flex lg:hidden items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      as={Link}
                      href={item.href}
                      isIconOnly
                      variant={active ? "flat" : "light"}
                      color={active ? "primary" : "default"}
                      className={cn(
                        "h-9 w-9 rounded-full transition-all duration-200",
                        active
                          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      title={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Search */}
              <div className="hidden xl:block">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      classNames={{
                        base: "max-w-[200px] xl:max-w-[240px]",
                        mainWrapper: "h-full",
                        input: "text-sm",
                        inputWrapper: "h-9 xl:h-10 rounded-full bg-gray-100 dark:bg-gray-800 border-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                      }}
                      placeholder="Search courses..."
                      size="sm"
                      startContent={<Search className="h-4 w-4 text-gray-500" />}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              {/* Tablet Search Icon */}
              <div className="hidden lg:block xl:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    isIconOnly
                    variant="light"
                    className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    onPress={() => {
                      // Could open a search modal on tablet
                      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
                      if (searchInput) searchInput.focus();
                    }}
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <div className="scale-90 md:scale-100">
                  <ThemeToggle />
                </div>
              </div>

              {user ? (
                <>
                  {/* Notifications */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      isIconOnly
                      variant="light"
                      className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Notifications"
                    >
                      <Bell className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </motion.div>

                  {/* User Menu */}
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant="light"
                          className="h-9 md:h-10 px-2 md:px-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-800"
                        >
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <CustomAvatar name={user.name} src={user.avatar} size="sm" />
                            <span className="hidden md:block text-xs md:text-sm font-medium">
                              {user.name.split(' ')[0]}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          </div>
                        </Button>
                      </motion.div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User menu actions" className="rounded-xl">
                      <DropdownItem key="profile" href="/profile" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem key="dashboard" href="/dashboard" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem key="settings" href="/settings" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem key="logout" color="danger" className="rounded-lg">
                        Log Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    as={Link}
                    href="/auth"
                    color="primary"
                    variant="flat"
                    className="h-9 md:h-10 px-4 md:px-6 rounded-full font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">Sign In</span>
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    isIconOnly
                    variant="light"
                    className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    onPress={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  >
                    {isMenuOpen ? (
                      <X className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <Menu className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              className="fixed top-16 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 lg:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <Input
                    classNames={{
                      base: "w-full",
                      mainWrapper: "h-full",
                      input: "text-sm sm:text-base",
                      inputWrapper: "h-12 sm:h-14 rounded-xl bg-gray-100 dark:bg-gray-800 border-0",
                    }}
                    placeholder="Search courses..."
                    size="lg"
                    startContent={<Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                {/* Mobile Navigation Items */}
                <div className="space-y-2 sm:space-y-3">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <motion.div
                        key={item.href}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          as={Link}
                          href={item.href}
                          variant={active ? "flat" : "light"}
                          color={active ? "primary" : "default"}
                          className={cn(
                            "w-full h-12 sm:h-14 justify-start rounded-xl transition-all duration-200",
                            "flex items-center gap-4 font-medium text-base sm:text-lg px-4",
                            active
                              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          onPress={() => setIsMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Theme Toggle */}
                <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </span>
                    <div className="scale-110">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-14 sm:h-16" />
    </>
  );
}

export default ModernNavbar;