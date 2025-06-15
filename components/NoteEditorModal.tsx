"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save } from "lucide-react";
import { Note } from "@/lib/types";
import { DynamicEditor } from "@/components/DynamicEditor";

interface NoteEditorModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
}

export default function NoteEditorModal({ note, isOpen, onClose, onSave }: NoteEditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      // Force editor recreation with new key
      setEditorKey(prev => prev + 1);
    } else {
      setTitle("");
      setContent(null);
    }
  }, [note]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (!note) return;

    setIsSaving(true);
    try {
      const updatedNote: Note = {
        ...note,
        title,
        content,
        updated_at: new Date().toISOString(),
      };
      await onSave(updatedNote);
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !note || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 relative z-10">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none outline-none flex-1 mr-4 text-gray-900 dark:text-white"
            placeholder="Note title..."
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto relative">
          <div className="h-full p-6">
            <DynamicEditor
              key={`editor-${editorKey}`}
              content={content}
              onChange={setContent}
              editable={true}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
