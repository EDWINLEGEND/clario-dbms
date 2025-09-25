"use client";

import { MainLayout } from "@/components/layouts/MainLayout";

export default function TestCSSPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-black text-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">CSS Test Page</h1>
            <p className="text-white/80">
              This is a test page for CSS styling and components.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }