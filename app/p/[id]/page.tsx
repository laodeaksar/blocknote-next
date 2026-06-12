import { EditorWrapper } from "@/components/editor-wrapper";
import type { Id } from "@/convex/_generated/dataModel";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function PublicPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 h-11 flex items-center justify-between px-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">N</span>
          </div>
          <span className="text-xs text-gray-500">Public page</span>
        </div>
        <Link
          href="/sign-in"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100"
        >
          <ExternalLink className="w-3 h-3" />
          Open in app
        </Link>
      </header>

      <main className="max-w-4xl mx-auto py-16 pl-14 pr-4 md:px-16">
        <EditorWrapper pageId={id as Id<"pages">} editable={false} />
      </main>
    </div>
  );
}
