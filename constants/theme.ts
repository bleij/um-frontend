/**
 * UM Design System — единые токены из High-fidelity reference.
 * Импортируй COLORS / RADIUS / SHADOWS во все компоненты.
 */

import { Platform } from "react-native";

export const COLORS = {
  // Core palette
  primary: "#6C5CE7",
  secondary: "#8B7FE8",
  accent: "#FFD700",

  // Backgrounds
  background: "#ffffff",
  card: "#ffffff",
  muted: "#f5f5f7",

  // Text
  foreground: "#1a1a2e",
  mutedForeground: "#6b7280",

  // Borders
  border: "rgba(0,0,0,0.08)",

  // Status
  destructive: "#ef4444",
  success: "#22c55e",

  // Gradients
  gradientFrom: "#6C5CE7",
  gradientTo: "#8B7FE8",
};

export const RADIUS = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  full: 9999,
};

const WEB_SHADOWS = {
  sm: {
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
  },
  md: {
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.06)",
  },
  lg: {
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)",
  },
};

const NATIVE_SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

export const SHADOWS = Platform.OS === "web" ? WEB_SHADOWS : NATIVE_SHADOWS;

export const LAYOUT = {
  desktopBreakpoint: 1024,
  authMaxWidth: 520,
  authHorizontalPaddingMobile: 24,
  authHorizontalPaddingDesktop: 32,
  profileFormMaxWidth: 960,
  profileHorizontalPaddingMobile: 16,
  profileHorizontalPaddingDesktop: 32,
  dashboardMaxWidth: 1200,
  dashboardHorizontalPaddingMobile: 16,
  dashboardHorizontalPaddingDesktop: 32,
  sideNavWidth: 240,
};
