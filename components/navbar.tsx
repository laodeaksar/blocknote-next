"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MoreHorizontal, Star, Share2, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { UserMenu } from "@/components/user-menu";
import { useTheme } from "@/lib/theme";

interface NavbarProps {
  pageId: Id<"pages">;
}

export function Navbar({ pageId }: NavbarProps) {
  const page = useQuery(api.pages.get, { id: pageId });
  const updatePage = useMutation(api.pages.update);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  if (!page) {
    return (
      <nav className="h-12 flex items-center px-4 border-b border-gray-100 dark-nav">
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      </nav>
    );
  }

  const handlePublish = async () => {
    await updatePage({
      id: pageId,
      isPublished: !page.isPublished,
    });
    toast.success(page.isPublished ? "Page unpublished" : "Page published!");
  };

  return (
    <nav className="h-12 flex items-center justify-between px-4 border-b border-gray-100 bg-white dark-nav">
      <div className="flex items-center gap-2 min-w-0">
        {page.icon && <span className="text-sm">{page.icon}</span>}
        <span className="text-sm font-medium text-gray-700 truncate">
          {page.title || "Untitled"}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handlePublish}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-3 h-3" />
          {page.isPublished ? "Unpublish" : "Share"}
        </button>

        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Star className="w-4 h-4 text-gray-500" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-4 h-4 text-gray-500" />
          ) : (
            <Moon className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>

        <UserMenu />
      </div>
    </nav>
  );
}
