"use client";
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A012A] text-white">
      <div className="mb-4 animate-spin border-4 border-[#6C63FF] border-t-transparent rounded-full w-12 h-12"></div>
      <p>Loading TikTok authentication...</p>
    </div>
  );
}
