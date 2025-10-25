/**
 * Example usage of the corrected AuthContext with proper TypeScript types
 * This file demonstrates how to use the authentication context correctly
 */

"use client";

import React from "react";
import { useAuthContext } from "./AuthContext";
import { LoginData, SignupData } from "./types/authTypes";

// Example component showing proper usage of AuthContext
export function AuthExampleComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    signup, 
    logout, 
    getAuthHeaders, 
    fetchWithAuth 
  } = useAuthContext();

  // Example login handler with proper typing
  const handleLogin = async () => {
    const loginData: LoginData = {
      email: "user@example.com",
      password: "password123"
    };
    
    try {
      // login method expects LoginData object, returns Promise<AuthResponse>
      const authResponse = await login(loginData);
      console.log("Login successful:", authResponse.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Example signup handler with proper typing
  const handleSignup = async () => {
    const signupData: SignupData = {
      email: "newuser@example.com",
      username: "newuser",
      full_name: "New User",
      password: "password123"
    };
    
    try {
      // signup method expects SignupData object, returns Promise<SignupResponse>
      const signupResponse = await signup(signupData);
      console.log("Signup successful:", signupResponse);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // Example logout handler with proper typing
  const handleLogout = () => {
    // logout method takes optional redirect path, returns the path
    const redirectPath = logout("/login");
    console.log("Redirecting to:", redirectPath);
  };

  // Example of using getAuthHeaders with proper typing
  const handleGetHeaders = () => {
    // getAuthHeaders returns Record<string, string>
    const headers = getAuthHeaders();
    console.log("Auth headers:", headers);
  };

  // Example of using fetchWithAuth with proper typing
  const handleFetchData = async () => {
    try {
      // fetchWithAuth takes URL and optional FetchOptions, returns AxiosResponse
      const response = await fetchWithAuth("/api/protected-data", {
        method: "GET",
        headers: {
          "Custom-Header": "value"
        }
      });
      
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Please log in</h1>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Signup</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Email: {user?.email}</p>
      <p>Full Name: {user?.full_name}</p>
      
      <button onClick={handleGetHeaders}>Get Auth Headers</button>
      <button onClick={handleFetchData}>Fetch Protected Data</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

/**
 * Type-safe wrapper for authentication methods
 * This demonstrates how to create type-safe wrappers around auth methods
 */
export class AuthService {
  constructor(private authContext: ReturnType<typeof useAuthContext>) {}

  // Type-safe login method
  async loginUser(email: string, password: string) {
    const loginData: LoginData = { email, password };
    return await this.authContext.login(loginData);
  }

  // Type-safe signup method
  async signupUser(
    email: string, 
    username: string, 
    fullName: string, 
    password: string
  ) {
    const signupData: SignupData = { 
      email, 
      username, 
      full_name: fullName, 
      password 
    };
    return await this.authContext.signup(signupData);
  }

  // Type-safe logout method
  logoutUser(redirectPath?: string) {
    return this.authContext.logout(redirectPath);
  }

  // Type-safe authenticated fetch
  async fetchProtectedData<T = any>(url: string, options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    data?: unknown;
    headers?: Record<string, string>;
  }) {
    return await this.authContext.fetchWithAuth(url, options) as {
      data: T;
      status: number;
      statusText: string;
      headers: Record<string, string>;
      config: any;
    };
  }
}
