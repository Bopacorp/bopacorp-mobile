import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Switch } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Text, View } from "@/components/Themed";
import Colors from "../../constants/Colors";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useTheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const handleLogout = () => {
    logout();
  };

  const getInitials = () => {
    if (user?.profile) {
      const first = user.profile.firstName?.[0] || "";
      const last = user.profile.lastName?.[0] || "";
      return (first + last).toUpperCase();
    }
    return user?.username?.slice(0, 2).toUpperCase() || "AS";
  };

  const getFullName = () => {
    if (user?.profile) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user?.username || "Asesor Comercial";
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. PROFILE CARD */}
      <View
        style={[
          styles.profileHeader,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={[styles.avatarContainer, { backgroundColor: currentColors.secondary }]}>
          <Text style={[styles.avatarText, { color: currentColors.text }]}>
            {getInitials()}
          </Text>
        </View>
        <Text style={[styles.nameText, { color: currentColors.text }]}>
          {getFullName()}
        </Text>
        <Text style={[styles.emailText, { color: currentColors.mutedForeground }]}>
          {user?.email || "asesor@bopacorp.com"}
        </Text>
        <View style={[styles.roleBadge, { backgroundColor: currentColors.primary }]}>
          <Text style={styles.roleText}>Asesor Comercial</Text>
        </View>
      </View>

      {/* 2. THEME SETTINGS SECTION */}
      <Text style={[styles.sectionTitle, { color: currentColors.mutedForeground }]}>
        Preferencias
      </Text>
      
      <View
        style={[
          styles.menuContainer,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: colorScheme === "dark" ? "rgba(0, 127, 206, 0.15)" : "#E3F2FD" }]}>
            <FontAwesome
              name={colorScheme === "dark" ? "moon-o" : "sun-o"}
              size={18}
              color={currentColors.primary}
            />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={[styles.menuTitle, { color: currentColors.text }]}>Modo Oscuro</Text>
            <Text style={[styles.menuSubtitle, { color: currentColors.mutedForeground }]}>
              Cambiar apariencia de la aplicación
            </Text>
          </View>
          <Switch
            value={colorScheme === "dark"}
            onValueChange={toggleColorScheme}
            trackColor={{ false: "#ccc", true: currentColors.primary }}
            thumbColor={colorScheme === "dark" ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* 3. APPLICATION INFORMATION */}
      <Text style={[styles.sectionTitle, { color: currentColors.mutedForeground }]}>
        Información
      </Text>
      
      <View
        style={[
          styles.menuContainer,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={styles.infoRow}>
          <FontAwesome
            name="info-circle"
            size={16}
            color={currentColors.tabIconDefault}
            style={styles.infoIcon}
          />
          <Text style={[styles.infoText, { color: currentColors.text }]}>
            Versión 1.1.0
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: currentColors.border }]} />
        
        <View style={styles.infoRow}>
          <FontAwesome
            name="building-o"
            size={16}
            color={currentColors.tabIconDefault}
            style={styles.infoIcon}
          />
          <Text style={[styles.infoText, { color: currentColors.text }]}>
            BOPACORPSA CRM Móvil
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: currentColors.border }]} />

        <View style={styles.infoRow}>
          <FontAwesome
            name="server"
            size={14}
            color={currentColors.tabIconDefault}
            style={styles.infoIcon}
          />
          <Text style={[styles.infoText, { color: currentColors.text }]}>
            Servidor: {process.env.EXPO_PUBLIC_API_URL || "Local Dev"}
          </Text>
        </View>
      </View>

      {/* 4. ACTIONS */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome
          name="sign-out"
          size={18}
          color="#F44336"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    marginBottom: 16,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  infoIcon: {
    width: 24,
    textAlign: "center",
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "rgba(244, 67, 54, 0.08)",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.2)",
    marginTop: 8,
  },
  logoutText: {
    color: "#F44336",
    fontSize: 15,
    fontWeight: "bold",
  },
});
