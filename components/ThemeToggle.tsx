"use client";

import { useLayoutEffect } from "react";
import { THEME_KEY, currentTheme, storedTheme } from "@/lib/theme";

export function ThemeToggle() {
  // React resets the <html> attributes on the dev-only Strict Mode remount,
  // clearing what the inline script set. Re-applying before paint is a no-op in
  // production. See next/dist/docs 01-app/02-guides/preventing-flash-before-hydration.
  useLayoutEffect(() => {
    const pinned = storedTheme();
    if (pinned) document.documentElement.setAttribute("data-theme", pinned);
  }, []);

  function toggle() {
    const next = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing: the choice holds for this page, just not the next visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-9 place-items-center rounded-full border border-line bg-panel text-fg-muted
        transition hover:border-line-strong hover:text-fg"
    >
      <span className="theme-when-dark">
        <SunIcon />
        <span className="sr-only">Passer au thème clair</span>
      </span>
      <span className="theme-when-light">
        <MoonIcon />
        <span className="sr-only">Passer au thème sombre</span>
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
    </svg>
  );
}
