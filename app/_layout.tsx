import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { AuthProvider, useAuth } from "../context/AuthContext";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

import { ThemeProvider as AppThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Ocultar la pantalla de carga una vez que todo esté listo
    SplashScreen.hideAsync();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = (segments as string[])[0] === "(tabs)";

    const allowedOutsideTabs = ["modal"];
    const currentRoute = (segments as string[])[0];
    
    if (!role && inTabsGroup) {
      router.replace("/");
    } else if (
      role &&
      !inTabsGroup &&
      !allowedOutsideTabs.includes(currentRoute)
    ) {
      router.replace("/(tabs)");
    }
  }, [role, segments, isLoading]);

  const theme =
    colorScheme === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: Colors.dark.primary,
            background: Colors.dark.background,
            card: Colors.dark.card,
            text: Colors.dark.text,
            border: Colors.dark.border,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: Colors.light.primary,
            background: Colors.light.background,
            card: Colors.light.card,
            text: Colors.light.text,
            border: Colors.light.border,
          },
        };

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Información" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
