"use client";

import { Workspace } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import CreateWorkspace from "./CreateWorkspace";
import BentoManager, { createBentoGridItem } from "./BentoManager";
import Sidebar from "../Sidebar";
import { createClient } from "@/utils/supabase/client";
import { X } from "lucide-react";
import { BentoItemType } from "@/lib/types";

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
  const [refreshBentoGrid, setRefreshBentoGrid] = useState(0); // Counter to trigger refresh
  const [currentBackground, setCurrentBackground] = useState<string>("");
  const supabase = createClient();

  // Fetch workspace backgrounds on init and when selected workspace changes
  useEffect(() => {
    const fetchWorkspaceBackgrounds = async () => {
      try {
        if (workspaces.length > 0) {
          const { data, error } = await supabase
            .from('workspaces')
            .select('id, background_url')
            .in('id', workspaces.map(w => w.id));
          
          if (error) throw error;
          
          const backgrounds: Record<string, string> = {};
          data.forEach(item => {
            if (item.background_url) {
              backgrounds[item.id] = item.background_url;
            }
          });
          
          console.log("Loaded backgrounds:", backgrounds);
          setWorkspaceBackgrounds(backgrounds);
        }
      } catch (error) {
        console.error('Error fetching workspace backgrounds:', error);
      }
    };

    fetchWorkspaceBackgrounds();
  }, [workspaces, supabase]);

  // Update current background when selected workspace changes
  useEffect(() => {
    if (selectedWorkspaceId) {
      const fetchCurrentBackground = async () => {
        try {
          // First try to get from state
          if (workspaceBackgrounds[selectedWorkspaceId]) {
            setCurrentBackground(workspaceBackgrounds[selectedWorkspaceId]);
            return;
          }
          
          // If not in state, fetch directly
          const { data, error } = await supabase
            .from('workspaces')
            .select('background_url')
            .eq('id', selectedWorkspaceId)
            .single();
          
          if (error) throw error;
          
          if (data?.background_url) {
            setCurrentBackground(data.background_url);
            // Also update the workspaceBackgrounds state
            setWorkspaceBackgrounds(prev => ({
              ...prev,
              [selectedWorkspaceId]: data.background_url
            }));
            console.log("Set background to:", data.background_url);
          } else {
            setCurrentBackground("");
          }
        } catch (error) {
          console.error('Error fetching current background:', error);
          setCurrentBackground("");
        }
      };
      
      fetchCurrentBackground();
    } else {
      setCurrentBackground("");
    }
  }, [selectedWorkspaceId, workspaceBackgrounds, supabase]);

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

  // This function is used by the Sidebar component to edit workspaces
  const handleEditWorkspace = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowCreateWorkspace(false);
  };

  // This function will be called when a new item is added from the sidebar
  const handleAddBentoItem = async (workspaceId: string, itemType: BentoItemType, title?: string) => {
    try {
      // We're using the exported function from BentoManager
      const newItem = await createBentoGridItem(workspaceId, itemType, title);
      
      if (newItem) {
        // Increment the refresh counter to trigger a reload in BentoManager
        setRefreshBentoGrid(prev => prev + 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding bento item:', error);
      return false;
    }
  };

  // Debug log the current background URL
  console.log("Current background URL:", currentBackground);

  return (
    <div className="flex h-full">
      {/* Sidebar with enhanced functionality */}
      <Sidebar 
        workspaces={workspaces}
        currentWorkspaceId={selectedWorkspaceId}
        onWorkspaceChange={handleWorkspaceChange}
        onCreateWorkspace={handleCreateWorkspaceClick}
        onEditWorkspace={handleEditWorkspace}
        onAddBentoItem={handleAddBentoItem}
      />
      
      {/* Main content */}
      <div 
        className="flex-1 p-8 overflow-y-auto relative"
        style={{
          backgroundImage: currentBackground ? `url('${currentBackground}')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background overlay for better readability */}
        {currentBackground && (
          <div className="absolute inset-0 "></div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-8">
            {showCreateWorkspace 
              ? "Create New Workspace" 
              : selectedWorkspaceId 
                ? ""
                : "Select a Workspace"
            }
          </h1>
          
          {showCreateWorkspace ? (
            <CreateWorkspace userId={user.id} onWorkspaceCreated={handleWorkspaceCreated} />
          ) : selectedWorkspaceId ? (
            <BentoManager 
              key={`bento-${selectedWorkspaceId}-${refreshBentoGrid}`} 
              workspaceId={selectedWorkspaceId} 
            />
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