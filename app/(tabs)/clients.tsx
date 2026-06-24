import ClientCard from "@/components/ClientCard";
import FilterButton from "@/components/FilterButton";
import SortButton, { SortOrder } from "@/components/SortButton";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { BusinessClient, getBusinessClients } from "@/services/ClientServices";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const LIMIT = 50;

export default function ClientsScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [clients, setClients] = useState<BusinessClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const filterOptions = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
  ];

  useFocusEffect(
    useCallback(() => {
      loadClients(1, false);
    }, []),
  );

  async function loadClients(pageToLoad: number, append: boolean) {
    if (pageToLoad === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const data = await getBusinessClients(LIMIT, pageToLoad);

      if (append) {
        setClients((prev) => [...prev, ...data]);
      } else {
        setClients(data);
      }
      setPage(pageToLoad);
      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadClients(page + 1, true);
    }
  };

  const filteredClients = clients
    .filter((client) => {
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
    })
    .sort((a, b) => {
      if (sortOrder === "az") return a.businessName.localeCompare(b.businessName);
      if (sortOrder === "za") return b.businessName.localeCompare(a.businessName);
      return 0;
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
        <SortButton
          value={sortOrder}
          onSelect={setSortOrder}
          colorScheme={colorScheme ?? "light"}
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
              No se encontraron resultados
            </Text>
          ) : (
            filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                colorScheme={colorScheme ?? "light"}
                onPress={() =>
                  router.push({
                    pathname: "/client-detail",
                    params: {
                      id: client.id,
                    },
                  })
                }
              />
            ))
          )}
        </View>

        {hasMore && filteredClients.length > 0 && (
          <TouchableOpacity
            style={[
              styles.loadMoreButton,
              {
                backgroundColor: currentColors.card,
                borderColor: currentColors.border,
              },
            ]}
            onPress={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color={currentColors.primary} />
            ) : (
              <Text
                style={[
                  styles.loadMoreText,
                  { color: currentColors.primary },
                ]}
              >
                Cargar más
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 16,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
