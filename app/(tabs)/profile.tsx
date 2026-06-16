import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={80} color="#1976D2" />
        </View>
        <Text style={styles.nameText}>Alejandro Pérez</Text>
        <Text style={styles.emailText}>alejandro.perez@bopacorpsa.com</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Asesor</Text>
        </View>
        <Text style={styles.agencyText}>📍 Quito - Shyris</Text>
      </View>

      <Text style={styles.sectionTitle}>Mis Logros del Mes</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <FontAwesome name="handshake-o" size={24} color="#2196F3" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Ventas</Text>
        </View>
        <View style={styles.statBox}>
          <FontAwesome name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Efectividad</Text>
        </View>
        <View style={styles.statBox}>
          <FontAwesome name="dollar" size={24} color="#FF9800" />
          <Text style={styles.statNumber}>$4,250</Text>
          <Text style={styles.statLabel}>Facturación</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Opciones</Text>
      <View style={styles.menuContainer}>
        <Pressable style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: "#E3F2FD" }]}>
            <FontAwesome name="pencil" size={18} color="#1976D2" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuTitle}>Editar Perfil</Text>
            <Text style={styles.menuSubtitle}>
              Actualizar información personal
            </Text>
          </View>
          <FontAwesome name="angle-right" size={20} color="#B0B0B0" />
        </Pressable>
        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: "#FFF3E0" }]}>
            <FontAwesome name="bell-o" size={18} color="#FF9800" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuTitle}>Notificaciones</Text>
            <Text style={styles.menuSubtitle}>Ajustes de alertas y avisos</Text>
          </View>
          <FontAwesome name="angle-right" size={20} color="#B0B0B0" />
        </Pressable>
        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: "#E8F5E9" }]}>
            <FontAwesome name="shield" size={18} color="#4CAF50" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuTitle}>Seguridad y PIN</Text>
            <Text style={styles.menuSubtitle}>
              Actualizar credenciales de acceso
            </Text>
          </View>
          <FontAwesome name="angle-right" size={20} color="#B0B0B0" />
        </Pressable>
        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: "#F3E5F5" }]}>
            <FontAwesome name="question-circle-o" size={18} color="#9C27B0" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuTitle}>Soporte y Ayuda</Text>
            <Text style={styles.menuSubtitle}>Centro de ayuda y contacto</Text>
          </View>
          <FontAwesome name="angle-right" size={20} color="#B0B0B0" />
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <FontAwesome
            name="info-circle"
            size={16}
            color="#9E9E9E"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>BOPADIGITAL Móvil v1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome
            name="building-o"
            size={16}
            color="#9E9E9E"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>BOPACORPSA CRM</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome
            name="calendar-check-o"
            size={16}
            color="#9E9E9E"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>Miembro desde 15/01/2026</Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome
          name="sign-out"
          size={18}
          color="#F44336"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  emailText: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  agencyText: {
    fontSize: 13,
    color: "#757575",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: 30,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
    color: "#333",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 72,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoIcon: {
    width: 24,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  logoutText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "bold",
  },
});
