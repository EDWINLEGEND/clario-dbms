// src/app/login/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, Loader2, Sparkles } from "lucide-react";
import { useGlaze } from "@/hooks/useGlaze";
import { useAnimationVariants } from "@/hooks/useReducedMotion";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Animation variants for the login card
const cardVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5,
    }
  },
};

// Animation variants for the floating background elements
const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ref: glazeRef } = useGlaze({ enableMouseTracking: true });
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Respect user's reduced motion preference
  const animatedCardVariants = useAnimationVariants(cardVariants);

  const handleGoogleLogin = async (codeResponse: any) => {
    setIsLoading(true);
    console.log('🔍 OAuth Response:', codeResponse);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Expected redirect_uri:', 'postmessage');
    try {
      const requestBody = {
        code: codeResponse.code,
        redirectUri: 'postmessage', // Must match the redirect_uri used in useGoogleLogin
      };
      console.log('🔍 Sending to backend:', requestBody);
      
      const response = await fetch('http://localhost:4000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('🔍 Backend error:', errorData);
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      
      if (data.accessToken && data.user) {
        // Store token and user data in AuthContext
        login(data.accessToken, data.user);
        
        // Show success toast
        toast({
          title: "Welcome back!",
          description: `Successfully signed in as ${data.user.name}`,
          variant: "default",
        });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in with Google. Please try again.";
      setError(errorMessage);
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: (error) => {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
      toast({
        title: "Authentication Error",
        description: "Google authentication failed. Please try again.",
        variant: "destructive",
      });
    },
    flow: 'auth-code',
    redirect_uri: 'postmessage', // For auth-code flow with popup, use 'postmessage'
  });

  const handleSignUpClick = () => {
    // TODO: Navigate to sign up page or show sign up modal
    toast({
      title: "Coming Soon",
      description: "Sign up functionality will be available soon.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      
      {/* Login Card */}
      <motion.div
        variants={animatedCardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <Card 
          ref={glazeRef}
          className="border-white/10 bg-black interactive-glow btn-glaze-hover backdrop-blur-xl"
        >
          <CardHeader className="text-center space-y-4">
            {/* Logo/Icon */}
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2 
              }}
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-white">
                Welcome to Clario
              </CardTitle>
              <CardDescription className="text-white/70 text-base">
                Sign in with your Google account to start your learning journey.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Google Sign In Button */}
            <Button
              onClick={() => {
                setError(null);
                googleLogin();
              }}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 interactive-glow"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Chrome className="h-5 w-5 mr-2" />
                  Sign in with Google
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-white/60">
                  Secure authentication
                </span>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                <span>Access personalized learning content</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                <span>Track your progress and achievements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                <span>Save and resume your courses</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center">
              <p className="text-sm text-white/60">
                Don't have an account?{" "}
                <span 
                  className="font-bold underline cursor-pointer hover:text-white transition-colors interactive-glow"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </span>
              </p>
            </div>

            <div className="text-center text-xs text-white/40">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
