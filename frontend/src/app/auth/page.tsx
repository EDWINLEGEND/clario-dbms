"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Tabs,
  Tab,
  Divider,
  Checkbox,
} from "@heroui/react";
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from "lucide-react";
import { CustomButton } from "@/components/atoms/CustomButton";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      
      // Redirect to intended page or dashboard
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
    } catch (err) {
      setError('Social login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <Link href="/" className="font-bold text-3xl font-manrope">
            <span className="text-primary-600 dark:text-primary-400">CLARIO</span>
          </Link>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {activeTab === "login" 
              ? "Welcome back! Sign in to continue learning."
              : "Join thousands of learners on CLARIO."
            }
          </p>
        </div>

      <Card className="w-full">
        <CardHeader className="pb-0">
          <Tabs
            fullWidth
            size="lg"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary-600",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary-600"
            }}
          >
            <Tab key="login" title="Sign In" />
            <Tab key="register" title="Sign Up" />
          </Tabs>
        </CardHeader>
        
        <CardBody className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <CustomButton
              variant="bordered"
              className="w-full"
              leftIcon={Chrome}
              onPress={() => handleSocialLogin('google')}
            >
              Continue with Google
            </CustomButton>
            <CustomButton
              variant="bordered"
              className="w-full"
              leftIcon={Github}
              onPress={() => handleSocialLogin('github')}
            >
              Continue with GitHub
            </CustomButton>
          </div>

          <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <span className="text-sm text-gray-500">or</span>
            <Divider className="flex-1" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "register" && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                startContent={<User className="h-4 w-4 text-gray-400" />}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isRequired
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-12",
                }}
              />
            )}
            
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              startContent={<Mail className="h-4 w-4 text-gray-400" />}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              isRequired
              classNames={{
                input: "text-sm",
                inputWrapper: "h-12",
              }}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              startContent={<Lock className="h-4 w-4 text-gray-400" />}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              isRequired
              classNames={{
                input: "text-sm",
                inputWrapper: "h-12",
              }}
            />
            
            {activeTab === "register" && (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                startContent={<Lock className="h-4 w-4 text-gray-400" />}
                type={isVisible ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                isRequired
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-12",
                }}
              />
            )}

            {activeTab === "login" && (
              <div className="flex justify-between items-center">
                <Checkbox size="sm">
                  Remember me
                </Checkbox>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {activeTab === "register" && (
              <Checkbox
                size="sm"
                isSelected={formData.agreeToTerms}
                onValueChange={(checked) => handleInputChange('agreeToTerms', checked)}
                isRequired
              >
                <span className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>
            )}

            <CustomButton
              type="submit"
              color="primary"
              className="w-full"
              size="lg"
              loading={isLoading}
              loadingText={activeTab === "login" ? "Signing in..." : "Creating account..."}
            >
              {activeTab === "login" ? "Sign In" : "Create Account"}
            </CustomButton>
          </form>

          {/* Footer Links */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            {activeTab === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Passwordless Login Option */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Prefer passwordless login?
        </p>
        <CustomButton
          variant="light"
          leftIcon={Mail}
          onPress={() => console.log('Send magic link')}
        >
          Send Magic Link
        </CustomButton>
      </div>
      </div>
    </div>
  );
}