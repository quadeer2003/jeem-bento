"use client";

import { useState } from 'react';
import { Workspace } from '@/lib/types';
import { LogOut, Moon, Pencil, PlusIcon, Sun, ImageIcon, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BentoItemType } from '@/lib/types';

interface SidebarProps {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  onWorkspaceChange: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
  onEditWorkspace?: (workspaceId: string) => void;
  onAddBentoItem?: (workspaceId: string, type: BentoItemType, title?: string) => void;
}

export default function Sidebar({ 
  workspaces, 
  currentWorkspaceId, 
  onWorkspaceChange,
  onCreateWorkspace,
  onEditWorkspace,
  onAddBentoItem
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [hoveredWorkspace, setHoveredWorkspace] = useState<string | null>(null);
  const [openPopupWorkspaceId, setOpenPopupWorkspaceId] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<'menu' | 'background' | 'addItem' | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemType, setNewItemType] = useState<BentoItemType>("photo");

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditButtonClick = (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation();
    setOpenPopupWorkspaceId(workspaceId);
    setPopupType('menu');
  };

  const closePopup = () => {
    setOpenPopupWorkspaceId(null);
    setPopupType(null);
    setBackgroundUrl("");
    setSelectedFile(null);
    setNewItemTitle("");
  };

  const handleBackgroundOption = () => {
    setPopupType('background');
  };

  const handleAddItemOption = () => {
    setPopupType('addItem');
  };

  const handleBackgroundSave = async () => {
    if (!openPopupWorkspaceId) return;
    
    try {
      setIsUploading(true);
      let finalUrl = backgroundUrl;
      
      // If there's a file selected, upload it first
      if (selectedFile) {
        console.log("Uploading file:", selectedFile.name);
        const filePath = `backgrounds/${openPopupWorkspaceId}/${Math.random().toString(36).substring(2)}`;
        const { data, error: uploadError } = await supabase.storage
          .from('bento-items')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          throw uploadError;
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('bento-items')
          .getPublicUrl(filePath);

        finalUrl = publicUrlData.publicUrl;
        console.log("Uploaded file, public URL:", finalUrl);
      }
      
      if (finalUrl) {
        console.log("Updating workspace background URL:", finalUrl);
        // Use the background URL from state or the uploaded file
        const { error: updateError } = await supabase
          .from('workspaces')
          .update({ background_url: finalUrl })
          .eq('id', openPopupWorkspaceId);
          
        if (updateError) {
          console.error("Error updating workspace:", updateError);
          throw updateError;
        }
        
        console.log("Background URL updated successfully");
        
        // Force a full page reload to ensure the background is applied
        // This is the most reliable way to ensure the background is displayed
        window.location.reload();
      } else {
        console.warn("No URL to save - neither image uploaded nor URL provided");
      }
      
      closePopup();
    } catch (error) {
      console.error('Error updating background:', error);
      alert("Failed to update background. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddItem = () => {
    if (!openPopupWorkspaceId || !onAddBentoItem) return;
    
    onAddBentoItem(
      openPopupWorkspaceId, 
      newItemType, 
      newItemTitle.trim() || undefined
    );
    
    closePopup();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
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
            {hoveredWorkspace === workspace.id && (
              <button 
                onClick={(e) => handleEditButtonClick(e, workspace.id)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                title="Workspace options"
              >
                <Pencil size={10} />
              </button>
            )}

            {/* Popup menu */}
            {openPopupWorkspaceId === workspace.id && popupType === 'menu' && (
              <div className="absolute left-14 top-0 w-48 bg-card shadow-lg rounded-md p-2 z-50">
                <div className="flex justify-between items-center mb-2 pb-1 border-b">
                  <h4 className="text-sm font-medium">Workspace Options</h4>
                  <button onClick={closePopup} className="text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                </div>
                <button 
                  onClick={handleAddItemOption}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2"
                >
                  <PlusIcon size={14} />
                  Add Item
                </button>
                <button 
                  onClick={handleBackgroundOption}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2"
                >
                  <ImageIcon size={14} />
                  Change Background
                </button>
              </div>
            )}

            {/* Background Change Popup */}
            {openPopupWorkspaceId === workspace.id && popupType === 'background' && (
              <div className="absolute left-14 top-0 w-72 bg-card shadow-lg rounded-md p-3 z-50">
                <div className="flex justify-between items-center mb-2 pb-1 border-b">
                  <h4 className="text-sm font-medium">Change Background</h4>
                  <button onClick={closePopup} className="text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">Image URL</label>
                    <input 
                      type="text" 
                      value={backgroundUrl} 
                      onChange={(e) => setBackgroundUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="w-full p-1.5 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <p className="text-xs mb-1">Or upload an image:</p>
                    <label className="flex items-center justify-center w-full border-2 border-dashed border-muted p-2 rounded-md cursor-pointer hover:bg-muted/50">
                      <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                      <span className="text-xs text-muted-foreground">
                        {selectedFile ? selectedFile.name : "Click to select image"}
                      </span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button 
                      onClick={closePopup}
                      className="px-2 py-1 text-xs bg-secondary rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleBackgroundSave}
                      className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded flex items-center gap-1"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>Saving...</>
                      ) : (
                        <>Save</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Item Popup */}
            {openPopupWorkspaceId === workspace.id && popupType === 'addItem' && (
              <div className="absolute left-14 top-0 w-64 bg-card shadow-lg rounded-md p-3 z-50">
                <div className="flex justify-between items-center mb-2 pb-1 border-b">
                  <h4 className="text-sm font-medium">Add New Item</h4>
                  <button onClick={closePopup} className="text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">Title (optional)</label>
                    <input 
                      type="text" 
                      value={newItemTitle} 
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="Item title"
                      className="w-full p-1.5 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Type</label>
                    <select
                      value={newItemType}
                      onChange={(e) => setNewItemType(e.target.value as BentoItemType)}
                      className="w-full p-1.5 text-sm border rounded"
                    >
                      <option value="photo">Photo</option>
                      <option value="calendar">Calendar</option>
                      <option value="youtube">YouTube</option>
                      <option value="links">Links</option>
                      <option value="screenshots">Screenshots</option>
                      <option value="contacts">Contacts</option>
                      <option value="websites">Websites</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button 
                      onClick={closePopup}
                      className="px-2 py-1 text-xs bg-secondary rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddItem}
                      className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
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