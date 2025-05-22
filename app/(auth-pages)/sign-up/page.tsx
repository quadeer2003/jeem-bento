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
    <form
      className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
      onSubmit={handleSubmit}
    >
      <label className="text-md" htmlFor="email">
        Email
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        name="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="text-md" htmlFor="password">
        Password
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        type="password"
        name="password"
        placeholder="••••••••"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <p className="text-destructive text-sm mb-4">{error}</p>
      )}
      {message && (
        <p className="text-green-600 text-sm mb-4">{message}</p>
      )}
      <button
        className="bg-primary rounded-md px-4 py-2 text-primary-foreground mb-2"
        disabled={isLoading}
      >
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link href={signInUrl} className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}

// Loading fallback component
function SignUpFormFallback() {
  return (
    <div className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
      <div className="rounded-md px-4 py-2 bg-inherit border mb-6 h-10"></div>
      <div className="rounded-md px-4 py-2 bg-inherit border mb-6 h-10"></div>
      <div className="bg-primary/30 rounded-md px-4 py-2 mb-2 h-10"></div>
      <div className="text-sm text-center h-6 opacity-50">Loading...</div>
    </div>
  );
}

export default function SignUp() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
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
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <Suspense fallback={<SignUpFormFallback />}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
