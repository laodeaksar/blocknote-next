"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MoreHorizontal, Star, Share2, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { UserMenu } from "@/components/user-menu";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <nav className="h-12 flex items-center px-4 border-b border-border bg-background">
        <Skeleton className="h-4 w-32" />
      </nav>
    );
  }

  const handlePublish = async () => {
    await updatePage({ id: pageId, isPublished: !page.isPublished });
    toast.success(page.isPublished ? "Page unpublished" : "Page published!");
  };

  return (
    <TooltipProvider delay={400}>
      <nav className="h-12 flex items-center justify-between px-4 border-b border-border bg-background">
        <div className="flex items-center gap-2 min-w-0">
          {page.icon && <span className="text-sm">{page.icon}</span>}
          <span className="text-sm font-medium text-foreground truncate">
            {page.title || "Untitled"}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePublish}
            className="gap-1.5 text-xs h-7"
          >
            <Share2 className="w-3 h-3" />
            {page.isPublished ? "Unpublish" : "Share"}
          </Button>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Favourite" />
              }
            >
              <Star className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>Favourite</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                />
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="More options"
                />
              }
            >
              <MoreHorizontal className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>More options</TooltipContent>
          </Tooltip>

          <UserMenu />
        </div>
      </nav>
    </TooltipProvider>
  );
}
