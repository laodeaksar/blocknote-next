"use client";

import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { SideMenuController, DragHandleButton, SideMenu } from "@blocknote/react";
import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTheme } from "@/lib/theme";
import { useEffect } from "react";

const EMPTY_DOC = { type: "doc", content: [] };

interface EditorProps {
  pageId: Id<"pages">;
  editable?: boolean;
}

export function Editor({ pageId, editable = true }: EditorProps) {
  const sync = useBlockNoteSync(api.prosemirrorSync, pageId);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!sync.isLoading && !sync.editor) {
      sync.create(EMPTY_DOC);
    }
  }, [sync.isLoading, sync.editor]);

  if (sync.isLoading || (!sync.editor)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BlockNoteView
      editor={sync.editor}
      editable={editable}
      theme={resolvedTheme}
      sideMenu={false}
    >
      <SideMenuController
        sideMenu={(props) => (
          <SideMenu {...props}>
            <DragHandleButton {...props} />
          </SideMenu>
        )}
      />
    </BlockNoteView>
  );
}
