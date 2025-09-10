"use client";

import { useState, useMemo } from "react";
import {
  Input,
  Select,
  SelectItem,
  Slider,
  Chip,
  Button,
  Pagination,
} from "@heroui/react";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/layouts/AppShell";
import { CourseCard } from "@/components/molecules/CourseCard";
import { CustomButton } from "@/components/atoms/CustomButton";
import { PageTransition, staggerContainer, staggerItem, hoverScale } from "@/components/atoms/PageTransition";
import { Course, SearchFilters } from "@/types";
import { cn, debounce } from "@/lib/utils";

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, state, and props. Perfect for beginners starting their React journey.",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 180,
    level: "beginner",
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend"],
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
    description: "Master advanced TypeScript concepts and patterns for building robust applications.",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "2",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 240,
    level: "advanced",
    category: "Programming",
    tags: ["TypeScript", "JavaScript", "Types"],
    lessons: [],
    enrollmentCount: 890,
    rating: 4.9,
    price: 49,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and experience design with practical examples.",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "3",
      name: "Emma Davis",
      email: "emma@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 200,
    level: "intermediate",
    category: "Design",
    tags: ["UI", "UX", "Design", "Figma"],
    lessons: [],
    enrollmentCount: 2100,
    rating: 4.7,
    price: 39,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "4",
      name: "Alex Rodriguez",
      email: "alex@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 320,
    level: "intermediate",
    category: "Backend Development",
    tags: ["Node.js", "Express", "MongoDB", "API"],
    lessons: [],
    enrollmentCount: 756,
    rating: 4.6,
    price: 59,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis, visualization, and machine learning.",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "5",
      name: "Dr. Lisa Wang",
      email: "lisa@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 280,
    level: "beginner",
    category: "Data Science",
    tags: ["Python", "Data Analysis", "Machine Learning", "Pandas"],
    lessons: [],
    enrollmentCount: 1890,
    rating: 4.8,
    price: 79,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native and Expo.",
    thumbnail: "/api/placeholder/400/225",
    instructor: {
      id: "6",
      name: "James Wilson",
      email: "james@example.com",
      role: "instructor",
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 360,
    level: "intermediate",
    category: "Mobile Development",
    tags: ["React Native", "Mobile", "iOS", "Android"],
    lessons: [],
    enrollmentCount: 634,
    rating: 4.5,
    price: 69,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Backend Development",
  "Data Science",
  "Design",
  "Programming",
];

const levels = ["All Levels", "beginner", "intermediate", "advanced"];

