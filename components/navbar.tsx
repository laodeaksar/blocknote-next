"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvex } from "convex/react";
import type { FunctionArgs } from "convex/server";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MoreHorizontal, Star, Share2 } from "lucide-react";
import { toast } from "sonner";
import { UserMenu } from "@/components/user-menu";
import { PublishPopover } from "@/components/publish-popover";

interface NavbarProps {
  pageId: Id<"pages">;
}

export function Navbar({ pageId }: NavbarProps) {
  const convex = useConvex();
  const { data: page } = useQuery(convexQuery(api.pages.get, { id: pageId }));
  const { mutateAsync: updatePage } = useMutation({
    mutationFn: (vars: FunctionArgs<typeof api.pages.update>) =>
      convex.mutation(api.pages.update, vars),
    onError: () => toast.error("Failed to update page"),
  });

  const [showPublish, setShowPublish] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPublish(false);
      }
    }
    if (showPublish) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPublish]);

  if (!page) {
    return (
      <nav className="h-12 flex items-center px-4 border-b border-gray-100 bg-white">
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      </nav>
    );
  }

  return (
    <nav className="h-12 flex items-center justify-between px-4 border-b border-gray-100 bg-white relative">
      <div className="flex items-center gap-2 min-w-0">
        {page.icon && <span className="text-sm">{page.icon}</span>}
        <span className="text-sm font-medium text-gray-700 truncate">
          {page.title || "Untitled"}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowPublish((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              page.isPublished
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Share2 className="w-3 h-3" />
            {page.isPublished ? "Published" : "Share"}
          </button>

          {showPublish && (
            <div
              ref={popoverRef}
              className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-xl"
            >
              <PublishPopover
                pageId={pageId}
                isPublished={page.isPublished ?? false}
                onClose={() => setShowPublish(false)}
              />
            </div>
          )}
        </div>

        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Star className="w-4 h-4 text-gray-500" />
        </button>

        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>

        <UserMenu />
      </div>
    </nav>
  );
}
