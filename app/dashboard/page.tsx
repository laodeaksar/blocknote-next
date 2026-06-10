import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { FileText, Plus } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("better-auth.session_token")) redirect("/sign-in");

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <FileText className="w-16 h-16 text-gray-200" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome to your workspace
          </h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Select a page from the sidebar or create a new one to get started.
          </p>
          <p className="text-xs text-gray-300 flex items-center justify-center gap-1">
            <Plus className="w-3 h-3" /> Click the + icon in the sidebar to
            create a new page
          </p>
        </div>
      </main>
    </div>
  );
}
