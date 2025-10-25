"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleAuth } from "@/lib/auth";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback } = useGoogleAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const state = searchParams.get("state");

        if (error) {
          setStatus("error");
          setMessage(`Google OAuth error: ${error}`);
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received");
          return;
        }

        await handleGoogleCallback(code, state || undefined);
        setStatus("success");
        setMessage("Successfully authenticated with Google!");

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/auth/connect");
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, handleGoogleCallback, router]);

  return (
    <div className="min-h-screen bg-[#0A012A] flex items-center justify-center">
      <div className="bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50 rounded-2xl p-8 max-w-md mx-4 text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Authenticating...
            </h3>
            <p className="text-[#C5C5D2]">
              Please wait while we verify your Google account
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
            <p className="text-[#C5C5D2] mb-4">{message}</p>
            <div className="w-full bg-[#2A1A4D] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] h-2 rounded-full animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-[#FF2E97] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Authentication Failed
            </h3>
            <p className="text-[#C5C5D2] mb-4">{message}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
