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
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

export function Sidebar() {
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

  return (
    <aside className="flex flex-col w-60 h-full bg-[#f7f7f5] border-r border-gray-200 shrink-0">
      <div className="flex items-center justify-between px-3 py-2 mt-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-sm font-medium text-gray-800">Workspace</span>
        </div>
        <UserButton afterSignOutUrl="/" />
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
              <div
                key={i}
                className="h-7 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        )}

        {pages?.length === 0 && (
          <p className="text-xs text-gray-400 px-2 py-2">
            No pages yet. Create one!
          </p>
        )}

        {pages?.map((page) => (
          <button
            key={page._id}
            onClick={() => router.push(`/doc/${page._id}`)}
            className={`group w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
              currentId === page._id
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              {page.icon ? (
                <span className="text-sm shrink-0">{page.icon}</span>
              ) : (
                <FileText className="w-4 h-4 shrink-0 text-gray-400" />
              )}
              <span className="truncate">{page.title || "Untitled"}</span>
            </span>
            <span
              onClick={(e) => handleArchive(e, page._id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded transition-all"
              role="button"
              title="Move to trash"
            >
              <Trash2 className="w-3 h-3 text-gray-500" />
            </span>
          </button>
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
            {archivedPages?.map((page) => (
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
    </aside>
  );
}
