import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Editor } from "@/components/editor";
import type { Id } from "@/convex/_generated/dataModel";

type Props = { params: Promise<{ id: string }> };

export default async function DocPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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
