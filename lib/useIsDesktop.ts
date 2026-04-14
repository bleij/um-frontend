import { Platform, useWindowDimensions } from "react-native";
import { LAYOUT } from "../constants/theme";

export function useIsDesktop() {
  const { width } = useWindowDimensions();
  return Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
}
