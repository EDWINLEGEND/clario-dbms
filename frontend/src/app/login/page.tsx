// src/app/login/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, Loader2 } from "lucide-react";
import { useGlaze } from "@/hooks/useGlaze";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { applyGlaze } = useGlaze();
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        // Exchange authorization code for access token via backend
        const response = await fetch('http://localhost:4000/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: codeResponse.code,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
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
        toast({
          title: "Authentication Failed",
          description: error instanceof Error ? error.message : "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      toast({
        title: "Authentication Error",
        description: "Google authentication failed. Please try again.",
        variant: "destructive",
      });
    },
    flow: 'auth-code',
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in with your Google account to access your dashboard.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className={`w-full btn-glaze-hover ${applyGlaze('button', 'bg-white hover:bg-gray-50 text-black border border-gray-300')}`}
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
        </CardContent>
        
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <span 
              className="font-bold underline cursor-pointer hover:text-foreground transition-colors"
              onClick={handleSignUpClick}
            >
              Sign Up
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}