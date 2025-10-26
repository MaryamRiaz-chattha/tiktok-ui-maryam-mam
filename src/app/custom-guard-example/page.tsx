"use client";

import { AuthGuard } from "@/lib/auth";
import { useAuthContext } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function CustomGuardExamplePage() {
  const { user, logout } = useAuthContext();

  return (
    <AuthGuard
      requireAuth={true}
      redirectTo="/auth/login"
      fallback={
        <div className="min-h-screen bg-[#0A012A] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Access Denied
            </h1>
            <p className="text-[#C5C5D2] mb-6">
              You need to be authenticated to access this page.
            </p>
            <Button
              onClick={() => (window.location.href = "/auth/login")}
              className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
            >
              Go to Login
            </Button>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-[#0A012A] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Custom Guard Example
          </h1>

          <div className="bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Custom AuthGuard Usage
            </h2>
            <p className="text-[#C5C5D2] mb-4">
              This page uses AuthGuard with custom options:
            </p>
            <ul className="text-[#C5C5D2] mb-4 list-disc list-inside">
              <li>Custom redirect path</li>
              <li>Custom fallback component</li>
              <li>Requires authentication</li>
            </ul>
            {user && (
              <div className="text-[#C5C5D2]">
                <p>
                  <strong>User:</strong> {user.email}
                </p>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={() => logout()}
            className="bg-gradient-to-r from-[#FF2E97] to-[#FF2E97] hover:from-[#E61E87] hover:to-[#E61E87] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
          >
            Logout
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
