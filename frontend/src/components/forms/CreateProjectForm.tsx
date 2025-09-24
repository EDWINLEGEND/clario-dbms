"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface CreateProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface ProjectFormData {
  title: string;
  description: string;
  deadline: string;
}

export function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    deadline: "",
  });

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return "Project title is required";
    }
    if (formData.title.trim().length < 3) {
      return "Project title must be at least 3 characters long";
    }
    if (!formData.description.trim()) {
      return "Project description is required";
    }
    if (formData.description.trim().length < 10) {
      return "Project description must be at least 10 characters long";
    }
    if (!formData.deadline) {
      return "Project deadline is required";
    }
    
    // Validate deadline is in the future
    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate <= today) {
      return "Deadline must be in the future";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          deadline: formData.deadline,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }
      
      // Success - call the success callback
      onSuccess();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Project Title *
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter your project title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="border-gray-300 focus:border-black focus:ring-black"
          disabled={isLoading}
          maxLength={100}
        />
        <p className="text-xs text-gray-500">
          {formData.title.length}/100 characters
        </p>
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description *
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your project goals, requirements, and expected outcomes"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="border-gray-300 focus:border-black focus:ring-black min-h-[100px] resize-none"
          disabled={isLoading}
          maxLength={500}
        />
        <p className="text-xs text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Project Deadline */}
      <div className="space-y-2">
        <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
          Deadline *
        </Label>
        <Input
          id="deadline"
          type="date"
          value={formData.deadline}
          onChange={(e) => handleInputChange("deadline", e.target.value)}
          className="border-gray-300 focus:border-black focus:ring-black"
          disabled={isLoading}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
}