"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Badge,
} from "@heroui/react";
import { Search, Clock, Code, Users, Star, ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PageContainer } from "@/components/layouts/AppShell";
import { CustomButton } from "@/components/atoms/CustomButton";
import { CustomBadge } from "@/components/atoms/CustomBadge";
import { PageTransition, staggerContainer, staggerItem, hoverScale, tapScale } from "@/components/atoms/PageTransition";
import { Project } from "@/types";
import { cn, formatDuration } from "@/lib/utils";

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Build a full-stack e-commerce platform with React, Node.js, and MongoDB. Implement user authentication, product catalog, shopping cart, and payment processing.",
    thumbnail: "/test.jpg",
    difficulty: "hard",
    estimatedTime: 2400, // 40 hours
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
    requirements: [
      "Basic knowledge of React and Node.js",
      "Understanding of REST APIs",
      "Familiarity with databases"
    ],
    deliverables: [
      "Fully functional e-commerce website",
      "Admin dashboard for product management",
      "Payment integration",
      "User authentication system",
      "Responsive design"
    ],
    category: "Web Development",
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Data Visualization Dashboard",
    description: "Create an interactive dashboard using Python, Pandas, and Plotly. Analyze real-world datasets and create compelling visualizations for business insights.",
    thumbnail: "/test.jpg",
    difficulty: "medium",
    estimatedTime: 1800, // 30 hours
    technologies: ["Python", "Pandas", "Plotly", "Dash", "SQL"],
    requirements: [
      "Python programming basics",
      "Understanding of data structures",
      "Basic SQL knowledge"
    ],
    deliverables: [
      "Interactive web dashboard",
      "Data cleaning and preprocessing scripts",
      "Multiple chart types and visualizations",
      "Filtering and drill-down capabilities",
      "Deployment guide"
    ],
    category: "Data Science",
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Mobile Fitness Tracker",
    description: "Develop a cross-platform mobile app using React Native. Track workouts, set goals, and visualize progress with charts and statistics.",
    thumbnail: "/test.jpg",
    difficulty: "medium",
    estimatedTime: 2160, // 36 hours
    technologies: ["React Native", "Expo", "Firebase", "AsyncStorage", "Charts"],
    requirements: [
      "React fundamentals",
      "Mobile development concepts",
      "Basic understanding of APIs"
    ],
    deliverables: [
      "Cross-platform mobile app",
      "User authentication",
      "Workout tracking features",
      "Progress visualization",
      "App store deployment guide"
    ],
    category: "Mobile Development",
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Design System & Component Library",
    description: "Create a comprehensive design system with reusable components, documentation, and style guide. Perfect for designers and frontend developers.",
    thumbnail: "/test.jpg",
    difficulty: "easy",
    estimatedTime: 1200, // 20 hours
    technologies: ["Figma", "React", "Storybook", "CSS", "TypeScript"],
    requirements: [
      "Basic design principles",
      "HTML/CSS knowledge",
      "Figma familiarity"
    ],
    deliverables: [
      "Complete design system in Figma",
      "React component library",
      "Storybook documentation",
      "Style guide and usage examples",
      "NPM package setup"
    ],
    category: "Design",
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "5",
    title: "DevOps CI/CD Pipeline",
    description: "Set up a complete CI/CD pipeline using Docker, Jenkins, and AWS. Deploy applications automatically with testing, security scanning, and monitoring.",
    thumbnail: "/test.jpg",
    difficulty: "hard",
    estimatedTime: 2880, // 48 hours
    technologies: ["Docker", "Jenkins", "AWS", "Kubernetes", "Terraform"],
    requirements: [
      "Linux command line basics",
      "Understanding of containerization",
      "Basic cloud concepts"
    ],
    deliverables: [
      "Automated CI/CD pipeline",
      "Dockerized applications",
      "Infrastructure as code",
      "Monitoring and alerting setup",
      "Security scanning integration"
    ],
    category: "DevOps",
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: "6",
    title: "Machine Learning Recommendation System",
    description: "Build a recommendation engine using collaborative filtering and content-based algorithms. Implement with Python, scikit-learn, and deploy with Flask.",
    thumbnail: "/test.jpg",
    difficulty: "hard",
    estimatedTime: 3000, // 50 hours
    technologies: ["Python", "scikit-learn", "Pandas", "Flask", "NumPy"],
    requirements: [
      "Python programming",
      "Basic statistics knowledge",
      "Understanding of machine learning concepts"
    ],
    deliverables: [
      "Trained recommendation models",
      "Web API for recommendations",
      "Data preprocessing pipeline",
      "Model evaluation metrics",
      "Deployment documentation"
    ],
    category: "Machine Learning",
    isPublished: true,
    createdAt: new Date(),
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Design",
  "DevOps",
];

