"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";

interface EditorProps {
  content?: any;
  onChange?: (content: any) => void;
  editable?: boolean;
}

export default function Editor({ content, onChange, editable = true }: EditorProps) {
  // Create editor with full configuration
  const editor = useCreateBlockNote({
    initialContent: content && Array.isArray(content) && content.length > 0 
      ? content 
      : undefined, // Let BlockNote create default content if none provided
  });

  // Handle content changes
  useEffect(() => {
    if (!onChange || !editor) return;
    
    const unsubscribe = editor.onChange(() => {
      const newContent = editor.document;
      onChange(newContent);
    });
    
    return unsubscribe;
  }, [editor, onChange]);

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <div className="bn-container w-full h-full">
        <BlockNoteView 
          editor={editor} 
          editable={editable}
          theme="light"
          slashMenu={true}
          formattingToolbar={true}
          linkToolbar={true}
          sideMenu={true}
        />
      </div>
    </div>
  );
}
