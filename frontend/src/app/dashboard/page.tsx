"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Play,
  CheckCircle,
  ArrowRight,
  Flame,
  Users,
  Star,
  Trophy,
  Zap,
  Brain,
  Code,
  Sparkles
} from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { AchievementBadge } from "@/components/cards/AchievementBadge";

// Mock user data
const mockUser = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: undefined,
  streak: 14,
  level: 5,
  xp: 2450,
  nextLevelXp: 3000,
};

// Mock courses in progress
const coursesInProgress = [
  {
    id: "1",
    title: "React Fundamentals",
    instructor: "Sarah Johnson",
    thumbnail: "/test.jpg",
    progress: 75,
    timeSpent: 180,
    totalDuration: 300,
    nextLesson: "State Management",
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    instructor: "Mike Chen",
    thumbnail: "/test.jpg",
    progress: 40,
    timeSpent: 120,
    totalDuration: 480,
    nextLesson: "Generic Types",
  },
  {
    id: "3",
    title: "Node.js Backend",
    instructor: "Emma Davis",
    thumbnail: "/test.jpg",
    progress: 20,
    timeSpent: 60,
    totalDuration: 360,
    nextLesson: "Express Routing",
  },
];

// Mock achievements
const achievements = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 10),
    rarity: "common" as const,
  },
  {
    id: "2",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 3),
    rarity: "rare" as const,
  },
  {
    id: "3",
    name: "Course Crusher",
    description: "Complete your first course",
    icon: "🏆",
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 5),
    rarity: "epic" as const,
  },
  {
    id: "4",
    name: "Speed Demon",
    description: "Complete 5 lessons in one day",
    icon: "⚡",
    isUnlocked: false,
    progress: { current: 3, total: 5 },
    rarity: "rare" as const,
  },
  {
    id: "5",
    name: "Master Learner",
    description: "Complete 10 courses",
    icon: "🎓",
    isUnlocked: false,
    progress: { current: 1, total: 10 },
    rarity: "legendary" as const,
  },
  {
    id: "6",
    name: "Consistency King",
    description: "Maintain a 30-day streak",
    icon: "👑",
    isUnlocked: false,
    progress: { current: 14, total: 30 },
    rarity: "legendary" as const,
  },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Calculate stats
  const totalCoursesEnrolled = coursesInProgress.length;
  const completedCourses = 1; // Mock data
  const totalTimeSpent = coursesInProgress.reduce((acc, course) => acc + course.timeSpent, 0);
  const averageProgress = coursesInProgress.reduce((acc, course) => acc + course.progress, 0) / coursesInProgress.length;
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="max-w-7xl mx-auto p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* User Profile Header */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 bg-gradient-to-r from-white to-gray-50">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 border-4 border-black">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="bg-black text-white text-2xl font-bold">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome back, {mockUser.name.split(' ')[0]}!
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="text-lg font-bold text-black">
                          🔥 {mockUser.streak} Day Streak
                        </span>
                      </div>
                      <Badge variant="outline" className="border-black text-black font-bold">
                        Level {mockUser.level}
                      </Badge>
                    </div>
                    
                    {/* XP Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">XP Progress</span>
                        <span className="font-bold text-black">
                          {mockUser.xp}/{mockUser.nextLevelXp}
                        </span>
                      </div>
                      <Progress 
                        value={(mockUser.xp / mockUser.nextLevelXp) * 100} 
                        className="h-2 bg-gray-200"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    <Target className="h-4 w-4 mr-2" />
                    Set Goals
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Statistics */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Courses Enrolled"
              value={totalCoursesEnrolled}
              icon={BookOpen}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Completed Courses"
              value={completedCourses}
              icon={CheckCircle}
            />
            <StatCard
              title="Hours Learned"
              value={Math.round(totalTimeSpent / 60)}
              icon={Clock}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Achievements"
              value={unlockedAchievements}
              icon={Trophy}
            />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* In Progress Section */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
              <Button variant="ghost" asChild className="text-gray-700 hover:bg-gray-100">
                <Link href="/learn">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {coursesInProgress.map((course, index) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-black">{course.title}</h3>
                            <p className="text-sm text-gray-600">
                              by {course.instructor} • Next: {course.nextLesson}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-bold text-black">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2 bg-gray-200" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {Math.round(course.timeSpent / 60)}h of {Math.round(course.totalDuration / 60)}h
                            </span>
                            <Button 
                              size="sm" 
                              className="bg-primary text-white hover:bg-primary/90"
                              asChild
                            >
                              <Link href={`/courses/${course.id}`}>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Weekly Goal */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Target className="h-5 w-5" />
                  This Week's Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.75)}`}
                        className="text-black"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-black">75%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    5 hours completed of 7 hours goal
                  </p>
                </div>
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Update Goal
                </Button>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.filter(a => a.isUnlocked).slice(0, 4).map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      size="sm"
                    />
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-gray-700 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/achievements">
                    View All <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Achievements</h2>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="md"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}