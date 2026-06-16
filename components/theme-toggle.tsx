"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const saveTheme = useMutation(api.users.setMyTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-border bg-background" />
    );
  }

  const toggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    if (session?.user) saveTheme({ theme: next }).catch(() => {});
  };

  const label =
    resolvedTheme === "dark"
      ? "Switch to light mode (Ctrl+Shift+L)"
      : "Switch to dark mode (Ctrl+Shift+L)";

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      aria-label={label}
      title={label}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
