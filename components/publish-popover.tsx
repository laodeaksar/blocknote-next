"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Globe, Lock, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PublishPopoverProps {
  pageId: Id<"pages">;
  isPublished: boolean;
  onClose: () => void;
}

export function PublishPopover({
  pageId,
  isPublished,
  onClose,
}: PublishPopoverProps) {
  const updatePage = useMutation(api.pages.update);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${pageId}`
      : `/p/${pageId}`;

  const handleToggle = async () => {
    setLoading(true);
    try {
      await updatePage({ id: pageId, isPublished: !isPublished });
      toast.success(isPublished ? "Page unpublished" : "Page published to web!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-72 p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isPublished
              ? "bg-emerald-100 text-emerald-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isPublished ? (
            <Globe className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {isPublished ? "Published to web" : "Private page"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {isPublished
              ? "Anyone with the link can view this page."
              : "Only you can see this page."}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
          isPublished
            ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
            : "bg-gray-900 hover:bg-gray-700 text-white"
        } disabled:opacity-50`}
      >
        {loading
          ? "Saving..."
          : isPublished
            ? "Unpublish"
            : "Publish to web"}
      </button>

      {isPublished && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 truncate flex-1 font-mono">
              {publicUrl}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500" />
              )}
            </button>
          </div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open public page
          </a>
        </div>
      )}
    </div>
  );
}
