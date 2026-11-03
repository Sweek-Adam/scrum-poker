export const THEME_KEY = "scrum-poker:theme";

export type Theme = "light" | "dark";

/**
 * Runs synchronously in <head>, before the first paint, so a pinned theme never
 * flashes the other one. Without a stored choice it does nothing and the CSS
 * `prefers-color-scheme` query decides — which is also why this is safe to ship
 * on a statically prerendered page.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

/** The DOM is the source of truth: the inline script or the OS already decided. */
export function currentTheme(): Theme {
  const pinned = document.documentElement.getAttribute("data-theme");
  if (pinned === "light" || pinned === "dark") return pinned;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
