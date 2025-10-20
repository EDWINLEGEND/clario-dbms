"use client";

import { ReactNode } from "react";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { DemoUserSelector } from "@/components/demo/DemoUserSelector";

interface MainLayoutProps {
  children: ReactNode;
  user?: User;
  showBottomNav?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function MainLayout({
  children,
  user,
  showBottomNav = false, // Default to false since FloatingBottomNav is now in root layout
  showHeader = false,
  className,
}: MainLayoutProps) {
  // Show demo selector in development or when demo mode is enabled
  const showDemoSelector = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <div className="min-h-screen bg-background">
      {/* Main content - no bottom padding needed since FloatingBottomNav is in root layout */}
      <main
        className={cn(
          "min-h-screen",
          className
        )}
      >
        {children}
      </main>
      
      {/* Demo User Selector - only in development or demo mode */}
      {showDemoSelector && <DemoUserSelector />}
    </div>
  );
}

// Specialized layout for auth pages
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout showBottomNav={false} showHeader={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md space-y-8 px-4">
          {children}
        </div>
      </div>
    </MainLayout>
  );
}

// Specialized layout for dashboard pages
export function DashboardLayout({ 
  children, 
  user 
}: { 
  children: ReactNode; 
  user?: User; 
}) {
  return (
    <MainLayout user={user}>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </MainLayout>
  );
}

// Specialized layout for content pages (courses, lessons, etc.)
export function ContentLayout({ 
  children, 
  user,
  sidebar 
}: { 
  children: ReactNode; 
  user?: User;
  sidebar?: ReactNode;
}) {
  return (
    <MainLayout user={user}>
      <div className="flex min-h-screen">
        {/* Main content */}
        <div className={cn(
          "flex-1",
          sidebar && "lg:mr-80" // Add margin when sidebar is present
        )}>
          {children}
        </div>
        
        {/* Sidebar */}
        {sidebar && (
          <aside className="fixed right-0 top-16 hidden h-[calc(100vh-4rem)] w-80 overflow-y-auto border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
            {sidebar}
          </aside>
        )}
      </div>
    </MainLayout>
  );
}