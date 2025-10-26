"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useAuth from "./useAuth";
import {
  AuthState,
  AuthResponse,
  SignupResponse,
  LoginData,
  SignupData,
} from "./types/authTypes";
import { AxiosResponse, AuthenticatedFetchOptions } from "./types/axiosTypes";

interface AuthContextType extends AuthState {
  // Login method takes LoginData object and returns AuthResponse
  login: (data: LoginData) => Promise<AuthResponse>;
  // Signup method takes SignupData object and returns SignupResponse
  signup: (data: SignupData) => Promise<SignupResponse>;
  // Logout method takes optional redirect path and returns the path
  logout: (redirectPath?: string) => string;
  // Get auth headers returns a record of string key-value pairs (Authorization may be undefined)
  getAuthHeaders: () => Record<string, string | undefined>;
  // Fetch with auth takes URL and options, returns Axios response
  fetchWithAuth: (
    url: string,
    options?: AuthenticatedFetchOptions
  ) => Promise<AxiosResponse<unknown>>;
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
