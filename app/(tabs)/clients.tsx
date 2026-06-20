import ClientCard from "@/components/ClientCard";
import FilterButton from "@/components/FilterButton";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { BusinessClient, getBusinessClients } from "@/services/ClientServices";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";

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
      <View
        style={[
          globalStyles.loadingContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text
          style={[
            globalStyles.loadingText,
            { color: currentColors.mutedForeground },
          ]}
        >
          Cargando clientes...
        </Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={[
        globalStyles.container,
        { backgroundColor: currentColors.background },
      ]}
      contentContainerStyle={globalStyles.scrollPadding}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.searchRow}>
        <View style={globalStyles.flex1}>
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

      <TouchableOpacity
        style={[
          globalStyles.actionButton,
          { backgroundColor: currentColors.primary },
        ]}
        onPress={() => router.push("/create-client")}
      >
        <FontAwesome
          name="plus"
          size={14}
          color="white"
          style={globalStyles.actionIcon}
        />

        <Text style={globalStyles.actionButtonText}>Nuevo cliente</Text>
      </TouchableOpacity>

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
          <Text style={globalStyles.title}>Clientes</Text>
        </View>

        <Text
          style={[
            globalStyles.subtitle,
            { color: currentColors.mutedForeground },
          ]}
        >
          Listado de clientes corporativos y gestión de cuentas.
        </Text>

        <View
          style={[
            globalStyles.divider,
            { backgroundColor: currentColors.border },
          ]}
        />

        <Text
          style={[
            globalStyles.totalCountText,
            { color: currentColors.mutedForeground },
          ]}
        >
          Total clientes: {filteredClients.length}
        </Text>

        <View style={globalStyles.listContainer}>
          {filteredClients.length === 0 ? (
            <Text
              style={[
                globalStyles.noResultsText,
                { color: currentColors.mutedForeground },
              ]}
            >
              No se encontraron clientes para "{searchQuery}"
            </Text>
          ) : (
            filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                colorScheme={colorScheme ?? "light"}
                onPress={() =>
                  router.push({
                    pathname: "/client-detail" as any,
                    params: {
                      businessName: client.businessName,
                      ruc: client.ruc,
                      contactName: client.contactName,
                      contactPhone: client.contactPhone,
                      contactEmail: client.contactEmail,
                      address: client.address,
                      advisorName: client.advisorName,
                      isActive: String(client.isActive),
                    },
                  })
                }
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
