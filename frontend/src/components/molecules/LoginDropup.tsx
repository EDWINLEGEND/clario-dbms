"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Input,
  Divider,
  Checkbox,
} from "@heroui/react";
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface LoginDropupProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export function LoginDropup({ isVisible, onClose, className }: LoginDropupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  
  const dropupRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible, onClose]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Validate form data
      if (activeTab === "register") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (!formData.agreeToTerms) {
          throw new Error("Please agree to the terms and conditions");
        }
      }
      
      // Simulate API call - replace with actual authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: activeTab === "register" ? formData.name : undefined,
          type: activeTab,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      const data = await response.json();
      
      // Store authentication token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      // Close dropup and redirect
      onClose();
      router.push(redirectTo);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setError("");
      // Redirect to social login endpoint with return URL using client-side routing
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      const returnUrl = encodeURIComponent(base + redirectTo);
      router.push(`/api/auth/${provider}?redirect=${returnUrl}`);
    } catch {
      setError('Social login failed. Please try again.');
    }
  };

  if (!isVisible) return null;

  const dropupContent = (
    <motion.div
      ref={dropupRef}
      initial={{ opacity: 0, y: 12, scale: 0.92, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, y: 8, scale: 0.95, rotateX: -5 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.2 },
        scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }}
      className={cn(
        "fixed z-50 bg-white/95 dark:bg-gray-900/95",
        "border border-gray-200/50 dark:border-gray-800/50",
        "rounded-2xl shadow-2xl backdrop-blur-xl",
        "w-96 max-w-[calc(100vw-2rem)]",
        "max-h-[calc(100vh-8rem)] overflow-y-auto",
        "ring-1 ring-black/5 dark:ring-white/10",
        className
      )}
      style={{
        transformOrigin: "top right",
        perspective: "1000px",
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {activeTab === "login" 
              ? "Sign in to continue your learning journey" 
              : "Join thousands of learners worldwide"
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-1 mb-6 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("login")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300",
              activeTab === "login"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300",
              activeTab === "register"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
            )}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {activeTab === "register" && (
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              startContent={<User className="h-4 w-4 text-gray-400" />}
              variant="bordered"
              isRequired
            />
          )}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            startContent={<Mail className="h-4 w-4 text-gray-400" />}
            variant="bordered"
            isRequired
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            type={isPasswordVisible ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            startContent={<Lock className="h-4 w-4 text-gray-400" />}
            endContent={
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="focus:outline-none"
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            }
            variant="bordered"
            isRequired
          />
          
          {activeTab === "register" && (
            <>
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                type={isPasswordVisible ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                startContent={<Lock className="h-4 w-4 text-gray-400" />}
                variant="bordered"
                isRequired
              />
              
              <Checkbox
                isSelected={formData.agreeToTerms}
                onValueChange={(checked) => handleInputChange("agreeToTerms", checked)}
                size="sm"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>
            </>
          )}
          
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            isLoading={isLoading}
          >
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </Button>
        </motion.form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <Divider className="flex-1" />
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
          <Divider className="flex-1" />
        </div>

        {/* Social Login */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button
            variant="bordered"
            size="lg"
            className="w-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 border-gray-200 dark:border-gray-700"
            startContent={<Github className="h-5 w-5" />}
            onClick={() => handleSocialLogin("github")}
          >
            Continue with GitHub
          </Button>
          
          <Button
            variant="bordered"
            size="lg"
            className="w-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 border-gray-200 dark:border-gray-700"
            startContent={<Chrome className="h-5 w-5" />}
            onClick={() => handleSocialLogin("google")}
          >
            Continue with Google
          </Button>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {activeTab === "login" ? "Don&apos;t have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              className="text-primary-600 hover:underline font-medium"
            >
              {activeTab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );

  return createPortal(dropupContent, document.body);
}