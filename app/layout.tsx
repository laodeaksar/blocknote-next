import type { Metadata, Viewport } from "next";
import { ConvexClientProvider } from "@/lib/convex";
import { Toaster } from "sonner";
import { ServiceWorkerRegister } from "@/app/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "A Notion-like collaborative editor built with BlockNote",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Notion Clone",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
