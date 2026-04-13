/**
 * UM Design System — единые токены из High-fidelity reference.
 * Импортируй COLORS / RADIUS / SHADOWS во все компоненты.
 */

export const COLORS = {
  // Core palette
  primary: "#6200EE",
  secondary: "#b794f6",
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
  gradientFrom: "#6200EE",
  gradientTo: "#b794f6",
};

export const RADIUS = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  full: 9999,
};

export const SHADOWS = {
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
