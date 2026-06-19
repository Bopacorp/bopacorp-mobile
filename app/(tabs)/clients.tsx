import { Text, View } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import ClientCard from "@/components/ClientCard";
import FilterButton from "@/components/FilterButton";
import SearchBar from "@/components/SearchBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { BusinessClient, getBusinessClients } from "@/services/ClientServices";

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
      (client.ruc || "").includes(searchQuery);

    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && client.isActive) ||
      (activeFilter === "inactive" && !client.isActive);

    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>Cargando clientes...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.searchRow}>
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
          globalStyles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={globalStyles.titleRow}>
          <Text style={[globalStyles.title, { color: currentColors.text, marginLeft: 0 }]}>
            Clientes
          </Text>
        </View>

        <Text
          style={[globalStyles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Listado de clientes corporativos y gestión de cuentas.
        </Text>

        <View
          style={[globalStyles.divider, { backgroundColor: currentColors.border }]}
        />

        <Text
          style={{
            color: currentColors.mutedForeground,
            marginBottom: 16,
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Total clientes: {filteredClients.length}
        </Text>

        <View style={globalStyles.listContainer}>
          {filteredClients.length === 0 ? (
            <Text style={[globalStyles.noResultsText, { color: currentColors.mutedForeground }]}>
              No se encontraron clientes para "{searchQuery}"
            </Text>
          ) : (
            filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                colorScheme={colorScheme ?? "light"}
                onPress={() => console.log(client)}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
