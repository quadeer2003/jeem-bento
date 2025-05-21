"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderAuth() {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-5 w-24 bg-secondary/30 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <p className="text-sm">{user.email}</p>
          <button
            onClick={() => signOut()}
            className="py-2 px-3 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href={
            pathname === "/" || pathname === ""
              ? "/sign-in"
              : `/sign-in?redirectTo=${encodeURIComponent(pathname)}`
          }
          className="py-2 px-3 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          Login
        </Link>
      )}
    </div>
  );
}
