import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  View as RNView,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { role, setRole } = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const handleLogout = () => {
    alert("Sesión cerrada correctamente.");
    router.replace("../login");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Profile Info */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: currentColors.secondary },
          ]}
        >
          <FontAwesome
            name="user-circle-o"
            size={64}
            color={currentColors.primary}
          />
        </View>
        <Text style={[styles.advisorName, { color: currentColors.text }]}>
          Alejandro Pérez
        </Text>
        <Text
          style={[styles.advisorRole, { color: currentColors.mutedForeground }]}
        >
          Asesor Comercial Pyme
        </Text>
        <View style={styles.agencyBadge}>
          <FontAwesome
            name="map-marker"
            size={12}
            color={currentColors.primary}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.agencyText, { color: currentColors.primary }]}>
            Quito - Shyris
          </Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <Text>Tu rol actual es: {role}</Text>
        <Pressable
          onPress={() => setRole(role === "Admin" ? "Asesor" : "Admin")}
          style={{
            padding: 15,
            backgroundColor: "#2196F3",
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Cambiar a {role === "Admin" ? "Asesor" : "Admin"}
          </Text>
        </Pressable>
      </View>

      {/* KPI Cards section */}
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        Mis Logros del Mes
      </Text>
      <View style={styles.kpiContainer}>
        <View
          style={[
            styles.kpiCard,
            {
              backgroundColor: currentColors.card,
              borderColor: currentColors.border,
            },
          ]}
        >
          <Text style={[styles.kpiValue, { color: currentColors.primary }]}>
            12
          </Text>
          <Text
            style={[styles.kpiLabel, { color: currentColors.mutedForeground }]}
          >
            Ventas
          </Text>
        </View>
        <View
          style={[
            styles.kpiCard,
            {
              backgroundColor: currentColors.card,
              borderColor: currentColors.border,
            },
          ]}
        >
          <Text style={[styles.kpiValue, { color: "#0ca678" }]}>85%</Text>
          <Text
            style={[styles.kpiLabel, { color: currentColors.mutedForeground }]}
          >
            Efectividad
          </Text>
        </View>
        <View
          style={[
            styles.kpiCard,
            {
              backgroundColor: currentColors.card,
              borderColor: currentColors.border,
            },
          ]}
        >
          <Text style={[styles.kpiValue, { color: "#f08c00" }]}>$4,250</Text>
          <Text
            style={[styles.kpiLabel, { color: currentColors.mutedForeground }]}
          >
            Facturación
          </Text>
        </View>
      </View>

      {/* Action Options */}
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        Opciones
      </Text>
      <View
        style={[
          styles.optionsGroup,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <Pressable style={styles.optionRow}>
          <RNView style={styles.optionLeft}>
            <FontAwesome
              name="bell-o"
              size={18}
              color={currentColors.primary}
              style={{ marginRight: 12 }}
            />
            <Text style={[styles.optionText, { color: currentColors.text }]}>
              Notificaciones
            </Text>
          </RNView>
          <FontAwesome
            name="angle-right"
            size={18}
            color={currentColors.mutedForeground}
          />
        </Pressable>

        <View
          style={[styles.rowDivider, { backgroundColor: currentColors.border }]}
        />

        <Pressable style={styles.optionRow}>
          <RNView style={styles.optionLeft}>
            <FontAwesome
              name="shield"
              size={18}
              color={currentColors.primary}
              style={{ marginRight: 12 }}
            />
            <Text style={[styles.optionText, { color: currentColors.text }]}>
              Seguridad y PIN
            </Text>
          </RNView>
          <FontAwesome
            name="angle-right"
            size={18}
            color={currentColors.mutedForeground}
          />
        </Pressable>

        <View
          style={[styles.rowDivider, { backgroundColor: currentColors.border }]}
        />

        <Pressable style={styles.optionRow}>
          <RNView style={styles.optionLeft}>
            <FontAwesome
              name="question-circle-o"
              size={18}
              color={currentColors.primary}
              style={{ marginRight: 12 }}
            />
            <Text style={[styles.optionText, { color: currentColors.text }]}>
              Soporte y Ayuda
            </Text>
          </RNView>
          <FontAwesome
            name="angle-right"
            size={18}
            color={currentColors.mutedForeground}
          />
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable
        onPress={handleLogout}
        style={[styles.logoutButton, { borderColor: "#d6336c" }]}
      >
        <FontAwesome
          name="sign-out"
          size={18}
          color="#d6336c"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </Pressable>

      <Text
        style={[styles.appVersion, { color: currentColors.mutedForeground }]}
      >
        BOPADIGITAL Móvil v1.0.0 (SDK 54)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  advisorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  advisorRole: {
    fontSize: 14,
    marginBottom: 12,
  },
  agencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  agencyText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
  },
  kpiContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
  },
  optionsGroup: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  optionText: {
    fontSize: 14,
  },
  rowDivider: {
    height: 1,
  },
  logoutButton: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoutText: {
    color: "#d6336c",
    fontSize: 14,
    fontWeight: "bold",
  },
  appVersion: {
    fontSize: 11,
    textAlign: "center",
  },
});
