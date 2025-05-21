"use client";

import { useState } from 'react';
import { Workspace } from '@/lib/types';
import { LogOut, Moon, Pencil, PlusIcon, Sun } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  onWorkspaceChange: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
  onEditWorkspace?: (workspaceId: string) => void;
}

export default function Sidebar({ 
  workspaces, 
  currentWorkspaceId, 
  onWorkspaceChange,
  onCreateWorkspace,
  onEditWorkspace
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [hoveredWorkspace, setHoveredWorkspace] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-16 h-full bg-background border-r flex flex-col items-center py-4">
      {/* App logo/home link */}
      <Link 
        href="/" 
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 font-bold"
        title="Home"
      >
        J
      </Link>
      
      {/* Create workspace button */}
      <button
        onClick={onCreateWorkspace}
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
        title="Create new workspace"
      >
        <PlusIcon size={20} />
      </button>
      
      <div className="w-full h-px bg-border my-2" />
      
      {/* Workspace switcher */}
      <div className="flex flex-col gap-2 items-center">
        {workspaces.map((workspace, index) => (
          <div 
            key={workspace.id} 
            className="relative"
            onMouseEnter={() => setHoveredWorkspace(workspace.id)}
            onMouseLeave={() => setHoveredWorkspace(null)}
          >
            <button
              onClick={() => onWorkspaceChange(workspace.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentWorkspaceId === workspace.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              title={workspace.name}
            >
              {workspace.name.substring(0, 1).toUpperCase()}
            </button>
            
            {/* Edit workspace button (appears on hover) */}
            {hoveredWorkspace === workspace.id && onEditWorkspace && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditWorkspace(workspace.id);
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                title="Edit workspace background"
              >
                <Pencil size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* User info */}
      {user && (
        <div className="mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium" title={user.email || 'User'}>
          {user.email?.substring(0, 1).toUpperCase() || 'U'}
        </div>
      )}
      
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors mb-2"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      {/* Logout button */}
      <button
        onClick={handleSignOut}
        className="w-10 h-10 rounded-full sidebar-logout-button flex items-center justify-center hover:bg-destructive/20 transition-colors"
        title="Sign out"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
} 