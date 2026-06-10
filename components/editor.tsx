"use client";

import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useMutation, useQuery } from "convex/react";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface EditorProps {
  pageId: Id<"pages">;
  editable?: boolean;
}

export function Editor({ pageId, editable = true }: EditorProps) {
  const blocks = useQuery(api.blocks.list, { pageId });
  const upsertBlock = useMutation(api.blocks.upsert);
  const [isSaving, setIsSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const editor = useCreateBlockNote({
    initialContent:
      blocks && blocks.length > 0 ? blocks[0].content : undefined,
  });

  useEffect(() => {
    if (blocks !== undefined && !isReady) {
      setIsReady(true);
    }
  }, [blocks, isReady]);

  const debouncedSave = useDebouncedCallback(async (content: unknown) => {
    setIsSaving(true);
    try {
      await upsertBlock({ pageId, content });
    } finally {
      setIsSaving(false);
    }
  }, 500);

  useEffect(() => {
    if (!editor || !isReady) return;
    const unsubscribe = editor.onChange(() => {
      debouncedSave(editor.document);
    });
    return unsubscribe;
  }, [editor, debouncedSave, isReady]);

  if (blocks === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {isSaving && (
        <span className="absolute top-2 right-2 text-xs text-gray-400 z-10">
          Saving…
        </span>
      )}
      <BlockNoteView
        editor={editor}
        theme="light"
        editable={editable}
      />
    </div>
  );
}
