import type { Metadata, Viewport } from "next";
import { ConvexClientProvider } from "@/lib/convex";
import { Toaster } from "sonner";
import { ServiceWorkerRegister } from "@/app/sw-register";
import { SplashScreen } from "@/app/splash-screen";
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
    startupImage: [
      {
        url: "/splash/iphone-14-pro-max.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/iphone-14-pro.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/iphone-14.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/iphone-x.png",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/iphone-xr.png",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/iphone-8.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/ipad-pro-12.png",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/ipad-pro-11.png",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #app-splash {
                position: fixed;
                inset: 0;
                z-index: 9999;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 20px;
              }
              #app-splash svg {
                width: 80px;
                height: 80px;
                animation: splash-pulse 1.2s ease-in-out infinite;
              }
              #app-splash p {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                font-size: 22px;
                font-weight: 600;
                color: #111;
                margin: 0;
                letter-spacing: -0.3px;
              }
              @keyframes splash-pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(0.95); }
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <div id="app-splash" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none">
            <path d="m297.49998,89.75001l0,0c46.9,0 85,38.1 85,85l0,250.5c0,46.9 -38.1,85 -85,85l0,0c-46.9,0 -85,-38.1 -85,-85l0,-250.5c0,-47 38,-85 85,-85z" strokeMiterlimit="10" strokeWidth="20" stroke="#000000" />
            <path d="m368.69998,198.15001l-149.3,262.2c-22.4,39.4 -74.9,58.2 -117.2,42c-42.3,-16.2 -58.4,-61.2 -36,-100.5l149.3,-262.2c22.4,-39.4 74.9,-58.2 117.2,-42s58.4,61.1 36,100.5z" strokeMiterlimit="10" strokeWidth="30" stroke="#000000" />
            <path d="m267.29998,97.65001c42.3,-16.2 94.8,2.6 117.2,42l149.3,262.2c22.4,39.4 6.3,84.4 -36,100.5c-42.3,16.2 -94.8,-2.6 -117.2,-42l-149.4,-262.2c-22.4,-39.4 -6.3,-84.4 36.1,-100.5z" strokeMiterlimit="10" strokeWidth="30" stroke="#000000" />
          </svg>
          <p>Notion Clone</p>
        </div>

        <ConvexClientProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ConvexClientProvider>
        <SplashScreen />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
