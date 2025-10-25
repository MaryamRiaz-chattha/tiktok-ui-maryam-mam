"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth";

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
