"use client";

import { Workspace } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import CreateWorkspace from "./CreateWorkspace";
import BentoManager from "./BentoManager";
import Sidebar from "../Sidebar";
import { createClient } from "@/utils/supabase/client";
import { X } from "lucide-react";

interface WorkspacePageProps {
  user: User;
  initialWorkspaces: Workspace[];
}

export default function WorkspacePage({ user, initialWorkspaces }: WorkspacePageProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    initialWorkspaces.length > 0 ? initialWorkspaces[0].id : null
  );
  const [showCreateWorkspace, setShowCreateWorkspace] = useState<boolean>(initialWorkspaces.length === 0);
  const [isEditingBackground, setIsEditingBackground] = useState<boolean>(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [workspaceBackgrounds, setWorkspaceBackgrounds] = useState<Record<string, string>>({});
  const supabase = createClient();

  const handleWorkspaceCreated = (workspaceId: string) => {
    // Refresh the page to get the updated workspace list
    window.location.reload();
  };

  const handleCreateWorkspaceClick = () => {
    setSelectedWorkspaceId(null);
    setShowCreateWorkspace(true);
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowCreateWorkspace(false);
  };

  const handleEditWorkspace = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowCreateWorkspace(false);
    setIsEditingBackground(true);
  };

  const handleBackgroundSave = async () => {
    if (!selectedWorkspaceId) return;
    
    try {
      // Update the workspace in the database with the background URL
      await supabase
        .from('workspaces')
        .update({ background_url: backgroundUrl })
        .eq('id', selectedWorkspaceId);
      
      // Update local state
      setWorkspaceBackgrounds({
        ...workspaceBackgrounds,
        [selectedWorkspaceId]: backgroundUrl
      });
      
      setIsEditingBackground(false);
    } catch (error) {
      console.error('Error updating workspace background:', error);
    }
  };

  const currentBackground = selectedWorkspaceId ? workspaceBackgrounds[selectedWorkspaceId] : "";

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar 
        workspaces={workspaces}
        currentWorkspaceId={selectedWorkspaceId}
        onWorkspaceChange={handleWorkspaceChange}
        onCreateWorkspace={handleCreateWorkspaceClick}
        onEditWorkspace={handleEditWorkspace}
      />
      
      {/* Main content */}
      <div 
        className="flex-1 p-8 overflow-y-auto relative"
        style={{
          backgroundImage: currentBackground ? `url(${currentBackground})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background overlay for better readability */}
        {currentBackground && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-8">
            {showCreateWorkspace 
              ? "Create New Workspace" 
              : selectedWorkspaceId 
                ? workspaces.find(w => w.id === selectedWorkspaceId)?.name || "Workspace"
                : "Select a Workspace"
            }
          </h1>
          
          {isEditingBackground && selectedWorkspaceId && (
            <div className="bg-card p-4 rounded-lg shadow-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Set Workspace Background</h2>
                <button 
                  onClick={() => setIsEditingBackground(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={backgroundUrl} 
                  onChange={(e) => setBackgroundUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1 p-2 border rounded"
                />
                <button 
                  onClick={handleBackgroundSave}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          
          {showCreateWorkspace ? (
            <CreateWorkspace userId={user.id} onWorkspaceCreated={handleWorkspaceCreated} />
          ) : selectedWorkspaceId ? (
            <BentoManager workspaceId={selectedWorkspaceId} />
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Select a workspace from the sidebar or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 