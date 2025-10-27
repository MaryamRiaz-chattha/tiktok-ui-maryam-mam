"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (!code) {
          setStatus("error");
          setError("Missing TikTok authorization code.");
          return;
        }

        const token = localStorage.getItem("auth_token");
        if (!token) {
          setStatus("error");
          setError("You must be logged in to complete TikTok authentication.");
          return;
        }

        // NOTE: use try/catch around fetch network errors
        const response = await fetch(
          "https://backend.postsiva.com/tiktok/callback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code, state }),
            // credentials: 'include' // enable if backend uses cookies
          }
        );

        // Read body once (text then try parse) to avoid double consumption
        const text = await response.text();
        let parsed: Partial<TikTokCallbackResponse> = {};
        try {
          parsed = text ? JSON.parse(text) : {};
        } catch (e) {
          // response was not JSON
          parsed = { message: text || undefined };
        }

        if (!response.ok) {
          // backend returned error; throw with message
          const msg =
            parsed?.message ||
            `TikTok authentication failed (status ${response.status})`;
          throw new Error(msg);
        }

        const data = parsed as TikTokCallbackResponse;
        console.log("✅ TikTok authentication successful:", data);
        setStatus("success");

        const isPopup = !!(window.opener && window.opener !== window);

        if (isPopup) {
          try {
            // Try postMessage to parent (more robust cross-origin)
            const payload = { type: "tiktok_auth", success: true };
            // Use '*' if you don't know origin (safer to specify if known)
            window.opener.postMessage(payload, "*");
            // then close popup
            window.close();
          } catch (e) {
            // fallback: try to change parent href (may be blocked by cross-origin)
            try {
              if (window.opener) {
                window.opener.location.href = "/dashboard";
              }
              window.close();
            } catch (e2) {
              // last resort: just redirect self
              router.push("/dashboard");
            }
          }
        } else {
          router.push("/dashboard");
        }
      } catch (err: unknown) {
        setStatus("error");
        const errorMessage =
          err instanceof Error ? err.message : "TikTok authentication failed.";
        console.error("TikTok callback error:", err);
        setError(errorMessage);
      }
    };

    handleCallback();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hashtag#0A012A] text-white">
        <div className="mb-4 animate-spin border-4 border-[hashtag#6C63FF] border-t-transparent rounded-full w-12 h-12"></div>
        <p>Completing TikTok authentication...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hashtag#0A012A] text-white">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hashtag#0A012A] text-white">
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
          className="px-6 py-2 bg-[hashtag#6C63FF] hover:bg-[hashtag#5A52E6] rounded-lg text-white font-medium transition-colors"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
