"use client";

import { PublicRoute } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useGoogleAuth } from "@/lib/auth";

export default function PublicExamplePage() {
  const { initiateGoogleLogin } = useGoogleAuth();

  return (
    <PublicRoute>
      <div className="min-h-screen bg-[#0A012A] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Public Page Example
          </h1>

          <div className="bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              This is a Public Page
            </h2>
            <p className="text-[#C5C5D2] mb-4">
              This page is accessible to everyone, but authenticated users will
              be redirected to the home page.
            </p>
            <p className="text-[#C5C5D2]">
              This is typically used for login, signup, or landing pages.
            </p>
          </div>

          <Button
            onClick={initiateGoogleLogin}
            className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
          >
            Login with Google
          </Button>
        </div>
      </div>
    </PublicRoute>
  );
}