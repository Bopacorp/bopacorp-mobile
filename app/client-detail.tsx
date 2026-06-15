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
  const c = JSON.parse(client as string);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Cliente - BOPACORPSA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.companyName}>{c.companyName}</Text>
          <Text style={styles.status}>{c.status}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btn, styles.callBtn]}
              onPress={() => Linking.openURL(`tel:${c.phone}`)}
            >
              <MaterialIcons name="phone" size={16} color="white" />
              <Text style={styles.btnText}> Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.emailBtn]}
              onPress={() => Linking.openURL(`mailto:${c.email}`)}
            >
              <MaterialIcons name="email" size={16} color="white" />
              <Text style={styles.btnText}> Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.editBtn]}>
              <MaterialIcons name="edit" size={16} color="white" />
              <Text style={styles.btnText}> Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Información del Cliente</Text>
        <View style={styles.card}>
          <Text style={styles.label}>NOMBRE DE CONTACTO</Text>
          <Text style={styles.value}>{c.contactName}</Text>
          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <Text style={styles.value}>{c.email}</Text>
          <Text style={styles.label}>TELÉFONO</Text>
          <Text style={styles.value}>{c.phone}</Text>
          <Text style={styles.label}>DIRECCIÓN</Text>
          <Text style={styles.value}>{c.address}</Text>
        </View>

        <Text style={styles.sectionTitle}>Plan de Negocio</Text>
        <View style={styles.planCard}>
          <Text style={styles.planName}>Bussiness Gold Plan Mov</Text>
          <Text style={styles.planPrice}>14.99 + Iva c/línea</Text>
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
  },
  companyName: { fontSize: 20, fontWeight: "bold" },
  status: { color: "#1976d2", marginBottom: 15 },
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
  editBtn: { backgroundColor: "#1976d2" },
  btnText: { color: "#fff", marginLeft: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  label: { fontSize: 11, color: "#888", marginTop: 10 },
  value: { fontSize: 15, fontWeight: "500" },
  planCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#1976d2",
  },
  planName: { fontSize: 16, fontWeight: "bold" },
  planPrice: { marginTop: 5 },
});
