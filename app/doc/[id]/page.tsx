import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import dynamic from "next/dynamic";
import type { Id } from "@/convex/_generated/dataModel";

const Editor = dynamic(
  () => import("@/components/editor").then((m) => m.Editor),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
    </div>
  )}
);

type Props = { params: Promise<{ id: string }> };

export default async function DocPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  if (!cookieStore.has("better-auth.session_token")) redirect("/sign-in");

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar pageId={id as Id<"pages">} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-16 px-8 md:px-16">
            <Editor pageId={id as Id<"pages">} />
          </div>
        </div>
      </div>
    </div>
  );
}
