"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Type for TikTok API response
interface TikTokCallbackResponse {
  success: boolean;
  message?: string;
  data?: {
    user_id?: string;
    access_token?: string;
    [key: string]: unknown;
  };
}

export default function TikTokCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (!code) {
          setStatus("error");
          setError("Missing TikTok authorization code.");
          return;
        }

        // Get auth token
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setStatus("error");
          setError("You must be logged in to complete TikTok authentication.");
          return;
        }

        // Call backend API
        const response = await fetch(
          "https://backend.postsiva.com/tiktok/callback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code, state }),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({})) as Partial<TikTokCallbackResponse>;
          throw new Error(data.message || "TikTok authentication failed.");
        }

        const data = await response.json() as TikTokCallbackResponse;
        console.log("✅ TikTok authentication successful:", data);
        setStatus("success");

        // Check if we're in a popup window
        const isPopup = window.opener && window.opener !== window;

        if (isPopup) {
          // If we're in a popup, close it and redirect the parent window
          setTimeout(() => {
            if (window.opener) {
              window.opener.location.href = "/dashboard";
              window.close();
            } else {
              router.push("/dashboard");
            }
          }, 2000);
        } else {
          // If we're not in a popup, redirect normally
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } catch (err: unknown) {
        setStatus("error");
        const errorMessage = err instanceof Error ? err.message : "TikTok authentication failed.";
        setError(errorMessage);
      }
    };

    handleCallback();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A012A] text-white">
        <div className="mb-4 animate-spin border-4 border-[#6C63FF] border-t-transparent rounded-full w-12 h-12"></div>
        <p>Completing TikTok authentication...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A012A] text-white">
        <div className="mb-4 text-6xl">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-green-400">
          TikTok Connected Successfully!
        </h2>
        <p className="text-gray-300 mb-4">
          Your TikTok account has been linked to your profile.
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <div className="animate-spin border-2 border-green-400 border-t-transparent rounded-full w-4 h-4"></div>
          <span>Redirecting to dashboard...</span>
        </div>
        <button
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A012A] text-white">
      <div className="mb-4 text-6xl">❌</div>
      <h2 className="text-2xl font-bold mb-2 text-red-400">
        TikTok Connection Failed
      </h2>
      <p className="text-gray-300 mb-4 max-w-md text-center">{error}</p>
      <div className="flex space-x-3">
        <button
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <button
          className="px-6 py-2 bg-[#6C63FF] hover:bg-[#5A52E6] rounded-lg text-white font-medium transition-colors"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
