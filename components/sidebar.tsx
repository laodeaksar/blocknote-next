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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          ? "bg-sidebar-hover text-foreground"
          : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-2 min-w-0 flex-1">
        {page.icon ? (
          <span className="text-sm shrink-0">{page.icon}</span>
        ) : (
          <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
        )}

        {isEditing ? (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="h-6 flex-1 min-w-0 py-0 px-1 text-sm"
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
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onArchive}
          className="opacity-0 group-hover:opacity-100 shrink-0 h-5 w-5"
          title="Move to trash"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
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
          <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center shrink-0">
            <span className="text-background text-xs font-bold">N</span>
          </div>
          <span className="text-sm font-medium text-foreground">Workspace</span>
        </div>
        <UserMenu />
      </div>

      <div className="px-2 space-y-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <Search className="w-4 h-4" />
          Search
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      <div className="flex-1 overflow-hidden mt-4 px-2">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Pages
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCreate}
            title="New page"
            className="h-5 w-5"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-full">
          {pages === undefined && (
            <div className="space-y-1 px-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          )}

          {pages?.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-2">
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
        </ScrollArea>
      </div>

      <div className="px-2 pb-2 mt-2">
        <Separator className="mb-2" />

        <button
          onClick={() => setShowTrash((v) => !v)}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-hover hover:text-foreground rounded-md transition-colors"
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
              <p className="text-xs text-muted-foreground px-2 py-1">
                Trash is empty
              </p>
            )}
            {archivedPages?.map((page: PageData) => (
              <div
                key={page._id}
                className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-sidebar-hover transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate">{page.title || "Untitled"}</span>
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => handleRestore(e, page._id)}
                    title="Restore"
                    className="h-6 w-6"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => handleRemove(e, page._id)}
                    title="Delete permanently"
                    className="h-6 w-6 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreate}
          className="w-full justify-start gap-2 text-muted-foreground mt-1"
        >
          <Plus className="w-4 h-4" />
          New page
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 h-full bg-sidebar border-r border-border shrink-0">
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
      )
        return;
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
          className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-72 rounded-2xl shadow-2xl border border-border overflow-hidden bg-background mobile-popover"
          style={{ animation: "popover-in 0.15s ease" }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-foreground rounded flex items-center justify-center shrink-0">
                <span className="text-background text-[10px] font-bold">N</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                Workspace
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="max-h-56">
            <div className="py-1">
              {pages === undefined && (
                <div className="space-y-1.5 px-3 py-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-7 w-full" />
                  ))}
                </div>
              )}
              {pages?.length === 0 && (
                <p className="text-xs text-muted-foreground px-4 py-3">
                  No pages yet.
                </p>
              )}
              {pages?.map((page: PageData) => (
                <button
                  key={page._id}
                  onClick={() => {
                    router.push(`/doc/${page._id}`);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors ${
                    currentId === page._id
                      ? "bg-muted text-foreground"
                      : "text-foreground/70 hover:bg-muted/50"
                  }`}
                >
                  {page.icon ? (
                    <span className="text-sm shrink-0">{page.icon}</span>
                  ) : (
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="truncate">{page.title || "Untitled"}</span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreate}
              className="w-full justify-start gap-2"
            >
              <Plus className="w-4 h-4" />
              New Page
            </Button>
          </div>
        </div>
      )}

      <div
        ref={barRef}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center h-12 bg-background border border-border rounded-full shadow-lg px-1 mobile-pill-bar"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          className={`rounded-full ${open ? "bg-muted" : ""}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCreate}
          className="rounded-full"
          aria-label="New page"
        >
          <FilePlus className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
}
