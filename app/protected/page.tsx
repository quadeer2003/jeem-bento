"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserWorkspaces } from "@/lib/db";
import WorkspacePage from "@/components/workspace/WorkspacePage";
import { Workspace } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadWorkspaces() {
      if (!loading && user) {
        try {
          const userWorkspaces = await getUserWorkspaces(user.id);
          setWorkspaces(userWorkspaces);
        } catch (error) {
          console.error("Error loading workspaces:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (!loading && !user) {
        router.push("/sign-in");
      }
    }

    loadWorkspaces();
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <main className="flex-1 flex overflow-hidden h-screen">
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="flex-1 flex overflow-hidden h-screen">
      <div className="flex-1 w-full h-full">
        <WorkspacePage user={user} initialWorkspaces={workspaces} />
      </div>
    </main>
  );
}
