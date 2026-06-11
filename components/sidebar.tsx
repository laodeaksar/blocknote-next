"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  FileText,
  Trash2,
  RotateCcw,
  ChevronDown,
  Search,
  Settings,
  Menu,
  X,
  FilePlus,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { UserMenu } from "@/components/user-menu";
import { useTheme } from "@/lib/theme";

type PageData = {
  _id: Id<"pages">;
  title: string;
  icon?: string;
  isArchived: boolean;
  isPublished: boolean;
};

function PageItem({
  page,
  isActive,
  onNavigate,
  onArchive,
}: {
  page: { _id: Id<"pages">; title: string; icon?: string };
  isActive: boolean;
  onNavigate: () => void;
  onArchive: (e: React.MouseEvent) => void;
}) {
  const updatePage = useMutation(api.pages.update);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(page.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = (e: React.MouseEvent) => {
    if (!isActive) return;
    e.stopPropagation();
    setEditValue(page.title || "Untitled");
    setIsEditing(true);
  };

  const commitEdit = async () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditValue(page.title || "Untitled");
      setIsEditing(false);
      return;
    }
    if (trimmed !== page.title) {
      await updatePage({ id: page._id, title: trimmed });
      toast.success("Page renamed");
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      setEditValue(page.title || "Untitled");
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={!isEditing ? onNavigate : undefined}
      className={`group relative w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
        isActive
          ? "bg-gray-200 text-gray-900"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      <span className="flex items-center gap-2 min-w-0 flex-1">
        {page.icon ? (
          <span className="text-sm shrink-0">{page.icon}</span>
        ) : (
          <FileText className="w-4 h-4 shrink-0 text-gray-400" />
        )}

        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 bg-white border border-blue-400 rounded px-1 py-0 text-sm text-gray-900 outline-none ring-1 ring-blue-300"
          />
        ) : (
          <span
            className="truncate flex-1"
            onDoubleClick={startEditing}
            title={isActive ? "Double-click to rename" : undefined}
          >
            {page.title || "Untitled"}
          </span>
        )}
      </span>

      {!isEditing && (
        <span
          onClick={onArchive}
          className="opacity-0 group-hover:opacity-100 shrink-0 p-1 hover:bg-gray-300 rounded transition-all"
          role="button"
          title="Move to trash"
        >
          <Trash2 className="w-3 h-3 text-gray-500" />
        </span>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const params = useParams();
  const currentId = params?.id as string | undefined;

  const pages = useQuery(api.pages.list);
  const archivedPages = useQuery(api.pages.getArchived);
  const createPage = useMutation(api.pages.create);
  const archivePage = useMutation(api.pages.archive);
  const restorePage = useMutation(api.pages.restore);
  const removePage = useMutation(api.pages.remove);

  const [showTrash, setShowTrash] = useState(false);

  const handleCreate = async () => {
    const id = await createPage({ title: "Untitled" });
    router.push(`/doc/${id}`);
    toast.success("New page created");
    onNavigate?.();
  };

  const handleArchive = async (e: React.MouseEvent, id: Id<"pages">) => {
    e.stopPropagation();
    await archivePage({ id });
    toast.success("Page moved to trash");
    if (currentId === id) router.push("/dashboard");
  };

  const handleRestore = async (e: React.MouseEvent, id: Id<"pages">) => {
    e.stopPropagation();
    await restorePage({ id });
    toast.success("Page restored");
  };

  const handleRemove = async (e: React.MouseEvent, id: Id<"pages">) => {
    e.stopPropagation();
    await removePage({ id });
    toast.success("Page permanently deleted");
  };

  const navigate = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  return (
    <>
      <div className="flex items-center justify-between px-3 py-2 mt-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-sm font-medium text-gray-800">Workspace</span>
        </div>
        <UserMenu />
      </div>

      <div className="px-2 space-y-0.5">
        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors">
          <Search className="w-4 h-4" />
          Search
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 px-2">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Pages
          </span>
          <button
            onClick={handleCreate}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
            title="New page"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {pages === undefined && (
          <div className="space-y-1 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        )}

        {pages?.length === 0 && (
          <p className="text-xs text-gray-400 px-2 py-2">
            No pages yet. Create one!
          </p>
        )}

        {pages?.map((page: PageData) => (
          <PageItem
            key={page._id}
            page={page}
            isActive={currentId === page._id}
            onNavigate={() => navigate(`/doc/${page._id}`)}
            onArchive={(e) => handleArchive(e, page._id)}
          />
        ))}
      </div>

      <div className="px-2 pb-2 border-t border-gray-200 mt-2 pt-2">
        <button
          onClick={() => setShowTrash((v) => !v)}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
        >
          <span className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Trash
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showTrash ? "rotate-180" : ""}`}
          />
        </button>

        {showTrash && (
          <div className="mt-1 space-y-0.5">
            {archivedPages?.length === 0 && (
              <p className="text-xs text-gray-400 px-2 py-1">Trash is empty</p>
            )}
            {archivedPages?.map((page: PageData) => (
              <div
                key={page._id}
                className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 shrink-0 text-gray-400" />
                  <span className="truncate">{page.title || "Untitled"}</span>
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleRestore(e, page._id)}
                    className="p-1 hover:bg-gray-300 rounded"
                    title="Restore"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleRemove(e, page._id)}
                    className="p-1 hover:bg-red-100 hover:text-red-500 rounded"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleCreate}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200 rounded-md transition-colors mt-1"
        >
          <Plus className="w-4 h-4" />
          New page
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 h-full bg-[#f7f7f5] border-r border-gray-200 shrink-0">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const currentId = params?.id as string | undefined;
  const pages = useQuery(api.pages.list);
  const createPage = useMutation(api.pages.create);
  const { resolvedTheme, setTheme } = useTheme();

  const handleCreate = async () => {
    const id = await createPage({ title: "Untitled" });
    router.push(`/doc/${id}`);
    toast.success("New page created");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        barRef.current?.contains(target)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          ref={popoverRef}
          className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-72 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white mobile-popover"
          style={{ animation: "popover-in 0.15s ease" }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold">N</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">Workspace</span>
            </div>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              {resolvedTheme === "dark"
                ? <Sun className="w-4 h-4 text-gray-500" />
                : <Moon className="w-4 h-4 text-gray-500" />}
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {pages === undefined && (
              <div className="space-y-1.5 px-3 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 bg-gray-100 rounded-md animate-pulse" />
                ))}
              </div>
            )}
            {pages?.length === 0 && (
              <p className="text-xs text-gray-400 px-4 py-3">No pages yet.</p>
            )}
            {pages?.map((page: PageData) => (
              <button
                key={page._id}
                onClick={() => { router.push(`/doc/${page._id}`); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors ${
                  currentId === page._id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page.icon
                  ? <span className="text-sm shrink-0">{page.icon}</span>
                  : <FileText className="w-4 h-4 text-gray-400 shrink-0" />}
                <span className="truncate">{page.title || "Untitled"}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 p-1.5">
            <button
              onClick={handleCreate}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Page
            </button>
          </div>
        </div>
      )}

      <div
        ref={barRef}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center h-12 bg-white border border-gray-200 rounded-full shadow-lg px-1 mobile-pill-bar"
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className={`mobile-fab w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            open ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
          }`}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
        <div className="w-px h-5 bg-gray-200 mx-0.5" />
        <button
          onClick={handleCreate}
          className="mobile-fab w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="New page"
        >
          <FilePlus className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
