"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Monitor,
  Bell,
  HelpCircle,
  Shield,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Avatar, Button, Divider, Badge } from "@heroui/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ProfileMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    verified?: boolean;
  };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  className?: string;
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  showThemeToggle?: boolean;
  customMenuItems?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger" | "warning";
    badge?: string | number;
    disabled?: boolean;
  }>;
}

const placementClasses = {
  "bottom-start": "top-full left-0 mt-2",
  "bottom-end": "top-full right-0 mt-2",
  "top-start": "bottom-full left-0 mb-2",
  "top-end": "bottom-full right-0 mb-2"
};

export function ProfileMenu({
  user,
  onProfileClick,
  onSettingsClick,
  onLogout,
  className,
  placement = "bottom-end",
  showThemeToggle = true,
  customMenuItems = []
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />;
    if (theme === "system") return <Monitor className="h-4 w-4" />;
    return resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (!mounted) return "System";
    if (theme === "system") return "System";
    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  const defaultMenuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-4 w-4" />,
      onClick: () => {
        onProfileClick?.();
        setIsOpen(false);
      }
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => {
        onSettingsClick?.();
        setIsOpen(false);
      }
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      onClick: () => console.log("Notifications"),
      badge: 3
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CreditCard className="h-4 w-4" />,
      onClick: () => console.log("Billing")
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="h-4 w-4" />,
      onClick: () => console.log("Security")
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="h-4 w-4" />,
      onClick: () => console.log("Help")
    }
  ];

  const allMenuItems = [...defaultMenuItems, ...customMenuItems];

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      {/* Profile Trigger */}
      <Button
        isIconOnly
        variant="light"
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          "hover:scale-105 active:scale-95",
          "focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
        onPress={() => setIsOpen(!isOpen)}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="sm"
            className="transition-transform duration-200"
          />
          {user.verified && (
            <div className="absolute -bottom-1 -right-1">
              <Badge
                content=""
                color="success"
                shape="circle"
                size="sm"
                className="border-2 border-background"
              />
            </div>
          )}
        </div>
        
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.4 }}
        />
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-50 w-80",
              "bg-card border border-border rounded-xl shadow-2xl",
              "backdrop-blur-sm overflow-hidden",
              placementClasses[placement]
            )}
          >
            {/* User Info Header */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {user.name}
                    </h3>
                    {user.verified && (
                      <Badge color="success" size="sm" variant="flat">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                  {user.role && (
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {allMenuItems.map((item, index) => {
                const variantClasses = {
                  default: "hover:bg-surface-hover",
                  danger: "hover:bg-danger/10 hover:text-danger",
                  warning: "hover:bg-warning/10 hover:text-warning"
                };

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3",
                      "text-left text-sm transition-colors duration-200",
                      "focus:outline-none focus:bg-surface-hover",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      variantClasses[item.variant || "default"]
                    )}
                  >
                    <div className="flex-shrink-0 text-muted-foreground">
                      {item.icon}
                    </div>
                    <span className="flex-1 text-foreground">{item.label}</span>
                    {item.badge && (
                      <Badge
                        content={item.badge}
                        color="primary"
                        size="sm"
                        variant="flat"
                      />
                    )}
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </motion.button>
                );
              })}

              {/* Theme Toggle */}
              {showThemeToggle && (
                <>
                  <Divider className="my-2" />
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: allMenuItems.length * 0.05, duration: 0.2 }}
                    onClick={cycleTheme}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3",
                      "text-left text-sm transition-colors duration-200",
                      "hover:bg-surface-hover focus:outline-none focus:bg-surface-hover"
                    )}
                  >
                    <motion.div
                      key={theme + resolvedTheme}
                      initial={{ scale: 0.8, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex-shrink-0 text-muted-foreground"
                    >
                      {getThemeIcon()}
                    </motion.div>
                    <span className="flex-1 text-foreground">
                      Theme: {getThemeLabel()}
                    </span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </motion.button>
                </>
              )}

              {/* Logout */}
              {onLogout && (
                <>
                  <Divider className="my-2" />
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (allMenuItems.length + 1) * 0.05, duration: 0.2 }}
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3",
                      "text-left text-sm transition-colors duration-200",
                      "hover:bg-danger/10 hover:text-danger",
                      "focus:outline-none focus:bg-danger/10 focus:text-danger"
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="flex-1">Sign Out</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for mobile
export function CompactProfileMenu(props: Omit<ProfileMenuProps, 'className'>) {
  return (
    <ProfileMenu
      {...props}
      className="sm:hidden"
      showThemeToggle={false}
      customMenuItems={[]}
    />
  );
}

// Desktop version with full features
export function DesktopProfileMenu(props: Omit<ProfileMenuProps, 'className'>) {
  return (
    <ProfileMenu
      {...props}
      className="hidden sm:block"
    />
  );
}