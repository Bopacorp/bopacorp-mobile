import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ClientsScreen() {
  const router = useRouter();
  const [clients] = useState([
    {
      id: "1",
      companyName: "Logística Costera (LogiCost)",
      status: "Cliente lucrativo",
      contactName: "Juan Vélez",
      email: "jcvelez@logicost.ec",
      phone: "+593 98 123 4567",
      address: "Av. Principal 123",
    },
    {
      id: "2",
      companyName: "Andres Carros Inc.",
      status: "Cliente lucrativo",
      contactName: "Adalina Medina",
      email: "portabilidadCAI@gmail.com",
      phone: "+593 99 234 5678",
      address: "Calle Secundaria 456",
    },
    {
      id: "3",
      companyName: "Sapitos Corp.",
      status: "Cliente lucrativo",
      contactName: "José B.",
      email: "jose@sapitoscorp.com",
      phone: "+593 97 345 6789",
      address: "Calle Terciaria 789",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Clientes</Text>
        <TouchableOpacity onPress={() => router.push("/new-client")}>
          <MaterialIcons name="person-add" size={24} color="#1976d2" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <TextInput style={styles.searchBar} placeholder="Buscar clientes..." />

      {/* Botón Nuevo Usuario */}
      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => router.push("/new-client")}
      >
        <MaterialIcons name="person-add" size={16} color="#4caf50" />
        <Text style={styles.newBtnText}> Nuevo Usuario</Text>
      </TouchableOpacity>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterActive}>
          <Text style={styles.filterActiveText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterInactive}>
          <Text style={styles.filterInactiveText}>Activos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/client-detail",
                params: { client: JSON.stringify(item) },
              })
            }
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{item.companyName}</Text>
                <Text style={styles.cardSubtitle}>{item.status}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editBtn}>
                  <Text style={styles.editBtnText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delBtn}>
                  <Text style={styles.delBtnText}>🗑 Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.label}>Nombre de Contacto:</Text>
            <Text style={styles.value}>{item.contactName}</Text>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  searchBar: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  newBtnText: { color: "#4caf50", fontWeight: "bold" },
  filterContainer: { flexDirection: "row", gap: 10, marginBottom: 15 },
  filterActive: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterActiveText: { color: "#fff" },
  filterInactive: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterInactiveText: { color: "#999" },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { color: "#666", marginBottom: 5 },
  actionButtons: { flexDirection: "row", gap: 5 },
  editBtn: { backgroundColor: "#fff8e1", padding: 5, borderRadius: 4 },
  editBtnText: { color: "#f57c00", fontSize: 12 },
  delBtn: { backgroundColor: "#ffebee", padding: 5, borderRadius: 4 },
  delBtnText: { color: "#d32f2f", fontSize: 12 },
  label: { fontSize: 12, color: "#999", marginTop: 5 },
  value: { fontSize: 14, fontWeight: "500" },
});
