"use client";

import { useState, useRef, useEffect, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: "line" | "solid" | "bordered" | "light";
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
  animated?: boolean;
  keepMounted?: boolean;
}

const variantClasses = {
  line: {
    container: "border-b border-border",
    tab: "border-b-2 border-transparent hover:border-border transition-colors",
    activeTab: "border-primary text-primary",
    indicator: "bg-primary"
  },
  solid: {
    container: "bg-surface rounded-lg p-1",
    tab: "rounded-md hover:bg-surface-hover transition-colors",
    activeTab: "bg-background text-foreground shadow-sm",
    indicator: "bg-background shadow-sm"
  },
  bordered: {
    container: "border border-border rounded-lg",
    tab: "border-r border-border last:border-r-0 hover:bg-surface-hover transition-colors",
    activeTab: "bg-primary text-primary-foreground",
    indicator: "bg-primary"
  },
  light: {
    container: "",
    tab: "hover:bg-surface-hover transition-colors rounded-md",
    activeTab: "bg-surface text-foreground",
    indicator: "bg-surface"
  }
};

const sizeClasses = {
  sm: {
    tab: "px-3 py-2 text-sm",
    content: "p-4"
  },
  md: {
    tab: "px-4 py-3 text-base",
    content: "p-6"
  },
  lg: {
    tab: "px-6 py-4 text-lg",
    content: "p-8"
  }
};

export function Tabs({
  items,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  className,
  variant = "line",
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
  animated = true,
  keepMounted = false
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || items[0]?.id || ""
  );
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const activeTab = controlledActiveTab || internalActiveTab;
  const isControlled = controlledActiveTab !== undefined;

  const updateIndicator = useCallback(() => {
    if (!activeTabRef.current || !tabsRef.current) return;

    const tabElement = activeTabRef.current;
    const containerElement = tabsRef.current;
    const containerRect = containerElement.getBoundingClientRect();
    const tabRect = tabElement.getBoundingClientRect();

    if (orientation === "horizontal") {
      setIndicatorStyle({
        width: tabRect.width,
        height: variant === "line" ? "2px" : tabRect.height,
        transform: `translateX(${tabRect.left - containerRect.left}px)`,
        top: variant === "line" ? "auto" : tabRect.top - containerRect.top,
        bottom: variant === "line" ? 0 : "auto"
      });
    } else {
      setIndicatorStyle({
        width: variant === "line" ? "2px" : tabRect.width,
        height: tabRect.height,
        transform: `translateY(${tabRect.top - containerRect.top}px)`,
        left: variant === "line" ? 0 : tabRect.left - containerRect.left,
        right: variant === "line" ? "auto" : "auto"
      });
    }
  }, [orientation, variant]);

  useEffect(() => {
    updateIndicator();
  }, [activeTab, variant, updateIndicator]);

  const handleTabClick = (tabId: string) => {
    if (items.find(item => item.id === tabId)?.disabled) return;

    if (isControlled) {
      onTabChange?.(tabId);
    } else {
      setInternalActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  const activeTabContent = items.find(item => item.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation */}
      <div
        ref={tabsRef}
        className={cn(
          "relative flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          fullWidth && orientation === "horizontal" && "w-full",
          variantClasses[variant].container
        )}
      >
        {/* Animated Indicator */}
        {animated && (
          <motion.div
            className={cn(
              "absolute rounded-md transition-all duration-300 ease-out",
              variantClasses[variant].indicator
            )}
            style={indicatorStyle}
            layoutId="tab-indicator"
          />
        )}

        {items.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleTabClick(item.id)}
              disabled={item.disabled}
              className={cn(
                "relative flex items-center justify-center gap-2 font-medium",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200",
                sizeClasses[size].tab,
                variantClasses[variant].tab,
                fullWidth && orientation === "horizontal" && "flex-1",
                isActive
                  ? variantClasses[variant].activeTab
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon && (
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    rotate: isActive ? [0, -5, 5, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.div>
              )}
              
              <span className="relative">
                {item.label}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute -top-2 -right-2 min-w-[1.25rem] h-5",
                      "bg-primary text-primary-foreground text-xs",
                      "rounded-full flex items-center justify-center",
                      "px-1.5 font-semibold"
                    )}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </span>

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 rounded-md bg-primary/10"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1, opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.3 }}
              />
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={cn("relative", sizeClasses[size].content)}>
        <AnimatePresence mode="wait">
          {keepMounted ? (
            items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "w-full",
                  item.id !== activeTab && "hidden"
                )}
              >
                {item.content}
              </div>
            ))
          ) : (
            <motion.div
              key={activeTab}
              initial={animated ? { opacity: 0, y: 10 } : undefined}
              animate={animated ? { opacity: 1, y: 0 } : undefined}
              exit={animated ? { opacity: 0, y: -10 } : undefined}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full"
            >
              {activeTabContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Specialized tab components
export function CardTabs(props: Omit<TabsProps, 'variant'>) {
  return (
    <Tabs
      variant="solid"
      className="bg-card border border-border rounded-xl p-2"
      {...props}
    />
  );
}

export function MinimalTabs(props: Omit<TabsProps, 'variant'>) {
  return (
    <Tabs
      variant="light"
      {...props}
    />
  );
}

export function VerticalTabs(props: Omit<TabsProps, 'orientation'>) {
  return (
    <Tabs
      orientation="vertical"
      className="flex gap-6"
      {...props}
    />
  );
}

export function FullWidthTabs(props: Omit<TabsProps, 'fullWidth'>) {
  return (
    <Tabs
      fullWidth
      {...props}
    />
  );
}