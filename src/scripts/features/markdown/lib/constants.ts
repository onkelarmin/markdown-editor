const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export function isTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value);
}

export const themeStorageKey = "theme-preference";
