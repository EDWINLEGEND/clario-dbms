'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient, initializeCache } from '@/lib/query-client';
import { Providers } from '@/app/providers';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { RootLayoutClient } from '@/components/layouts/RootLayoutClient';
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
      <body className="bg-black text-white">
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <Providers>
              <RootLayoutClient>
                {children}
              </RootLayoutClient>
            </Providers>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
