"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { Chrome } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      setError("");
      
      try {
        // Exchange the authorization code for tokens via our backend
        const response = await fetch('http://localhost:4000/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for refresh token
          body: JSON.stringify({
            code: codeResponse.code,
            redirectUri: `${window.location.origin}/auth`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await response.json();
        
        // Store the access token and user data in our auth context
        if (data.accessToken && data.user) {
          login(data.accessToken, data.user);
          
          // Redirect to the intended page or dashboard
          router.push(redirectTo);
        } else {
          throw new Error('Invalid response from server');
        }
        
      } catch (err) {
        console.error('Google login error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google authentication failed. Please try again.');
    },
    flow: 'auth-code',
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CLARIO</h1>
          </Link>
        </div>

        {/* Auth Card */}
        <Card className="border-2 border-black shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black">
              Welcome to Clario
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 border-2 border-red-500 bg-red-50 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              onClick={() => handleGoogleLogin()}
              disabled={isLoading}
              className="w-full h-12 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 font-medium"
            >
              <Chrome className="w-5 h-5 mr-3" />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            {/* Features */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-black mb-3">
                What you'll get:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mr-3"></div>
                  Personalized learning paths
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mr-3"></div>
                  Progress tracking and analytics
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mr-3"></div>
                  Community support and accountability
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mr-3"></div>
                  Expert-curated content
                </li>
              </ul>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-black">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-black">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/support" className="underline hover:text-black">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}