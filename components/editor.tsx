"use client";

import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { SideMenuController, DragHandleButton, SideMenu } from "@blocknote/react";
import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTheme } from "@/lib/theme";
import { useEffect, useState, useCallback } from "react";
import { useConvexConnectionState } from "convex/react";
import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";

const EMPTY_DOC = { type: "doc", content: [] };

interface EditorProps {
  pageId: Id<"pages">;
  editable?: boolean;
}

export function Editor({ pageId, editable = true }: EditorProps) {
  const [syncError, setSyncError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleSyncError = useCallback((error: Error) => {
    setSyncError(error);
  }, []);

  const sync = useBlockNoteSync(api.prosemirrorSync, pageId, {
    onSyncError: handleSyncError,
  });
  const { resolvedTheme } = useTheme();
  const connectionState = useConvexConnectionState();

  const isDisconnected = !connectionState.isWebSocketConnected;
  const isReconnecting = isDisconnected && connectionState.hasEverConnected;

  useEffect(() => {
    if (connectionState.isWebSocketConnected && syncError) {
      setSyncError(null);
    }
  }, [connectionState.isWebSocketConnected, syncError]);

  useEffect(() => {
    if (!sync.isLoading && !sync.editor) {
      sync.create(EMPTY_DOC);
    }
  }, [sync.isLoading, sync.editor]);

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    setSyncError(null);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }, []);

  if (sync.isLoading || !sync.editor) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {(isReconnecting || syncError) && (
        <div
          className={`mb-3 flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm ${
            syncError
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-amber-50 border border-amber-200 text-amber-700"
          }`}
        >
          <span className="flex items-center gap-2">
            {syncError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <WifiOff className="w-4 h-4 shrink-0" />
            )}
            {syncError
              ? "Gagal menyinkronkan perubahan."
              : "Koneksi terputus. Mencoba menghubungkan kembali…"}
          </span>

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors shrink-0 ${
              syncError
                ? "bg-red-100 hover:bg-red-200 text-red-700"
                : "bg-amber-100 hover:bg-amber-200 text-amber-700"
            } disabled:opacity-50`}
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Memuat ulang…" : "Coba lagi"}
          </button>
        </div>
      )}

      {isDisconnected && !isReconnecting && (
        <div className="mb-3 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin shrink-0" />
          Menghubungkan ke server…
        </div>
      )}

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
    </div>
  );
}
