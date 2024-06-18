"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Component that uses useSearchParams
function SignUpForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email for the confirmation link.");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectTo = searchParams.get("redirectTo");
  const signInUrl = redirectTo
    ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/sign-in";

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium mb-2 block" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-lg px-4 py-3 bg-background border border-input w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-lg px-4 py-3 bg-background border border-input w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Must be at least 8 characters long
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
          <p className="text-green-600 dark:text-green-400 text-sm">
            {message}
          </p>
        </div>
      )}

      <button
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white rounded-lg px-4 py-3 font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link
          href={signInUrl}
          className="text-primary hover:underline font-medium"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}

// Loading fallback component
function SignUpFormFallback() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      <div className="h-10 bg-muted rounded-lg"></div>
      <div className="h-10 bg-muted rounded-lg"></div>
      <div className="h-12 bg-muted rounded-lg"></div>
    </div>
  );
}

export default function SignUp() {
  return (
    <div className="w-full space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Home
      </Link>

      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 flex items-center justify-center">
            <span className="text-white text-xl">🍱</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground">
          Start organizing your workspace with Jeem Bento
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <Suspense fallback={<SignUpFormFallback />}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
