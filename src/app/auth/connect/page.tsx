"use client";

// Extend Window interface for popup reference
declare global {
  interface Window {
    tiktokPopup?: Window | null;
  }
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Home-Content/Header";
import { Footer } from "@/components/Home-Content/Footer";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useTikTokAuth from "@/lib/auth/useTiktokAuth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function ConnectPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const {
    isLoading: isConnecting,
    error: tiktokError,
    initiateTikTokConnect,
  } = useTikTokAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Listen for TikTok auth success message from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("🎵 Received message:", event.data);
      // Check if message is from TikTok auth popup
      if (event.data?.type === "tiktok_auth" && event.data?.success) {
        console.log("🎵 TikTok auth successful, redirecting to dashboard");
        router.push("/dashboard");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  // Fallback: Check if popup was closed manually and redirect if needed
  useEffect(() => {
    let popupCheckInterval: NodeJS.Timeout;

    const checkPopupClosed = () => {
      // This will be set when initiateTikTokConnect is called
      if (window.tiktokPopup && window.tiktokPopup.closed) {
        console.log("🎵 TikTok popup was closed, checking auth status...");
        // You could add a check here to verify if auth was successful
        // For now, we'll just clear the reference
        window.tiktokPopup = null;
      }
    };

    // Check every 2 seconds if popup is closed
    popupCheckInterval = setInterval(checkPopupClosed, 2000);

    return () => {
      if (popupCheckInterval) {
        clearInterval(popupCheckInterval);
      }
    };
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A012A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-[#6C63FF] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A012A]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
      </section>

      {/* Connect Section */}
      <section className="py-12 relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/8 via-[#FF2E97]/8 to-[#6C63FF]/8"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <Card className="bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50 ring-0">
              <CardContent className="p-12 text-center">
                {/* TikTok Logo */}
                <div className="w-24 h-24 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg
                    className="h-12 w-12 text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-8">
                  Connect Your TikTok Channel
                </h1>

                {/* Connect Button */}
                <Button
                  onClick={initiateTikTokConnect}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-4 rounded-2xl transition-all duration-300 mb-8"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Connect with TikTok
                    </>
                  )}
                </Button>
                {tiktokError && (
                  <div className="text-red-400 text-sm mt-2">{tiktokError}</div>
                )}

                {/* Loading Bar */}
                {isConnecting && (
                  <div className="w-full bg-[#2A1A4D] rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] h-2 rounded-full animate-pulse"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                )}

                {/* Info Text */}
                <p className="text-[#C5C5D2] text-sm mb-4">
                  {isConnecting
                    ? "Please wait while we connect your TikTok account..."
                    : "Connect your TikTok account to start automating your posts"}
                </p>

                {/* Manual redirect fallback */}
                {isConnecting && (
                  <div className="text-center">
                    <p className="text-[#C5C5D2] text-xs mb-2">
                      If the popup doesn't redirect automatically:
                    </p>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="px-4 py-2 bg-[#6C63FF] hover:bg-[#5A52E6] text-white text-sm rounded-lg transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
