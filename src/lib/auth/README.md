# AuthContext and AuthGuard Documentation

This document explains how to use the AuthContext and AuthGuard components for authentication in your Next.js application.

## Setup

### 1. Wrap your app with AuthProvider

In your root layout or `_app.tsx`, wrap your application with the AuthProvider:

```tsx
import { AuthProviderWrapper } from "@/components/providers/AuthProviderWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
```

### 2. Use AuthContext in components

```tsx
import { useAuthContext } from "@/lib/auth";

export default function MyComponent() {
  const { user, isAuthenticated, logout, login } = useAuthContext();

  const handleLogin = async () => {
    try {
      await login({ email: "user@example.com", password: "password" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Please log in</h1>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

## AuthGuard Components

### ProtectedRoute

Automatically redirects unauthenticated users to login:

```tsx
import { ProtectedRoute } from "@/lib/auth";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only for authenticated users</div>
    </ProtectedRoute>
  );
}
```

### PublicRoute

Redirects authenticated users away from public pages (like login):

```tsx
import { PublicRoute } from "@/lib/auth";

export default function LoginPage() {
  return (
    <PublicRoute>
      <div>Login form here</div>
    </PublicRoute>
  );
}
```

### Custom AuthGuard

For more control over authentication behavior:

```tsx
import { AuthGuard } from "@/lib/auth";

export default function CustomPage() {
  return (
    <AuthGuard
      requireAuth={true}
      redirectTo="/custom-login"
      fallback={<div>Custom loading or error message</div>}
    >
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

### Higher-Order Component

Use `withAuthGuard` to wrap components:

```tsx
import { withAuthGuard } from "@/lib/auth";

function MyComponent() {
  return <div>Protected content</div>;
}

export default withAuthGuard(MyComponent, { requireAuth: true });
```

## AuthGuard Props

| Prop          | Type        | Default         | Description                                                    |
| ------------- | ----------- | --------------- | -------------------------------------------------------------- |
| `children`    | `ReactNode` | -               | Content to render when authentication requirements are met     |
| `fallback`    | `ReactNode` | `null`          | Content to render when authentication requirements are not met |
| `redirectTo`  | `string`    | `'/auth/login'` | Path to redirect to when authentication fails                  |
| `requireAuth` | `boolean`   | `true`          | Whether authentication is required to access the content       |

## AuthContext Methods

| Method           | Parameters                            | Description                    |
| ---------------- | ------------------------------------- | ------------------------------ |
| `login`          | `{ email: string, password: string }` | Log in with email and password |
| `signup`         | `SignupData`                          | Create a new user account      |
| `logout`         | `redirectPath?: string`               | Log out the current user       |
| `getAuthHeaders` | -                                     | Get authentication headers     |
| `fetchWithAuth`  | `url: string, options?: any`          | Make authenticated requests    |

## AuthContext State

| Property          | Type             | Description                                   |
| ----------------- | ---------------- | --------------------------------------------- |
| `user`            | `User \| null`   | Current user data                             |
| `token`           | `string \| null` | Current authentication token                  |
| `isAuthenticated` | `boolean`        | Whether user is authenticated                 |
| `isLoading`       | `boolean`        | Whether authentication state is being checked |

## Examples

### Complete Protected Page

```tsx
"use client";

import { ProtectedRoute, useAuthContext } from "@/lib/auth";

export default function Dashboard() {
  const { user, logout } = useAuthContext();

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.full_name}!</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </ProtectedRoute>
  );
}
```

### Login Page with Redirect

```tsx
"use client";

import { PublicRoute } from "@/lib/auth";

export default function LoginPage() {
  return (
    <PublicRoute>
      <div>
        <h1>Login</h1>
        {/* Login form here */}
      </div>
    </PublicRoute>
  );
}
```

### Custom Authentication Logic

```tsx
"use client";

import { AuthGuard, useAuthContext } from "@/lib/auth";

export default function AdminPage() {
  const { user } = useAuthContext();

  return (
    <AuthGuard
      requireAuth={true}
      fallback={<div>Access denied. Admin privileges required.</div>}
    >
      <div>
        <h1>Admin Panel</h1>
        <p>Welcome, {user?.username}!</p>
      </div>
    </AuthGuard>
  );
}
```

## Best Practices

1. **Always wrap your app with AuthProvider** at the root level
2. **Use ProtectedRoute for authenticated pages** - it's simpler and handles redirects automatically
3. **Use PublicRoute for login/signup pages** - prevents authenticated users from accessing them
4. **Use custom AuthGuard** when you need specific behavior or custom fallback content
5. **Handle loading states** - the AuthGuard automatically shows a loading spinner while checking authentication
6. **Use useAuthContext** instead of the raw useAuth hook when you need authentication state in components

## Troubleshooting

### Common Issues

1. **"useAuthContext must be used within an AuthProvider"**

   - Make sure your app is wrapped with AuthProvider

2. **Infinite redirects**

   - Check that your redirect paths are correct and don't create loops

3. **Loading state never ends**

   - Check your authentication API and ensure it's responding correctly

4. **User data not updating**
   - Make sure you're using useAuthContext instead of the raw useAuth hook
