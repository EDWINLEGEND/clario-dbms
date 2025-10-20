"use client";

import { ArrowRight, Users, TrendingUp, Target, BookOpen, Code, Zap, Award, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CustomButton } from "@/components/atoms/CustomButton";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

// Animated counter component
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const features = [
    {
      icon: TrendingUp,
      title: "Personalized Learning",
      description: "AI-powered recommendations tailored to your unique learning style - Visual, Auditory, or Kinesthetic."
    },
    {
      icon: Target,
      title: "Project Tracking",
      description: "Manage real-world projects with milestones, deadlines, and progress tracking to build your portfolio."
    },
    {
      icon: Zap,
      title: "Accountability System",
      description: "Stay motivated with optional accountability fees and smart reminders to keep you on track."
    }
  ];

  const stats = [
    { label: "Active Learners", value: 10000, suffix: "+" },
    { label: "Video Courses", value: 500, suffix: "+" },
    { label: "Learning Tracks", value: 50, suffix: "+" },
    { label: "Projects Completed", value: 2500, suffix: "+" }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "College Student",
      content: "Clario's personalized recommendations helped me learn React in half the time. The project tracking feature keeps me accountable!",
      avatar: "AC"
    },
    {
      name: "Jordan Park",
      role: "Full-Stack Developer",
      content: "The hands-on projects and milestone system are game-changers. I've completed 12 projects and landed my dream job!",
      avatar: "JP"
    },
    {
      name: "Maya Rodriguez",
      role: "Backend Engineer",
      content: "As an auditory learner, Clario's content recommendations are spot-on. The accountability features keep me consistent.",
      avatar: "MR"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')"
          }}
        />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        {/* Content */}
        <div className="relative z-10 w-full px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-manrope text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-6 drop-shadow-2xl"
            >
              CLARIO
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Learn Smarter, Track Progress, Build Your Future
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base md:text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The AI-powered learning platform that adapts to your style. Get personalized video recommendations, track projects, and stay accountable with smart reminders.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
            >
              <CustomButton
                as={Link}
                href="/learn"
                color="primary"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 min-w-[180px] md:min-w-[200px] bg-white text-black hover:bg-white/90 hover:scale-105 shadow-2xl hover:shadow-white/20 transition-all duration-300"
                rightIcon={ArrowRight}
              >
                Start Learning
              </CustomButton>
              <CustomButton
                as={Link}
                href="/tracks"
                variant="bordered"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 min-w-[180px] md:min-w-[200px] border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Browse Tracks
              </CustomButton>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm md:text-base text-white/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-gradient-to-b from-black to-gray-900 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose Clario?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey and achieve your goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:from-white/10 hover:to-white/5 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-black py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Loved by Learners Worldwide
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              See what our community has to say about their learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="h-full border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-white/60 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Join thousands of learners who are building their future with personalized education
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CustomButton
                as={Link}
                href="/login"
                size="lg"
                className="text-lg px-8 py-4 min-w-[200px] bg-white text-black hover:bg-white/90 hover:scale-105 shadow-2xl hover:shadow-white/20 transition-all duration-300"
                rightIcon={ArrowRight}
              >
                Get Started Free
              </CustomButton>
              <CustomButton
                as={Link}
                href="/learn"
                variant="bordered"
                size="lg"
                className="text-lg px-8 py-4 min-w-[200px] border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Explore Courses
              </CustomButton>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
