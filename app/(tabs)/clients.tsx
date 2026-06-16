import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { getBusinessClients, BusinessClient } from "../../services/ClientServices";

export default function ClientsScreen() {
  const router = useRouter();
  const [clients, setClients] = useState<BusinessClient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Todos" | "Activos">("Todos");
  const [isLoading, setIsLoading] = useState(true);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await getBusinessClients();
      setClients(data);
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((item) => {
    const matchesSearch =
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ruc.includes(searchQuery);

    const matchesFilter =
      activeFilter === "Todos" ||
      (activeFilter === "Activos" && item.isActive);

    return matchesSearch && matchesFilter;
  });

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
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por empresa, contacto o RUC..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Botón Nuevo Usuario */}
      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => router.push("/new-client")}
      >
        <MaterialIcons name="person-add" size={16} color="#4caf50" />
        <Text style={styles.newBtnText}> Nuevo Cliente</Text>
      </TouchableOpacity>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={activeFilter === "Todos" ? styles.filterActive : styles.filterInactive}
          onPress={() => setActiveFilter("Todos")}
        >
          <Text style={activeFilter === "Todos" ? styles.filterActiveText : styles.filterInactiveText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeFilter === "Activos" ? styles.filterActive : styles.filterInactive}
          onPress={() => setActiveFilter("Activos")}
        >
          <Text style={activeFilter === "Activos" ? styles.filterActiveText : styles.filterInactiveText}>Activos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Cargando clientes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id}
          onRefresh={loadClients}
          refreshing={isLoading}
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
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.businessName}
                  </Text>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: item.isActive ? "#4caf50" : "#d32f2f" }]} />
                    <Text style={styles.cardSubtitle}>
                      {item.isActive ? "Activo" : "Inactivo"}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => Alert.alert("Editar", "Edición deshabilitada temporalmente")}
                  >
                    <Text style={styles.editBtnText}>✏️ Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Contacto:</Text>
                  <Text style={styles.value} numberOfLines={1}>{item.contactName}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.label}>RUC:</Text>
                  <Text style={styles.value}>{item.ruc}</Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Correo:</Text>
                  <Text style={styles.value} numberOfLines={1}>{item.contactEmail}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Teléfono:</Text>
                  <Text style={styles.value}>{item.contactPhone}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <MaterialIcons name="people-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No se encontraron clientes</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  searchBar: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
    fontSize: 15,
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
  filterActiveText: { color: "#fff", fontWeight: "bold" },
  filterInactive: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterInactiveText: { color: "#999" },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  cardSubtitle: { color: "#666", fontSize: 13 },
  actionButtons: { flexDirection: "row", gap: 5 },
  editBtn: { backgroundColor: "#fff8e1", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  editBtnText: { color: "#f57c00", fontSize: 12 },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  infoCol: {
    flex: 1,
  },
  label: { fontSize: 11, color: "#999", marginBottom: 2 },
  value: { fontSize: 13, fontWeight: "500", color: "#333" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 15,
  },
});
