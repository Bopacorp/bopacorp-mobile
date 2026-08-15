import { useTheme } from "../context/ThemeContext";

export function useColorScheme() {
  try {
    const { colorScheme } = useTheme();
    return colorScheme;
  } catch (_e) {
    return "light";
  }
}