const difficulties = ["All Levels", "easy", "medium", "hard"];

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const difficultyColors = {
    easy: "success" as const,
    medium: "warning" as const,
    hard: "danger" as const,
  };

  const difficultyLabels = {
    easy: "Beginner",
    medium: "Intermediate",
    hard: "Advanced",
  };

  const router = useRouter();
  const handleCardClick = () => router.push(`/projects/${project.id}`);

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg h-full"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/projects/${project.id}`);
        }
      }}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Difficulty badge */}
          <div className="absolute top-3 left-3">
            <CustomBadge
              color={difficultyColors[project.difficulty]}
              variant="solid"
              size="sm"
            >
              {difficultyLabels[project.difficulty]}
            </CustomBadge>
          </div>
          
          {/* Duration badge */}
          <div className="absolute top-3 right-3">
            <CustomBadge
              color="default"
              variant="solid"
              size="sm"
              className="bg-black/70 text-white"
              icon={Clock}
            >
              {formatDuration(project.estimatedTime)}
            </CustomBadge>
          </div>
          
          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <Chip
              color="primary"
              variant="flat"
              size="sm"
              className="bg-white/90 text-primary-700"
            >
              {project.category}
            </Chip>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Project title */}
        <h3 className="font-manrope text-xl font-bold line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        
        {/* Project description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>
        
        {/* Technologies */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Technologies:
          </p>
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <Chip
                key={tech}
                size="sm"
                variant="flat"
                color="secondary"
                className="text-xs"
              >
                {tech}
              </Chip>
            ))}
            {project.technologies.length > 4 && (
              <Chip
                size="sm"
                variant="flat"
                color="default"
                className="text-xs"
              >
                +{project.technologies.length - 4}
              </Chip>
            )}
          </div>
        </div>
        
        {/* Key deliverables */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Key Deliverables:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {project.deliverables.slice(0, 2).map((deliverable, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span className="line-clamp-1">{deliverable}</span>
              </li>
            ))}
            {project.deliverables.length > 2 && (
              <li className="text-xs text-muted-foreground">
                +{project.deliverables.length - 2} more deliverables
              </li>
            )}
          </ul>
        </div>
      </CardBody>

      <CardFooter className="flex items-center justify-between pt-0">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>{project.technologies.length} techs</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.7</span>
          </div>
        </div>
        
        {/* CTA */}
        <CustomButton
          as={Link}
          href={`/projects/${project.id}`}
          color="primary"
          variant="flat"
          size="sm"
          rightIcon={ArrowRight}
          onClick={(e) => e.stopPropagation()}
        >
          Start Project
        </CustomButton>
      </CardFooter>
    </Card>
  );
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popular");

  // Filter projects based on search and filters
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All Categories" || 
      project.category === selectedCategory;
    
    const matchesDifficulty = selectedDifficulty === "All Levels" || 
      project.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "duration-short":
        return a.estimatedTime - b.estimatedTime;
      case "duration-long":
        return b.estimatedTime - a.estimatedTime;
      case "difficulty-easy":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "difficulty-hard":
        const reverseDifficultyOrder = { easy: 3, medium: 2, hard: 1 };
        return reverseDifficultyOrder[a.difficulty] - reverseDifficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  return (
    <PageTransition>
      <PageContainer className="h-full">
        <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 mb-6">
          <h1 className="font-manrope text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hands-on Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
            Build real-world projects to showcase your skills and create an impressive portfolio
          </p>
        </div>

        {/* Search and Filters - Fixed */}
        <div className="flex-shrink-0 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search projects or technologies..."
                startContent={<Search className="h-4 w-4 text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                classNames={{
                  inputWrapper: "h-12",
                }}
              />
            </div>
            
            <Select
              label="Category"
              selectedKeys={new Set([selectedCategory])}
               onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
            >
              {categories.map((category) => (
                <SelectItem key={category}>
                   {category}
                 </SelectItem>
              ))}
            </Select>
            
            <Select
              label="Difficulty"
              selectedKeys={new Set([selectedDifficulty])}
               onSelectionChange={(keys) => setSelectedDifficulty(Array.from(keys)[0] as string)}
            >
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty}>
                   {difficulty === "All Levels" ? difficulty : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                 </SelectItem>
              ))}
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              {filteredProjects.length} projects found
            </p>
            
            <Select
              label="Sort by"
              selectedKeys={new Set([sortBy])}
              onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="popular">Most Popular</SelectItem>
              <SelectItem key="newest">Newest</SelectItem>
              <SelectItem key="duration-short">Shortest First</SelectItem>
              <SelectItem key="duration-long">Longest First</SelectItem>
              <SelectItem key="difficulty-easy">Easiest First</SelectItem>
              <SelectItem key="difficulty-hard">Hardest First</SelectItem>
            </Select>
          </div>
        </div>

        {/* Projects Grid - Scrollable */}
         <div className="flex-1 overflow-y-auto">
           {filteredProjects.length > 0 ? (
             <motion.div 
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-6"
               variants={staggerContainer}
               initial="initial"
               animate="in"
             >
               <AnimatePresence mode="wait">
                 {filteredProjects.map((project, index) => (
                   <motion.div
                     key={project.id}
                     variants={staggerItem}
                     custom={index}
                     whileHover={hoverScale}
                     whileTap={tapScale}
                   >
                     <ProjectCard project={project} />
                   </motion.div>
                 ))}
               </AnimatePresence>
             </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <CustomButton
                variant="bordered"
                onPress={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setSelectedDifficulty("All Levels");
                }}
              >
                Clear Filters
              </CustomButton>
            </div>
          )}
        </div>

        {/* CTA Section - Fixed at bottom */}
        <div className="flex-shrink-0 mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 lg:p-8 text-center">
          <h2 className="font-manrope text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm lg:text-base">
            Join our community of builders and showcase your projects to potential employers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomButton
              color="primary"
              rightIcon={Github}
              onPress={() => console.log('Connect GitHub')}
              size="md"
            >
              Connect GitHub
            </CustomButton>
            <CustomButton
              variant="bordered"
              rightIcon={ExternalLink}
              onPress={() => console.log('Submit project')}
              size="md"
            >
              Submit Your Project
            </CustomButton>
          </div>
        </div>
       </div>
     </PageContainer>
   </PageTransition>
   );
}