"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export function ThemeShortcut() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const savedTheme = useQuery(api.users.getMyTheme, isLoggedIn ? {} : "skip");
  const saveTheme = useMutation(api.users.setMyTheme);
  const hasApplied = useRef(false);

  useEffect(() => {
    if (savedTheme && !hasApplied.current) {
      hasApplied.current = true;
      setTheme(savedTheme);
    }
  }, [savedTheme, setTheme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        const next = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
        if (isLoggedIn) saveTheme({ theme: next }).catch(() => {});
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resolvedTheme, setTheme, isLoggedIn, saveTheme]);

  return null;
}
