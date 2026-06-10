import type { Metadata } from "next";
import { ConvexClientProvider } from "@/lib/convex";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "A Notion-like collaborative editor built with BlockNote",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConvexClientProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
