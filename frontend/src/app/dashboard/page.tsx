"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { PageContainer } from "@/components/layouts/AppShell";
import { CustomButton } from "@/components/atoms/CustomButton";
import { ProgressBar, CircularProgress } from "@/components/atoms/ProgressBar";
import { CustomAvatar } from "@/components/atoms/CustomAvatar";
import { CourseCard } from "@/components/molecules/CourseCard";
import { PageTransition, staggerContainer, staggerItem, hoverScale, tapScale } from "@/components/atoms/PageTransition";
import { User, Course, Progress as ProgressType } from "@/types";
import { cn, formatDuration, calculateProgress } from "@/lib/utils";

// Mock user data
const mockUser: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: undefined,
  role: "student",
  bio: "Full-stack developer passionate about learning new technologies",
  badges: [
    {
      id: "1",
      name: "First Course",
      description: "Completed your first course",
      icon: "🎓",
      color: "primary",
      earnedAt: new Date(),
    },
    {
      id: "2",
      name: "Week Streak",
      description: "7 days learning streak",
      icon: "🔥",
      color: "warning",
      earnedAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock progress data
const mockProgress: ProgressType[] = [
  {
    userId: "1",
    courseId: "1",
    completedLessons: ["1", "2", "3"],
    currentLesson: "4",
    progressPercentage: 60,
    timeSpent: 180,
    lastAccessed: new Date(),
  },
  {
    userId: "1",
    courseId: "2",
    completedLessons: ["1", "2"],
    currentLesson: "3",
    progressPercentage: 25,
    timeSpent: 120,
    lastAccessed: new Date(Date.now() - 86400000), // 1 day ago
  },
];

// Mock courses
const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React",
    thumbnail: "/test.jpg",
    instructor: {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 300,
    level: "beginner",
    category: "Web Development",
    tags: ["React", "JavaScript"],
    lessons: [],
    enrollmentCount: 1250,
    rating: 4.8,
    price: 0,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript concepts",
    thumbnail: "/test.jpg",
    instructor: {
      id: "2",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 480,
    level: "advanced",
    category: "Programming",
    tags: ["TypeScript", "JavaScript"],
    lessons: [],
    enrollmentCount: 890,
    rating: 4.9,
    price: 49,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock recommended courses
const recommendedCourses: Course[] = [
  {
    id: "3",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications",
    thumbnail: "/test.jpg",
    instructor: {
      id: "3",
      name: "Emma Davis",
      email: "emma@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 360,
    level: "intermediate",
    category: "Backend Development",
    tags: ["Node.js", "Express"],
    lessons: [],
    enrollmentCount: 756,
    rating: 4.6,
    price: 59,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon: Icon, color = "primary", trend }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400",
    secondary: "bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400",
    success: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
    danger: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
  };

  return (
    <motion.div
      variants={staggerItem}
      whileHover={hoverScale}
      whileTap={tapScale}
    >
      <Card>
        <CardBody className="flex flex-row items-center gap-4">
          <div className={cn("p-3 rounded-lg", colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  <TrendingUp className={cn(
                    "h-3 w-3",
                    !trend.isPositive && "rotate-180"
                  )} />
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

interface ActivityItemProps {
  type: "course_completed" | "lesson_completed" | "badge_earned" | "streak_milestone";
  title: string;
  description: string;
  timestamp: Date;
  icon?: React.ComponentType<{ className?: string }>;
}

function ActivityItem({ type, title, description, timestamp, icon: Icon }: ActivityItemProps) {
  const typeConfig = {
    course_completed: { color: "success", defaultIcon: CheckCircle },
    lesson_completed: { color: "primary", defaultIcon: Play },
    badge_earned: { color: "warning", defaultIcon: Award },
    streak_milestone: { color: "danger", defaultIcon: Flame },
  };

  const config = typeConfig[type];
  const IconComponent = Icon || config.defaultIcon;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={hoverScale}
      className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className={cn(
        "p-1.5 rounded-full flex-shrink-0",
        config.color === "success" && "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
        config.color === "primary" && "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400",
        config.color === "warning" && "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
        config.color === "danger" && "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
      )}>
        <IconComponent className="h-3 w-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-xs">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {timestamp.toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate stats
  const totalCoursesEnrolled = mockProgress.length;
  const completedCourses = mockProgress.filter(p => p.progressPercentage === 100).length;
  const totalTimeSpent = mockProgress.reduce((acc, p) => acc + p.timeSpent, 0);
  const averageProgress = mockProgress.reduce((acc, p) => acc + p.progressPercentage, 0) / mockProgress.length;
  const currentStreak = 7; // Mock streak data

  // Mock recent activity
  const recentActivity: ActivityItemProps[] = [
    {
      type: "lesson_completed",
      title: "Completed: React Components",
      description: "React Fundamentals Course",
      timestamp: new Date(),
    },
    {
      type: "badge_earned",
      title: "Earned: Week Streak Badge",
      description: "7 days of continuous learning",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      type: "course_completed",
      title: "Completed: JavaScript Basics",
      description: "Finished all lessons and quizzes",
      timestamp: new Date(Date.now() - 172800000),
    },
  ];

  return (
    <PageTransition>
      <PageContainer className="h-full">
        <div className="h-full flex flex-col">
          {/* Welcome Section - Fixed */}
          <motion.div 
            className="flex-shrink-0 mb-6"
            variants={staggerItem}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="font-manrope text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {mockUser.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Ready to continue your learning journey?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="font-bold text-lg">{currentStreak} days</span>
                  </div>
                </div>
                <CustomButton
                  color="primary"
                  variant="flat"
                  leftIcon={Calendar}
                  size="sm"
                >
                  Schedule
                </CustomButton>
                <CustomButton
                  color="primary"
                  leftIcon={Target}
                  size="sm"
                >
                  Set Goals
                </CustomButton>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Fixed */}
          <motion.div 
            className="flex-shrink-0 mb-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Courses Enrolled"
                value={totalCoursesEnrolled}
                icon={BookOpen}
                color="primary"
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Completed Courses"
                value={completedCourses}
                icon={CheckCircle}
                color="success"
              />
              <StatCard
                title="Hours Learned"
                value={Math.round(totalTimeSpent / 60)}
                icon={Clock}
                color="secondary"
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard
                title="Badges Earned"
                value={mockUser.badges.length}
                icon={Award}
                color="warning"
              />
            </div>
          </motion.div>

        {/* Main Content Tabs - Scrollable */}
        <div className="flex-1 min-h-0">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="w-full h-full flex flex-col"
          >
            <Tab key="overview" title="Overview">
              <div className="flex-1 overflow-auto">
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 pb-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                {/* Continue Learning */}
                <motion.div className="lg:col-span-2 space-y-4" variants={staggerItem}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-manrope text-lg font-bold text-gray-900 dark:text-white">
                      Continue Learning
                    </h2>
                    <CustomButton
                      as={Link}
                      href="/learn"
                      variant="light"
                      size="sm"
                      rightIcon={ArrowRight}
                    >
                      View All
                    </CustomButton>
                  </div>
                  
                  <motion.div 
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                  {mockProgress.map((progress) => {
                    const course = mockCourses.find(c => c.id === progress.courseId);
                    if (!course) return null;
                    
                    return (
                      <motion.div
                        key={progress.courseId}
                        variants={staggerItem}
                        whileHover={hoverScale}
                        whileTap={tapScale}
                      >
                        <Card className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {course.instructor.name} • {formatDuration(course.duration)}
                              </p>
                              <div className="mt-2">
                                <ProgressBar
                                  value={progress.progressPercentage}
                                  showPercentage
                                  animated
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <CustomButton
                                as={Link}
                                href={`/courses/${course.id}/lessons/${progress.currentLesson}`}
                                color="primary"
                                size="sm"
                                rightIcon={Play}
                              >
                                Continue
                              </CustomButton>
                              <p className="text-xs text-muted-foreground text-center">
                                {Math.round(progress.timeSpent / 60)}h spent
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                  </motion.div>
                </motion.div>

                {/* Sidebar */}
                <motion.div className="space-y-4" variants={staggerItem}>
                  {/* Learning Goals */}
                  <motion.div variants={staggerItem} whileHover={hoverScale}>
                    <Card className="h-fit">
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4" />
                          This Week's Goal
                        </h3>
                      </CardHeader>
                      <CardBody className="space-y-3 pt-0">
                        <div className="text-center">
                          <CircularProgress value={75} size={60} showPercentage />
                          <p className="text-xs text-muted-foreground mt-2">
                            5 hours completed of 7 hours goal
                          </p>
                        </div>
                        <CustomButton
                          color="primary"
                          variant="flat"
                          className="w-full"
                          size="sm"
                        >
                          Update Goal
                        </CustomButton>
                      </CardBody>
                    </Card>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div variants={staggerItem} whileHover={hoverScale}>
                    <Card className="h-fit">
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          Recent Activity
                        </h3>
                      </CardHeader>
                      <CardBody className="p-0 pt-0">
                        <div className="max-h-48 overflow-y-auto">
                          <motion.div 
                            className="space-y-1"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                          >
                            {recentActivity.map((activity, index) => (
                              <ActivityItem key={index} {...activity} />
                            ))}
                          </motion.div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>

                  {/* Badges */}
                  <motion.div variants={staggerItem} whileHover={hoverScale}>
                    <Card className="h-fit">
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4" />
                          Recent Badges
                        </h3>
                      </CardHeader>
                      <CardBody className="pt-0">
                        <motion.div 
                          className="grid grid-cols-2 gap-2"
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                        >
                          {mockUser.badges.map((badge) => (
                            <motion.div
                              key={badge.id}
                              variants={staggerItem}
                              whileHover={hoverScale}
                              whileTap={tapScale}
                              className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                            >
                              <div className="text-lg mb-1">{badge.icon}</div>
                              <p className="text-xs font-medium">{badge.name}</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            </Tab>

            <Tab key="recommendations" title="Recommendations">
              <div className="flex-1 overflow-auto">
                <div className="mt-4 space-y-4 pb-6">
                  <div>
                    <h2 className="font-manrope text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Recommended for You
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      Based on your learning progress and interests
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              </div>
            </Tab>

            <Tab key="achievements" title="Achievements">
              <div className="flex-1 overflow-auto">
                <div className="mt-4 space-y-4 pb-6">
                  <div>
                    <h2 className="font-manrope text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Your Achievements
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      Track your learning milestones and badges
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockUser.badges.map((badge) => (
                      <Card key={badge.id}>
                        <CardBody className="text-center space-y-3">
                          <div className="text-3xl">{badge.icon}</div>
                          <div>
                            <h3 className="font-semibold text-sm">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Earned on {badge.earnedAt?.toLocaleDateString()}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                    
                    {/* Locked badges */}
                    <Card className="opacity-60">
                      <CardBody className="text-center space-y-3">
                        <div className="text-3xl">🏆</div>
                        <div>
                          <h3 className="font-semibold text-sm">Course Master</h3>
                          <p className="text-xs text-muted-foreground">Complete 10 courses</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Progress: {completedCourses}/10
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </PageContainer>
    </PageTransition>
  );
}