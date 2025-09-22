"use client";

import { ReactNode } from "react";
import { ModernNavbar } from "@/components/molecules/ModernNavbar";
import { BottomNav } from "@/components/molecules/BottomNav";
import { User } from "@/types";
import { cn } from "@/lib/utils";

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
  showBottomNav = true,
  showHeader = true,
  className,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - hidden on mobile when bottom nav is shown */}
      {showHeader && (
        <div className={cn(showBottomNav && "hidden sm:block")}>
          <ModernNavbar user={user} />
        </div>
      )}

      {/* Main content */}
      <main
        className={cn(
          "flex-1",
          showHeader && !showBottomNav && "pt-16", // Add padding when only header is shown
          showBottomNav && "pb-16 sm:pb-0", // Add bottom padding on mobile when bottom nav is shown
          showBottomNav && showHeader && "sm:pt-16", // Add top padding on desktop when both are shown
          className
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation - only on mobile */}
      {showBottomNav && (
        <div className="sm:hidden">
          <BottomNav isAuthenticated={!!user} />
        </div>
      )}
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