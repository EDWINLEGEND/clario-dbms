"use client";

import { ReactNode } from "react";
import { FloatingBottomNav } from "@/components/molecules/FloatingBottomNav";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";

interface RootLayoutClientProps {
  children: ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <>
      {/* Main content with padding to prevent overlap with floating nav */}
      <main className="pb-24">
        {children}
      </main>

      {/* Persistent FloatingBottomNav */}
      <FloatingBottomNav />

      {/* Toast notifications */}
      <Toaster />
    </>
  );
}