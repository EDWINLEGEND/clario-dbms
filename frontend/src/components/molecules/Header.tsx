"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@heroui/react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { CustomAvatar } from "@/components/atoms/CustomAvatar";
import { LoginDropup } from "@/components/molecules/LoginDropup";
import { User } from "@/types";

interface HeaderProps {
  user?: User;
  className?: string;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/tracks", label: "Tracks" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
];

export function Header({ user, className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginDropup, setShowLoginDropup] = useState(false);
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
      // Navigate to search results using client-side routing
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className={cn(
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg",
        "border-b border-gray-200 dark:border-gray-800",
        className
      )}
      maxWidth="full"
      position="sticky"
    >
      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Brand */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-xl font-manrope">
            <span className="text-primary-600 dark:text-primary-400">CLARIO</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop brand and navigation */}
      <NavbarContent className="hidden sm:flex gap-8" justify="start">
        <NavbarBrand>
          <Link href="/" className="font-bold text-2xl font-manrope">
            <span className="text-primary-600 dark:text-primary-400">CLARIO</span>
          </Link>
        </NavbarBrand>
        
        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={isActive(item.href)}>
            <Link
              href={item.href}
              className={cn(
                "relative font-medium transition-all duration-200 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-105",
                isActive(item.href)
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {item.label}
              </motion.span>
              {isActive(item.href) && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Search and user actions */}
      <NavbarContent justify="end">
        {/* Search - hidden on mobile */}
        <NavbarItem className="hidden md:flex">
          <form onSubmit={handleSearch}>
            <Input
              classNames={{
                base: "max-w-full sm:max-w-[200px] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              placeholder="Search courses..."
              size="sm"
              startContent={<Search className="h-4 w-4" />}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </NavbarItem>

        {/* Theme toggle */}
        <NavbarItem className="hidden sm:flex">
          <ThemeToggle />
        </NavbarItem>

        {user ? (
          <>
            {/* Notifications */}
            <NavbarItem>
              <Button isIconOnly variant="light" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
            </NavbarItem>

            {/* User menu */}
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="light"
                    className="p-0 data-[hover=true]:bg-transparent"
                  >
                    <div className="flex items-center gap-2">
                      <CustomAvatar name={user.name} src={user.avatar} size="sm" />
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu actions">
                  <DropdownItem key="profile" href="/profile">
                    Profile
                  </DropdownItem>
                  <DropdownItem key="dashboard" href="/dashboard">
                    Dashboard
                  </DropdownItem>
                  <DropdownItem key="settings" href="/settings">
                    Settings
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem className="relative">
            <Button 
              color="primary" 
              variant="flat"
              onClick={() => setShowLoginDropup(!showLoginDropup)}
              className={cn(
                "transition-all duration-300 hover:scale-105 font-medium",
                "bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40",
                "border border-primary-200 dark:border-primary-800",
                showLoginDropup && "ring-2 ring-primary-500/20 bg-primary-100 dark:bg-primary-900/40"
              )}
            >
              Sign In
            </Button>
            <div className="absolute top-full right-0 mt-2 z-50">
              <LoginDropup 
                isVisible={showLoginDropup} 
                onClose={() => setShowLoginDropup(false)}
              />
            </div>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <NavbarMenu>
              {/* Search in mobile menu */}
              <NavbarMenuItem>
                <motion.form 
                  onSubmit={handleSearch} 
                  className="w-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input
                    placeholder="Search courses..."
                    startContent={<Search className="h-4 w-4" />}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </motion.form>
              </NavbarMenuItem>

              {navItems.map((item, index) => (
                <NavbarMenuItem key={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "w-full font-medium transition-all duration-200 hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-2",
                        isActive(item.href)
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.span
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.95 }}
                        className="block py-2"
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                </NavbarMenuItem>
              ))}

              {/* Theme toggle in mobile menu */}
              <NavbarMenuItem>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm font-medium">Theme:</span>
                  <ThemeToggle showLabel />
                </motion.div>
              </NavbarMenuItem>
            </NavbarMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </Navbar>
  );
}