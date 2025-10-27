"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TikTokCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  // Check if we're in a popup window
  const isPopup =
    typeof window !== "undefined" && window.opener && window.opener !== window;

  useEffect(() => {
    // Get search params from URL directly to avoid Suspense issues
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code) {
      setStatus("error");
      setError("Missing TikTok authorization code.");
      return;
    }
    // Call backend to complete TikTok OAuth
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setStatus("error");
      setError("You must be logged in to complete TikTok authentication.");
      return;
    }

    fetch("https://backend.postsiva.com/tiktok/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, state }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "TikTok authentication failed.");
        }
        const data = await res.json();
        console.log("✅ TikTok authentication successful:", data);
        setStatus("success");

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
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || "TikTok authentication failed.");

        // If we're in a popup and there's an error, still try to redirect parent
        if (isPopup && window.opener) {
          setTimeout(() => {
            window.opener.location.href = "/dashboard";
            window.close();
          }, 3000);
        }
      });
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A012A] text-white">
      {status === "loading" && (
        <>
          <div className="mb-4 animate-spin border-4 border-[#6C63FF] border-t-transparent rounded-full w-12 h-12"></div>
          <p>Completing TikTok authentication...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="text-2xl font-bold mb-2 text-green-400">
            TikTok Connected Successfully!
          </h2>
          <p className="text-gray-300 mb-4">
            Your TikTok account has been linked to your profile.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <div className="animate-spin border-2 border-green-400 border-t-transparent rounded-full w-4 h-4"></div>
            <span>
              {isPopup
                ? "Closing popup and redirecting..."
                : "Redirecting to dashboard..."}
            </span>
          </div>
          <button
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            onClick={() => {
              if (isPopup && window.opener) {
                window.opener.location.href = "/dashboard";
                window.close();
              } else {
                router.push("/dashboard");
              }
            }}
          >
            {isPopup ? "Close & Go to Dashboard" : "Go to Dashboard Now"}
          </button>
        </>
      )}
      {status === "error" && (
        <>
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
        </>
      )}
    </div>
  );
}
