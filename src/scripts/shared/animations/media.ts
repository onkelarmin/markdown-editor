import { customProp } from "@shared/utils/helper";

export const MEDIA = {
  isMobileP: `(max-width: ${customProp("--bp-small")})`,
  isMobileL: `(min-width: ${customProp("--bp-small")})`,
  isTablet: `(min-width: ${customProp("--bp-medium")})`,
  isDesktop: `(min-width: ${customProp("--bp-large")})`,
  reduceMotion: "(prefers-reduced-motion: reduce)",
} as const;
