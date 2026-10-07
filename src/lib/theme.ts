/**
 * Light / dark theme (owner, 2026-10-07).
 *
 * The theme is `data-theme` on <html>, which re-points the colour roles in
 * globals.css. Light is the default for every visitor, whatever their system
 * setting (owner, 2026-10-07); dark applies only after the visitor chooses it
 * with the header toggle, which saves the choice under THEME_KEY.
 */
export const THEME_KEY = "genra-theme";

/**
 * Inlined in <head> so a saved dark choice applies before first paint (no
 * flash). Storage can throw (private mode, blocked site data); light is the
 * fallback.
 */
export const themeScript = `(function(){var d=document.documentElement;try{d.dataset.theme=localStorage.getItem("${THEME_KEY}")==="dark"?"dark":"light"}catch(e){d.dataset.theme="light"}})()`;
