import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboardScreen() {
  const { setRole } = useAuth(); // Para poder cerrar sesión o cambiar vista

  const [stats] = useState({
    totalClients: 156,
    activeProjects: 23,
    monthlyRevenue: 125000,
    pendingTasks: 12,
  });

  const adminActions = [
    {
      id: 1,
      title: "Gestión de Usuarios",
      subtitle: "Administrar asesores y permisos",
      icon: "users",
      color: "#2196f3",
      action: () => router.push("/users" as any), // Usamos Expo Router
    },
    {
      id: 2,
      title: "Reportes y Analytics",
      subtitle: "Ver estadísticas y reportes",
      icon: "bar-chart",
      color: "#4caf50",
      action: () => Alert.alert("Reportes", "Funcionalidad en desarrollo"),
    },
    {
      id: 3,
      title: "Gestión de Servicios",
      subtitle: "Administrar catálogo de servicios",
      icon: "archive",
      color: "#ff9800",
      action: () => router.push("/admin-catalog" as any), // Usamos Expo Router
    },
    {
      id: 4,
      title: "Base de Datos",
      subtitle: "Gestión de datos y backups",
      icon: "database",
      color: "#9c27b0",
      action: () => Alert.alert("Base de Datos", "Funcionalidad en desarrollo"),
    },
  ];

  const quickStats = [
    {
      label: "Clientes Totales",
      value: stats.totalClients,
      icon: "building-o",
      color: "#2196f3",
    },
    {
      label: "Proyectos Activos",
      value: stats.activeProjects,
      icon: "briefcase",
      color: "#4caf50",
    },
    {
      label: "Ingresos Mensuales",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: "dollar",
      color: "#ff9800",
    },
    {
      label: "Tareas Pendientes",
      value: stats.pendingTasks,
      icon: "clock-o",
      color: "#f44336",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* GREETING SECTION */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Hola, Admin</Text>
        <Text style={styles.greetingSubtitle}>BOPACORPSA - Administración</Text>
      </View>

      {/* QUICK STATS */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <FontAwesome name={stat.icon as any} size={20} color="#fff" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ADMIN ACTIONS */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Acciones Administrativas</Text>
        {adminActions.map((action) => (
          <Pressable
            key={action.id}
            style={[styles.actionCard, { borderLeftColor: action.color }]}
            onPress={action.action}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: action.color }]}
            >
              <FontAwesome name={action.icon as any} size={18} color="#fff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color="#B0B0B0" />
          </Pressable>
        ))}
      </View>

      {/* SYSTEM STATUS */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Estado del Sistema</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <FontAwesome name="check-circle" size={18} color="#4caf50" />
            <Text style={styles.statusTitle}>Sistema Operativo</Text>
          </View>
          <Text style={styles.statusText}>
            Todos los servicios funcionando correctamente
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <FontAwesome
              name="exclamation-triangle"
              size={18}
              color="#ff9800"
            />
            <Text style={styles.statusTitle}>Última Copia de Seguridad</Text>
          </View>
          <Text style={styles.statusText}>
            Hace 2 horas - 15/01/2026 10:30 AM
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <FontAwesome name="info-circle" size={18} color="#2196f3" />
            <Text style={styles.statusTitle}>Versión del Sistema</Text>
          </View>
          <Text style={styles.statusText}>
            v2.1.4 - Última actualización: 12/01/2026
          </Text>
        </View>
      </View>

      {/* QUICK ACCESS */}
      <View style={styles.quickAccessSection}>
        <Text style={styles.sectionTitle}>Acceso Rápido</Text>
        <View style={styles.quickAccessGrid}>
          <Pressable
            style={styles.quickAccessButton}
            onPress={() => {
              setRole("Asesor");
            }}
          >
            <FontAwesome name="exchange" size={24} color="#ff9800" />
            <Text style={styles.quickAccessText}>Vista Asesor</Text>
          </Pressable>

          <Pressable style={styles.quickAccessButton}>
            <FontAwesome name="bell" size={24} color="#4caf50" />
            <Text style={styles.quickAccessText}>Notificaciones</Text>
          </Pressable>

          <Pressable style={styles.quickAccessButton}>
            <FontAwesome name="life-ring" size={24} color="#2196f3" />
            <Text style={styles.quickAccessText}>Soporte</Text>
          </Pressable>

          <Pressable
            style={styles.quickAccessButton}
            onPress={() => {
              setRole(null);
            }}
          >
            <FontAwesome name="sign-out" size={24} color="#f44336" />
            <Text style={styles.quickAccessText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  greetingSection: {
    marginBottom: 24,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  greetingSubtitle: {
    fontSize: 15,
    color: "#ff9800",
    marginTop: 4,
    fontWeight: "600",
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "47%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  statusSection: {
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  statusText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 26,
  },
  quickAccessSection: {
    marginBottom: 20,
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAccessButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "47%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickAccessText: {
    fontSize: 13,
    color: "#333",
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },
});
