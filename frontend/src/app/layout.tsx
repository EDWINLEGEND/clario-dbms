'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient, initializeCache } from '@/lib/query-client';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize cache on app start
  useEffect(() => {
    initializeCache();
  }, []);

  return (
    <html lang="en" className="dark">
      <body>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              {children}
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
