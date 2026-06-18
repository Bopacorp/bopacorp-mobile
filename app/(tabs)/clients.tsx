import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import FilterButton from "../../components/FilterButton";
import SearchBar from "../../components/SearchBar";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
import {
  BusinessClient,
  getBusinessClients,
} from "../../services/ClientServices";

export default function ClientsScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [clients, setClients] = useState<BusinessClient[]>([]);
  const [loading, setLoading] = useState(true);
  const filterOptions = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
  ];

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await getBusinessClients();
      setClients(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();

    const matchSearch =
      client.businessName.toLowerCase().includes(query) ||
      client.contactName.toLowerCase().includes(query) ||
      client.advisorName.toLowerCase().includes(query) ||
      client.ruc.includes(searchQuery);

    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && client.isActive) ||
      (activeFilter === "inactive" && !client.isActive);

    return matchSearch && matchFilter;
  });

  <Text
    style={{
      color: currentColors.mutedForeground,
      marginBottom: 12,
      fontSize: 14,
    }}
  >
    Total clientes: {filteredClients.length}
  </Text>;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando clientes...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar clientes..."
            colorScheme={colorScheme ?? "light"}
          />
        </View>
        <FilterButton
          options={filterOptions}
          selectedValue={activeFilter}
          onSelect={setActiveFilter}
          colorScheme={colorScheme ?? "light"}
          title="Filtrar Clientes"
        />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <FontAwesome
            name="building"
            size={24}
            color={currentColors.primary}
          />
          <Text style={[styles.title, { color: currentColors.text }]}>
            Clientes
          </Text>
        </View>

        <Text
          style={[styles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Listado de clientes corporativos y gestión de cuentas.
        </Text>

        <View
          style={[styles.divider, { backgroundColor: currentColors.border }]}
        />

        <View style={styles.listContainer}>
          {filteredClients.map((client) => (
            <TouchableOpacity
              key={client.id}
              style={[
                styles.clientCard,
                {
                  borderColor: currentColors.border,
                  backgroundColor: currentColors.card,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                console.log(client);
              }}
            >
              <View style={styles.clientHeader}>
                <Text
                  style={[styles.clientName, { color: currentColors.text }]}
                >
                  {client.businessName}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: client.isActive ? "#DCFCE7" : "#FEE2E2",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: client.isActive ? "#166534" : "#991B1B",
                      fontWeight: "600",
                    }}
                  >
                    {client.isActive ? "Activo" : "Inactivo"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <FontAwesome name="id-card" size={14} color="#6B7280" />
                <Text style={styles.clientInfo}>{client.ruc}</Text>
              </View>

              <Text style={styles.clientInfo}>
                Contacto: {client.contactName}
              </Text>

              <View style={styles.infoRow}>
                <FontAwesome name="phone" size={14} color="#6B7280" />
                <Text style={styles.clientInfo}>{client.contactPhone}</Text>
              </View>

              <Text style={styles.clientInfo}>
                Asesor: {client.advisorName}
              </Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#E5E7EB",
                  marginVertical: 12,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: currentColors.primary,
                    fontWeight: "600",
                  }}
                >
                  Ver detalle →
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  card: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  listContainer: {
    gap: 12,
    backgroundColor: "transparent",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  listBullet: {
    marginRight: 12,
  },
  listText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  noResultsText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },

  clientCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 3,
  },

  clientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  clientName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  clientInfo: {
    fontSize: 14,
    marginBottom: 5,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
});
