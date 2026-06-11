"use client";

import { useEffect } from "react";

export function SplashScreen() {
  useEffect(() => {
    const el = document.getElementById("app-splash");
    if (!el) return;
    el.style.opacity = "0";
    el.style.transition = "opacity 0.4s ease";
    const timer = setTimeout(() => el.remove(), 450);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
