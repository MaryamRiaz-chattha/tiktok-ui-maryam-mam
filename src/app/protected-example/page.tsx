"use client";

import { ProtectedRoute } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/lib/auth";

export default function ProtectedExamplePage() {
  const { user, logout } = useAuthContext();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0A012A] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Protected Page Example
          </h1>

          <div className="bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Welcome to Protected Content!
            </h2>
            <p className="text-[#C5C5D2] mb-4">
              This page is only accessible to authenticated users.
            </p>
            {user && (
              <div className="text-[#C5C5D2]">
                <p>
                  <strong>User:</strong> {user.email}
                </p>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Full Name:</strong> {user.full_name}
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
    </ProtectedRoute>
  );
}
