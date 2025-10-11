"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Sparkles,
  Settings,
  User,
  Bell,
  Trash2,
  Save
} from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { AchievementBadge } from "@/components/cards/AchievementBadge";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/api";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { VideoHistory, VideoHistoryResponse } from "@/types";

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

// Mock courses in progress (fallback data)
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
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [profileName, setProfileName] = useState(mockUser.name);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailReminders, setEmailReminders] = useState(true);
  const [whatsappReminders, setWhatsappReminders] = useState(false);
  
  const { accessToken } = useAuth();
  const apiClient = new ApiClient();

  // Fetch video history on component mount
  useEffect(() => {
    const fetchVideoHistory = async () => {
      if (!accessToken) {
        setIsLoadingHistory(false);
        return;
      }

      try {
        const response = await apiClient.get<VideoHistoryResponse>('/history?status=IN_PROGRESS&limit=10', accessToken);
        const historyData: VideoHistory[] = response.data || [];
        setVideoHistory(historyData);
      } catch (error) {
        const err = error as Error;
        console.error('Failed to fetch video history:', err.message);
        // Use fallback data on error
        setVideoHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchVideoHistory();
  }, [accessToken]);

  // Calculate stats (updated to use real video history when available)
  const totalCoursesEnrolled = videoHistory.length > 0 ? videoHistory.length : coursesInProgress.length;
  const completedCourses = videoHistory.filter(h => h.percentWatched >= 100).length || 1; // Mock fallback
  const totalTimeSpent = videoHistory.length > 0 
    ? videoHistory.reduce((acc, history) => {
        const duration = history.video.duration || 300; // Default 5 minutes
        return acc + (duration * (history.percentWatched / 100));
      }, 0)
    : coursesInProgress.reduce((acc, course) => acc + course.timeSpent, 0);
  const averageProgress = videoHistory.length > 0
    ? videoHistory.reduce((acc, history) => acc + history.percentWatched, 0) / videoHistory.length
    : coursesInProgress.reduce((acc, course) => acc + course.progress, 0) / coursesInProgress.length;
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  const handleProfileUpdate = () => {
    // Mock API call - would be a PATCH request to backend
    console.log("Updating profile:", { name: profileName });
    // Show success message or handle error
  };

  const handleDeleteAccount = () => {
    // Mock API call - would be a DELETE request to backend
    console.log("Deleting account");
    // Redirect to login or show confirmation
  };

  return (
    <div className="min-h-screen bg-black">
      <motion.div
        className="max-w-7xl mx-auto p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* User Profile Header */}
        <motion.div variants={itemVariants}>
          <Card className="border-white/10 bg-black interactive-glow">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 border-4 border-white/20">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="bg-white/10 text-white text-2xl font-bold">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">
                      Welcome back, {mockUser.name.split(' ')[0]}!
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="text-lg font-bold text-white">
                          🔥 {mockUser.streak} Day Streak
                        </span>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-white font-bold">
                        Level {mockUser.level}
                      </Badge>
                    </div>
                    
                    {/* XP Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">XP Progress</span>
                        <span className="font-bold text-white">
                          {mockUser.xp}/{mockUser.nextLevelXp}
                        </span>
                      </div>
                      <Progress 
                        value={(mockUser.xp / mockUser.nextLevelXp) * 100} 
                        className="h-2 bg-white/20"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button className="bg-white text-black hover:bg-white/90">
                    <Target className="h-4 w-4 mr-2" />
                    Set Goals
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabbed Content */}
        <motion.div variants={itemVariants}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8 mt-8">
              {/* Key Statistics */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
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
                    {isLoadingHistory ? (
                      // Loading skeleton
                      Array.from({ length: 3 }).map((_, index) => (
                        <motion.div
                          key={`skeleton-${index}`}
                          variants={itemVariants}
                        >
                          <Card className="border-2 border-gray-200">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                  <div className="space-y-2">
                                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                                      <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded animate-pulse" />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : videoHistory.length > 0 ? (
                      // Real video history data
                      videoHistory.map((history, index) => (
                        <motion.div
                          key={history.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-6">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                                  <img
                                    src={history.video.thumbnailUrl || "/test.jpg"}
                                    alt={history.video.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Play className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h3 className="text-lg font-bold text-black">{history.video.title}</h3>
                                    <p className="text-sm text-gray-600">
                                      Last watched: {new Date(history.updatedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Progress</span>
                                      <span className="font-bold text-black">{Math.round(history.percentWatched)}%</span>
                                    </div>
                                    <Progress value={history.percentWatched} className="h-2 bg-gray-200" />
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {history.video.duration ? `${Math.round(history.video.duration / 60)} min video` : 'Duration unknown'}
                                    </span>
                                    <Button 
                                      size="sm" 
                                      className="bg-primary text-white hover:bg-primary/90"
                                      asChild
                                    >
                                      <Link href={`/learn/${history.videoId}`}>
                                        <Play className="h-4 w-4 mr-2" />
                                        {history.percentWatched >= 100 ? 'Rewatch' : 'Continue'}
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      // Fallback to mock data when no video history
                      coursesInProgress.map((course, index) => (
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
                      ))
                    )}
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
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8 mt-8">
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Profile Information
                      </h2>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                        <Avatar className="w-32 h-32 border-4 border-black">
                          <AvatarImage src={mockUser.avatar} />
                          <AvatarFallback className="bg-black text-white text-4xl font-bold">
                            {mockUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-4 flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                {mockUser.name}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Email</Label>
                              <p className="text-lg text-gray-900 dark:text-white mt-1">
                                {mockUser.email}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Level</Label>
                              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                Level {mockUser.level}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Streak</Label>
                              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                🔥 {mockUser.streak} Days
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements Section */}
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Achievements
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            variants={itemVariants}
                            custom={index}
                          >
                            <AchievementBadge achievement={achievement} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8 mt-8">
              {/* Update Profile Form */}
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Update Profile
                      </h2>
                      
                      <div className="space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="profile-name" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="profile-name"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        
                        <Button 
                          onClick={handleProfileUpdate}
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notification Settings */}
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Notification Preferences
                      </h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4 text-gray-600" />
                              <Label className="text-base font-medium">Email Reminders</Label>
                            </div>
                            <p className="text-sm text-gray-600">
                              Receive email notifications about course updates and deadlines
                            </p>
                          </div>
                          <Switch
                            checked={emailReminders}
                            onCheckedChange={setEmailReminders}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4 text-gray-600" />
                              <Label className="text-base font-medium">WhatsApp Reminders</Label>
                            </div>
                            <p className="text-sm text-gray-600">
                              Get WhatsApp notifications for important updates
                            </p>
                          </div>
                          <Switch
                            checked={whatsappReminders}
                            onCheckedChange={setWhatsappReminders}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Account Management - Danger Zone */}
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-red-900">
                        Account Management
                      </h2>
                      
                      <div className="space-y-4">
                        <p className="text-red-700">
                          Danger Zone: These actions cannot be undone.
                        </p>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove all your data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAccount}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, delete my account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}