"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Loader2, FolderOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CreateProjectForm } from "@/components/forms/CreateProjectForm";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { MainLayout } from "@/components/layouts/MainLayout";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: "active" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Use React Query hook for data fetching
  const { 
    data: projects = [], 
    isLoading, 
    error, 
    refetch: fetchProjects 
  } = useProjects();

  // Filter and sort projects based on search query and sort option
  const filteredAndSortedProjects = projects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "status":
          const statusOrder = { active: 3, "on-hold": 2, completed: 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Handle successful project creation
  const handleProjectCreated = () => {
    setIsCreateDialogOpen(false);
    fetchProjects(); // Refresh the project list
  };

  // Loading skeleton component
  const ProjectSkeleton = () => (
    <Card className="bg-black border-white/10">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-48 w-full bg-white/20" />
        <Skeleton className="h-6 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-2/3 bg-white/20" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-white/20" />
          <Skeleton className="h-6 w-20 bg-white/20" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-24 bg-white/20" />
          <Skeleton className="h-10 w-32 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );

  // Empty state component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="flex justify-center mb-6">
        <FolderOpen className="h-24 w-24 text-white/40" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">
        You haven't started any projects yet
      </h3>
      <p className="text-white/60 mb-8 max-w-md mx-auto">
        Create your first project to start building something amazing. Track your progress, set milestones, and bring your ideas to life.
      </p>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="bg-white text-black hover:bg-white/90">
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <CreateProjectForm
            onSuccess={handleProjectCreated}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-black">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                My Projects
              </h1>
              <p className="text-white/80">
                Manage and track your development projects
              </p>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white"
                />
              </div>
              
              {/* Sort By Select */}
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-black border-white/20 text-white focus:border-white focus:ring-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="newest" className="text-white hover:bg-white/10 focus:bg-white/10">
                      Newest First
                    </SelectItem>
                    <SelectItem value="oldest" className="text-white hover:bg-white/10 focus:bg-white/10">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="priority" className="text-white hover:bg-white/10 focus:bg-white/10">
                      By Priority
                    </SelectItem>
                    <SelectItem value="status" className="text-white hover:bg-white/10 focus:bg-white/10">
                      By Status
                    </SelectItem>
                    <SelectItem value="alphabetical" className="text-white hover:bg-white/10 focus:bg-white/10">
                      Alphabetical
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-white/90 transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <CreateProjectForm
                    onSuccess={handleProjectCreated}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 mb-4">{error.message || String(error)}</p>
                <Button
                  onClick={() => fetchProjects()}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProjectSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* Projects Grid */}
                {filteredAndSortedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-12">
                    {searchTerm ? (
                      /* No Search Results */
                      <div className="max-w-md mx-auto">
                        <Search className="mx-auto h-12 w-12 text-white/40 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          No projects found
                        </h3>
                        <p className="text-white/60 mb-6">
                          We couldn't find any projects matching "{searchTerm}". Try adjusting your search terms.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={() => setSearchTerm("")}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Clear Search
                          </Button>
                          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="bg-white text-black hover:bg-white/90">
                                Create New Project
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                             <DialogHeader>
                               <DialogTitle>Create New Project</DialogTitle>
                             </DialogHeader>
                             <CreateProjectForm
                               onSuccess={handleProjectCreated}
                               onCancel={() => setIsCreateDialogOpen(false)}
                             />
                           </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ) : (
                      /* No Projects */
                      <EmptyState />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
      </div>
    </MainLayout>
  );
}