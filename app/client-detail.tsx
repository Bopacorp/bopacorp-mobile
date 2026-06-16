import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ClientDetailScreen() {
  const router = useRouter();
  const { client } = useLocalSearchParams();
  
  if (!client) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.value}>No se pudo cargar el detalle del cliente.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const c = JSON.parse(client as string);
  
  // Safe extraction of backend fields
  const businessName = c.businessName || "Cliente Sin Nombre";
  const contactName = c.contactName || "Sin contacto registrado";
  const email = c.contactEmail || "N/A";
  const phone = c.contactPhone || "N/A";
  const address = c.address || "Sin dirección registrada";
  const ruc = c.ruc || "N/A";
  const status = c.isActive ? "Activo" : "Inactivo";
  const advisorName = c.advisorName || "Sin asignar";

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Detalle del Cliente</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Main Status Card */}
        <View style={styles.card}>
          <Text style={styles.companyName}>{businessName}</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: c.isActive ? "#4caf50" : "#d32f2f" }]} />
            <Text style={styles.statusText}>{status}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btn, styles.callBtn]}
              onPress={() => {
                if (phone !== "N/A") {
                  Linking.openURL(`tel:${phone}`);
                }
              }}
            >
              <MaterialIcons name="phone" size={16} color="white" />
              <Text style={styles.btnText}> Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.emailBtn]}
              onPress={() => {
                if (email !== "N/A") {
                  Linking.openURL(`mailto:${email}`);
                }
              }}
            >
              <MaterialIcons name="email" size={16} color="white" />
              <Text style={styles.btnText}> Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Client Metadata Info */}
        <Text style={styles.sectionTitle}>Información de Contacto</Text>
        <View style={styles.card}>
          <Text style={styles.label}>RUC / IDENTIFICACIÓN</Text>
          <Text style={styles.value}>{ruc}</Text>

          <Text style={styles.label}>NOMBRE DE CONTACTO</Text>
          <Text style={styles.value}>{contactName}</Text>

          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <Text style={styles.value}>{email}</Text>

          <Text style={styles.label}>TELÉFONO DE CONTACTO</Text>
          <Text style={styles.value}>{phone}</Text>

          <Text style={styles.label}>DIRECCIÓN</Text>
          <Text style={styles.value}>{address}</Text>
        </View>

        {/* Assigned Advisor */}
        <Text style={styles.sectionTitle}>Asignación de Cuentas</Text>
        <View style={styles.planCard}>
          <Text style={styles.label}>ASESOR COMERCIAL</Text>
          <Text style={styles.value}>{advisorName}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1976d2",
  },
  navTitle: { color: "#fff", fontSize: 18, marginLeft: 15, fontWeight: "bold" },
  scroll: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  companyName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: { color: "#666", fontSize: 14, fontWeight: "500" },
  actionRow: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  callBtn: { backgroundColor: "#4caf50" },
  emailBtn: { backgroundColor: "#2196f3" },
  btnText: { color: "#fff", marginLeft: 5, fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10, color: "#555" },
  label: { fontSize: 11, color: "#888", marginTop: 12, fontWeight: "bold" },
  value: { fontSize: 15, fontWeight: "500", color: "#333", marginTop: 2 },
  planCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#1976d2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
