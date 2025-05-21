"use client";

import { useState } from "react";
import { createWorkspace } from "@/lib/db";

interface CreateWorkspaceProps {
  userId: string;
  onWorkspaceCreated: (workspaceId: string) => void;
}

export default function CreateWorkspace({ userId, onWorkspaceCreated }: CreateWorkspaceProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const workspace = await createWorkspace({
        name: name.trim(),
        userId
      });

      if (workspace) {
        onWorkspaceCreated(workspace.id);
      } else {
        setError("Failed to create workspace");
      }
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError("An error occurred while creating the workspace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Your Workspace</h2>
      <p className="mb-6 text-muted-foreground">
        Create a personalized workspace to organize your bento grid items.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="workspace-name" className="block text-sm font-medium mb-1">
            Workspace Name
          </label>
          <input
            id="workspace-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Workspace"
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors"
        >
          {isLoading ? "Creating..." : "Create Workspace"}
        </button>
      </form>
    </div>
  );
} 