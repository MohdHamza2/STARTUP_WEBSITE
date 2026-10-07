/**
 * Light / dark theme (owner, 2026-10-07).
 *
 * The theme is `data-theme` on <html>, which re-points the colour roles in
 * globals.css. The visitor's explicit choice is saved under THEME_KEY;
 * without one, the system preference decides and is followed live.
 */
export const THEME_KEY = "genra-theme";

/**
 * Inlined in <head> so the theme is set before first paint: no white flash
 * for a dark-theme visitor. Storage can throw (private mode, blocked site
 * data); light is the fallback.
 */
export const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t}catch(e){d.dataset.theme="light"}})()`;
