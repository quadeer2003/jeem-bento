"use client";

import { BentoItem, Note } from "@/lib/types";
import { useState, useEffect } from "react";
import { Plus, FileText, Edit3, Trash2 } from "lucide-react";
import NoteEditorModal from "@/components/NoteEditorModal";
import { createClient } from "@/utils/supabase/client";

interface NotesItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function NotesItem({ item, onUpdate, editable }: NotesItemProps) {
  const [notes, setNotes] = useState<Note[]>(item.content?.notes || []);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Load notes from Supabase
  useEffect(() => {
    loadNotes();
  }, [item.id]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('bento_item_id', item.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setNotes(data || []);
      onUpdate({ notes: data || [] });
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewNote = async () => {
    if (!editable) return;

    // Prompt user for note title
    const title = prompt("Enter note title:");
    if (!title || title.trim() === "") return; // User cancelled or entered empty title

    try {
      const newNote: Omit<Note, 'id'> = {
        title: title.trim(),
        content: [
          {
            type: "paragraph",
            content: "Start writing your note..."
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        bento_item_id: item.id,
      };

      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: newNote.title,
          content: newNote.content,
          created_at: newNote.created_at,
          updated_at: newNote.updated_at,
          bento_item_id: newNote.bento_item_id,
        })
        .select()
        .single();

      if (error) throw error;

      const createdNote = data as Note;
      setNotes(prev => [createdNote, ...prev]);
      setSelectedNote(createdNote);
      setIsModalOpen(true);
      onUpdate({ notes: [createdNote, ...notes] });
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const saveNote = async (updatedNote: Note) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
          updated_at: updatedNote.updated_at,
        })
        .eq('id', updatedNote.id);

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
      onUpdate({ notes: notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ) });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!editable) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      onUpdate({ notes: updatedNotes });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPreviewText = (content: any) => {
    if (!content) return "Empty note";
    
    try {
      // Handle array of blocks (BlockNote format)
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "paragraph") {
            // Handle different content formats
            if (typeof block.content === "string" && block.content.trim()) {
              const text = block.content.trim();
              return text.slice(0, 100) + (text.length > 100 ? "..." : "");
            }
            
            if (Array.isArray(block.content)) {
              const text = block.content
                .filter((item: any) => item.type === "text" && item.text)
                .map((item: any) => item.text)
                .join("")
                .trim();
              
              if (text) {
                return text.slice(0, 100) + (text.length > 100 ? "..." : "");
              }
            }
          }
        }
      }
      
      // Handle string content
      if (typeof content === "string" && content.trim()) {
        const text = content.trim();
        return text.slice(0, 100) + (text.length > 100 ? "..." : "");
      }
      
    } catch (error) {
      console.error("Error parsing content for preview:", error);
    }
    
    return "Empty note";
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Notes</h3>
          </div>
          {editable && (
            <button
              onClick={createNewNote}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Note
            </button>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No notes yet</p>
              {editable && (
                <button
                  onClick={createNewNote}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Create your first note
                </button>
              )}
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                onClick={() => openNote(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-1 flex-1 text-gray-900 dark:text-white">
                    {note.title}
                  </h4>
                  {editable && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openNote(note);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        title="Edit note"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this note?')) {
                            deleteNote(note.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {getPreviewText(note.content)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(note.updated_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note Editor Modal */}
      <NoteEditorModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={saveNote}
      />
    </>
  );
}
