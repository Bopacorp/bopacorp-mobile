import { useTheme } from "../context/ThemeContext";

export function useColorScheme() {
  try {
    const { colorScheme } = useTheme();
    return colorScheme;
  } catch (e) {
    return "light";
  }
}
