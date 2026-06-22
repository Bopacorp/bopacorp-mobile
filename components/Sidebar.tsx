import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation, usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import { useAuth } from "../context/AuthContext";
import { useSidebarContext } from "../context/SidebarContext";
import { useColorScheme } from "./useColorScheme";

const DRAWER_WIDTH = 260;

interface SidebarProps {
  slideAnim: Animated.Value;
}

export default function Sidebar({ slideAnim }: SidebarProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { isOpen, setIsOpen } = useSidebarContext();

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [-DRAWER_WIDTH, 0],
    outputRange: [0, 0.4],
    extrapolate: "clamp",
  });

  const menuItems = [
    {
      name: "Clientes",
      icon: "building" as const,
      path: "/clients",
      target: "/(tabs)/clients" as const,
    },
    {
      name: "Negociaciones",
      icon: "handshake-o" as const,
      path: "/negotiations",
      target: "/(tabs)/negotiations" as const,
    },
    {
      name: "Documentación",
      icon: "file-text-o" as const,
      path: "/documentation",
      target: "/(tabs)/documentation" as const,
    },
    {
      name: "Configuración",
      icon: "cog" as const,
      path: "/settings",
      target: "/(tabs)/settings" as const,
    },
  ];

  const handleNavigate = (target: string) => {
    setIsOpen(false);
    router.replace(target as any);
  };

  const handleLogoutPress = async () => {
    try {
      setIsOpen(false);
      await logout();
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "login" }],
      });
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const getInitials = () => {
    if (user?.profile) {
      const first = user.profile.firstName?.[0] || "";
      const last = user.profile.lastName?.[0] || "";
      return (first + last).toUpperCase();
    }
    return user?.username?.slice(0, 2).toUpperCase() || "AS";
  };

  return (
    <>
      {}
      <Pressable
        pointerEvents={isOpen ? "auto" : "none"}
        style={StyleSheet.absoluteFillObject}
        onPress={() => setIsOpen(false)}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </Pressable>

      {}
      <Animated.View
        style={[
          styles.sidebar,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: slideAnim }],
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
            paddingTop: insets.top || 16,
            paddingBottom: insets.bottom || 16,
          },
        ]}
      >
        {}
        <View style={styles.header}>
          <View style={styles.expandedHeader}>
            <View style={styles.headerRow}>
              <View
                style={[
                  styles.logoIconBg,
                  { backgroundColor: currentColors.primary },
                ]}
              >
                <Text style={styles.logoIconText}>B</Text>
              </View>
              <View style={styles.headerTitles}>
                <Text style={[styles.brandText, { color: currentColors.text }]}>
                  BOPACORP
                </Text>
                <Text
                  style={[
                    styles.subBrandText,
                    { color: currentColors.primary },
                  ]}
                >
                  Partner Movistar
                </Text>
              </View>
            </View>
          </View>
        </View>

        {}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.menuContainer}>
            {menuItems.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path === "/" && pathname === "/index") ||
                (item.path !== "/" && pathname?.startsWith(item.path));

              const activeBg =
                colorScheme === "dark"
                  ? "rgba(0, 127, 206, 0.15)"
                  : "rgba(19, 163, 236, 0.12)";

              return (
                <Pressable
                  key={item.path}
                  onPress={() => handleNavigate(item.target)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    isActive && { backgroundColor: activeBg },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  {}
                  {isActive && (
                    <View
                      style={[
                        styles.activeIndicator,
                        { backgroundColor: currentColors.primary },
                      ]}
                    />
                  )}

                  <View style={styles.iconContainer}>
                    <FontAwesome
                      name={item.icon}
                      size={20}
                      color={
                        isActive
                          ? currentColors.primary
                          : currentColors.tabIconDefault
                      }
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.menuText,
                      {
                        color: isActive
                          ? currentColors.text
                          : currentColors.mutedForeground,
                        fontWeight: isActive ? "700" : "500",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {}
        <View style={styles.footer}>
          {}
          <View
            style={[
              styles.profileContainer,
              { borderTopColor: currentColors.border },
            ]}
          >
            <View
              style={[
                styles.avatar,
                { backgroundColor: currentColors.secondary },
              ]}
            >
              <Text style={[styles.avatarText, { color: currentColors.text }]}>
                {getInitials()}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <Text
                numberOfLines={1}
                style={[styles.profileName, { color: currentColors.text }]}
              >
                {user?.profile
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user?.username || "Asesor"}
              </Text>
              <Text numberOfLines={1} style={styles.profileRole}>
                Asesor Comercial
              </Text>
            </View>
          </View>

          {}
          <Pressable
            onPress={() => setIsOpen(false)}
            style={({ pressed }) => [
              styles.footerItem,
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={styles.iconContainer}>
              <FontAwesome
                name="times"
                size={16}
                color={currentColors.tabIconDefault}
              />
            </View>
            <Text
              style={[
                styles.footerText,
                { color: currentColors.mutedForeground },
              ]}
            >
              Cerrar Menú
            </Text>
          </Pressable>

          {}
          <Pressable
            onPress={handleLogoutPress}
            style={({ pressed }) => [
              styles.footerItem,
              styles.logoutItem,
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={styles.iconContainer}>
              <FontAwesome name="sign-out" size={18} color="#f44336" />
            </View>
            <Text
              style={[
                styles.footerText,
                { color: "#f44336", fontWeight: "600" },
              ]}
            >
              Cerrar Sesión
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    zIndex: 99,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    height: "100%",
    zIndex: 100,
    borderRightWidth: 1,
    display: "flex",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    height: 64,
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  expandedHeader: {
    alignItems: "flex-start",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitles: {
    marginLeft: 12,
  },
  brandText: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  subBrandText: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 1,
  },
  logoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
  },
  menuContainer: {
    paddingHorizontal: 8,
    gap: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    position: "relative",
    overflow: "hidden",
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconContainer: {
    width: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    marginLeft: 12,
    fontSize: 14,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 8,
    gap: 4,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profileDetails: {
    marginLeft: 10,
    flex: 1,
  },
  profileName: {
    fontSize: 13,
    fontWeight: "600",
  },
  profileRole: {
    fontSize: 10,
    color: "#8e8e8e",
    marginTop: 1,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  logoutItem: {
    marginTop: 4,
  },
  footerText: {
    marginLeft: 12,
    fontSize: 13,
  },
});
