"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/atoms/CustomButton";
import { MainLayout } from "@/components/layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Full-Screen Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')"
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-manrope text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
              CLARIO
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn, Track, and Build Your Future
            </p>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of learners on the modern platform for courses, learning tracks, and real-world projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <CustomButton
                as={Link}
                href="/learn"
                color="primary"
                size="lg"
                className="text-lg px-8 py-4 min-w-[200px]"
                rightIcon={ArrowRight}
              >
                Start Learning
              </CustomButton>
              <CustomButton
                as={Link}
                href="/tracks"
                variant="bordered"
                size="lg"
                className="text-lg px-8 py-4 min-w-[200px] border-white text-white hover:bg-white hover:text-black"
              >
                Browse Tracks
              </CustomButton>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
