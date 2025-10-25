"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useAuth from "./useAuth";
import { AuthState, AuthResponse, SignupResponse } from "./types/authTypes";

interface AuthContextType extends AuthState {
  login: (data: { email: string; password: string }) => Promise<AuthResponse>;
  signup: (data: {
    email: string;
    username: string;
    full_name: string;
    password: string;
  }) => Promise<SignupResponse>;
  logout: (redirectPath?: string) => void;
  getAuthHeaders: () => Record<string, string>;
  fetchWithAuth: (url: string, options?: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  const contextValue: AuthContextType = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    getAuthHeaders: auth.getAuthHeaders,
    fetchWithAuth: auth.fetchWithAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Export the context for direct access if needed
export { AuthContext };
