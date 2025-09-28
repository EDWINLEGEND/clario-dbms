"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, Headphones, Hand, Loader2 } from "lucide-react";

interface LearningStyleOption {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface LearningStyleQuestionnaireProps {
  open: boolean;
  onComplete: (learningStyleId: number) => Promise<void>;
}

const learningStyleOptions: LearningStyleOption[] = [
  {
    id: "visual",
    value: "1", // Changed to numeric ID
    label: "Visual Learner",
    description: "Watch diagrams and visual explanations",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    id: "auditory",
    value: "2", // Changed to numeric ID
    label: "Auditory Learner",
    description: "Listen to in-depth conceptual explanations",
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    id: "kinesthetic",
    value: "3", // Changed to numeric ID
    label: "Kinesthetic Learner", 
    description: "Follow along with a practical, hands-on project",
    icon: <Hand className="h-5 w-5" />,
  },
];

export function LearningStyleQuestionnaire({
  open,
  onComplete,
}: LearningStyleQuestionnaireProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedStyle) return;

    setIsLoading(true);
    try {
      await onComplete(parseInt(selectedStyle)); // Convert to number
    } catch (error) {
      console.error("Failed to save learning style:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} modal={true}>
      <DialogContent 
        className="sm:max-w-[500px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">
            What's Your Learning Style?
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Help us personalize your learning experience by telling us how you prefer to learn new technical skills.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">
              When learning a new technical skill, you prefer to:
            </Label>
            
            <div className="space-y-3">
              {learningStyleOptions.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400",
                    selectedStyle === option.value
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-black hover:border-gray-400"
                  )}
                  onClick={() => setSelectedStyle(option.value)}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      id={option.id}
                      name="learningStyle"
                      value={option.value}
                      checked={selectedStyle === option.value}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className={cn(
                        "h-4 w-4 border-2 focus:ring-2 focus:ring-black focus:ring-offset-2",
                        selectedStyle === option.value
                          ? "text-white bg-white border-white"
                          : "text-black bg-white border-gray-400"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "transition-colors",
                        selectedStyle === option.value ? "text-white" : "text-black"
                      )}>
                        {option.icon}
                      </div>
                      <Label
                        htmlFor={option.id}
                        className={cn(
                          "font-medium cursor-pointer transition-colors",
                          selectedStyle === option.value ? "text-white" : "text-black"
                        )}
                      >
                        {option.label}
                      </Label>
                    </div>
                    <p className={cn(
                      "text-sm mt-1 transition-colors",
                      selectedStyle === option.value ? "text-gray-200" : "text-gray-600"
                    )}>
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!selectedStyle || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}