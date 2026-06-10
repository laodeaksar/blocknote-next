import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("better-auth.session_token");
  if (hasSession) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">N</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Notion Clone
            </h1>
          </div>
          <p className="text-xl text-gray-500 max-w-lg mx-auto">
            The connected workspace where better, faster work happens. Write,
            plan, and get organized.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Log in
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 text-left">
          {[
            {
              icon: "✏️",
              title: "Rich text editing",
              desc: "Powered by BlockNote with slash commands, markdown, and more.",
            },
            {
              icon: "📁",
              title: "Organized pages",
              desc: "Create, archive and manage your documents in a sidebar.",
            },
            {
              icon: "☁️",
              title: "Real-time sync",
              desc: "All changes sync instantly with Convex backend.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