export default function LearnPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "All Categories",
    level: "All Levels",
    duration: [0, 400],
    rating: 0,
    price: [0, 100],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const itemsPerPage = 9;

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setFilters(prev => ({ ...prev, query }));
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "All Categories",
      level: "All Levels",
      duration: [0, 400],
      rating: 0,
      price: [0, 100],
    });
    setCurrentPage(1);
  };

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = mockCourses.filter(course => {
      const matchesQuery = !filters.query || 
        course.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));
      
      const matchesCategory = filters.category === "All Categories" || 
        course.category === filters.category;
      
      const matchesLevel = filters.level === "All Levels" || 
        course.level === filters.level;
      
      const matchesDuration = course.duration >= filters.duration![0] && 
        course.duration <= filters.duration![1];
      
      const matchesRating = course.rating >= filters.rating!;
      
      const matchesPrice = course.price >= filters.price![0] && 
        course.price <= filters.price![1];

      return matchesQuery && matchesCategory && matchesLevel && 
             matchesDuration && matchesRating && matchesPrice;
    });

    // Sort courses
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [mockCourses, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "query") return value && value.length > 0;
    if (key === "category") return value !== "All Categories";
    if (key === "level") return value !== "All Levels";
    if (key === "duration") return value![0] !== 0 || value![1] !== 400;
    if (key === "rating") return value! > 0;
    if (key === "price") return value![0] !== 0 || value![1] !== 100;
    return false;
  }).length;

  return (
    <PageTransition>
      <PageContainer className="h-full">
        <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 mb-6">
          <h1 className="font-manrope text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
            Explore our comprehensive library of courses designed to help you master new skills
          </p>
        </div>

        {/* Search and Filters - Fixed */}
        <div className="flex-shrink-0 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search courses, topics, or instructors..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                startContent={<Search className="h-4 w-4 text-gray-400" />}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-10",
                }}
              />
            </div>
            <Select
              placeholder="Category"
              selectedKeys={[filters.category]}
              onSelectionChange={(keys) => {
                const category = Array.from(keys)[0] as string;
                handleFilterChange("category", category);
              }}
              classNames={{
                trigger: "h-10",
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Level"
              selectedKeys={[filters.level]}
              onSelectionChange={(keys) => {
                const level = Array.from(keys)[0] as string;
                handleFilterChange("level", level);
              }}
              classNames={{
                trigger: "h-10",
              }}
            >
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </Select>
          </div>

          <CustomButton
            variant="bordered"
            leftIcon={SlidersHorizontal}
            onPress={() => setShowFilters(!showFilters)}
            className={cn(activeFiltersCount > 0 && "border-primary-500 text-primary-600")}
          >
            Advanced Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </CustomButton>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  label="Category"
                  selectedKeys={[filters.category!]}
                  onSelectionChange={(keys) => 
                    handleFilterChange("category", Array.from(keys)[0])
                  }
                >
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Level"
                  selectedKeys={[filters.level!]}
                  onSelectionChange={(keys) => 
                    handleFilterChange("level", Array.from(keys)[0])
                  }
                >
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Sort By"
                  selectedKeys={[sortBy]}
                  onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="popular" value="popular">Most Popular</SelectItem>
                  <SelectItem key="rating" value="rating">Highest Rated</SelectItem>
                  <SelectItem key="newest" value="newest">Newest</SelectItem>
                  <SelectItem key="price-low" value="price-low">Price: Low to High</SelectItem>
                  <SelectItem key="price-high" value="price-high">Price: High to Low</SelectItem>
                </Select>

                <div className="flex gap-2">
                  <CustomButton
                    variant="light"
                    size="sm"
                    onPress={clearFilters}
                    disabled={activeFiltersCount === 0}
                  >
                    Clear All
                  </CustomButton>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (minutes)
                  </label>
                  <Slider
                    step={30}
                    minValue={0}
                    maxValue={400}
                    value={filters.duration}
                    onChange={(value) => handleFilterChange("duration", value)}
                    className="max-w-md"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{filters.duration![0]}m</span>
                    <span>{filters.duration![1]}m</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Rating
                  </label>
                  <Slider
                    step={0.5}
                    minValue={0}
                    maxValue={5}
                    value={[filters.rating!]}
                    onChange={(value) => handleFilterChange("rating", value[0])}
                    className="max-w-md"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0★</span>
                    <span>{filters.rating}★</span>
                    <span>5★</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range ($)
                  </label>
                  <Slider
                    step={10}
                    minValue={0}
                    maxValue={100}
                    value={filters.price}
                    onChange={(value) => handleFilterChange("price", value)}
                    className="max-w-md"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${filters.price![0]}</span>
                    <span>${filters.price![1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300">
              {filteredCourses.length} courses found
            </p>
            {activeFiltersCount > 0 && (
              <div className="flex gap-2">
                {filters.category !== "All Categories" && (
                  <Chip
                    size="sm"
                    onClose={() => handleFilterChange("category", "All Categories")}
                  >
                    {filters.category}
                  </Chip>
                )}
                {filters.level !== "All Levels" && (
                  <Chip
                    size="sm"
                    onClose={() => handleFilterChange("level", "All Levels")}
                  >
                    {filters.level}
                  </Chip>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant={viewMode === "grid" ? "solid" : "light"}
              onPress={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              isIconOnly
              variant={viewMode === "list" ? "solid" : "light"}
              onPress={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Course Grid/List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {paginatedCourses.length > 0 ? (
              <motion.div 
                className={cn(
                  "pb-6",
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                    : "space-y-4"
                )}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence mode="wait">
                  {paginatedCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      variants={staggerItem}
                      custom={index}
                      whileHover={hoverScale.whileHover}
                      whileTap={hoverScale.whileTap}
                    >
                      <CourseCard
                        course={course}
                        variant={viewMode === "list" ? "compact" : "default"}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <CustomButton variant="bordered" onPress={clearFilters}>
                    Clear Filters
                  </CustomButton>
                </div>
              </div>
            )}
          </div>

          {/* Pagination - Fixed at bottom */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 flex justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                showShadow
                color="primary"
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  </PageTransition>
  );
}