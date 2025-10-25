"use client";

import React, { ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthGuard({
  children,
  fallback = null,
  redirectTo = "/auth/login",
  requireAuth = true,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // If user is authenticated but this route requires no auth (like login page)
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A012A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF] mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  // If no authentication is required but user is authenticated (redirect case)
  if (!requireAuth && isAuthenticated) {
    return fallback;
  }

  // Render children if authentication state matches requirements
  return <>{children}</>;
}

// Higher-order component version for easier use
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, "children"> = {}
) {
  return function WrappedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Specific guard components for common use cases
export function ProtectedRoute({ children }: { children: ReactNode }) {
  return <AuthGuard requireAuth={true}>{children}</AuthGuard>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}
