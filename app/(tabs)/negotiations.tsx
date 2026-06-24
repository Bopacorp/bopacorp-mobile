import FilterButton from "@/components/FilterButton";
import NegotiationCard from "@/components/NegotiationCard";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { Negotiation, getNegotiations } from "@/services/ClientServices";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  View as RNView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const TABLE_HEADERS = [
  { label: "Empresa", flex: 2.2 },
  { label: "Estado", flex: 1.4 },
  { label: "Inicio", flex: 1.1 },
  { label: "Fin", flex: 1.1 },
];

const LIMIT = 50;

export default function NegotiationsScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [sortOrder, setSortOrder] = useState<
    "inicioAsc" | "inicioDesc" | "cierreAsc" | "cierreDesc" | "empresaAsc" | "empresaDesc" | "estadoGroup" | "default"
  >("default");

  const handleEmpresaSort = () => {
    if (sortOrder === "empresaAsc") {
      setSortOrder("empresaDesc");
    } else if (sortOrder === "empresaDesc") {
      setSortOrder("default");
    } else {
      setSortOrder("empresaAsc");
    }
  };

  const handleEstadoSort = () => {
    if (sortOrder === "estadoGroup") {
      setSortOrder("default");
    } else {
      setSortOrder("estadoGroup");
    }
  };

  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const filterOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Prospeccion", label: "Prospección" },
    { value: "Contacto Inicial", label: "Contacto Inicial" },
    { value: "Negociacion", label: "Negociación" },
    { value: "Cierre", label: "Cierre" },
    { value: "Post-venta", label: "Post-venta" },
  ];

  useFocusEffect(
    useCallback(() => {
      loadNegotiations(1, false);
    }, []),
  );

  async function loadNegotiations(pageToLoad: number, append: boolean) {
    if (pageToLoad === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const data = await getNegotiations(LIMIT, pageToLoad);
      if (append) {
        setNegotiations((prev) => [...prev, ...data]);
      } else {
        setNegotiations(data);
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
      loadNegotiations(page + 1, true);
    }
  };

  const filteredNegotiations = negotiations.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (n.clientName ?? "").toLowerCase().includes(q) ||
      (n.planName ?? "").toLowerCase().includes(q) ||
      (n.advisorName ?? "").toLowerCase().includes(q);
    const matchFilter = activeFilter === "Todos" || n.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const sortedNegotiations = [...filteredNegotiations].sort((a, b) => {
    const inicioA = new Date(a.date.split("/").reverse().join("-")).getTime();

    const inicioB = new Date(b.date.split("/").reverse().join("-")).getTime();

    const cierreA =
      a.estimatedCloseDate && a.estimatedCloseDate !== "N/A"
        ? new Date(
            a.estimatedCloseDate.split("/").reverse().join("-"),
          ).getTime()
        : 0;

    const cierreB =
      b.estimatedCloseDate && b.estimatedCloseDate !== "N/A"
        ? new Date(
            b.estimatedCloseDate.split("/").reverse().join("-"),
          ).getTime()
        : 0;

    switch (sortOrder) {
      case "inicioAsc":
        return inicioA - inicioB;

      case "inicioDesc":
        return inicioB - inicioA;

      case "cierreAsc":
        return cierreA - cierreB;

      case "cierreDesc":
        return cierreB - cierreA;

      case "empresaAsc":
        return (a.clientName || "").localeCompare(b.clientName || "", "es", { sensitivity: "base" });

      case "empresaDesc":
        return (b.clientName || "").localeCompare(a.clientName || "", "es", { sensitivity: "base" });

      case "estadoGroup":
        return (a.status || "").localeCompare(b.status || "", "es", { sensitivity: "base" });

      default:
        return 0;
    }
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
          Cargando negociaciones...
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
      <RNView style={globalStyles.searchRow}>
        <RNView style={globalStyles.flex1}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por empresa..."
            colorScheme={colorScheme ?? "light"}
          />
        </RNView>

        <FilterButton
          options={filterOptions}
          selectedValue={activeFilter}
          onSelect={setActiveFilter}
          colorScheme={colorScheme ?? "light"}
          title="Estado"
        />
      </RNView>

      <TouchableOpacity
        style={[
          globalStyles.actionButton,
          { backgroundColor: currentColors.primary },
        ]}
        onPress={() => router.push("/create-negotiation")}
      >
        <FontAwesome
          name="plus"
          size={14}
          color="white"
          style={globalStyles.actionIcon}
        />
        <Text style={globalStyles.actionButtonText}>Nueva negociación</Text>
      </TouchableOpacity>

      <View
        style={[
          globalStyles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
            paddingHorizontal: 10,
          },
        ]}
      >
        <RNView style={globalStyles.titleRow}>
          <Text style={globalStyles.title}>Negociaciones</Text>
        </RNView>

        <Text
          style={[
            globalStyles.subtitle,
            { color: currentColors.mutedForeground },
          ]}
        >
          Gestión de cuentas, contratos y visitas comerciales
        </Text>

        <RNView
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
          Total negociaciones: {filteredNegotiations.length}
        </Text>

        <RNView
          style={[
            styles.tableCard,
            {
              borderColor: currentColors.border ?? "#E5E7EB",
            },
          ]}
        >
          <RNView
            style={[
              styles.tableHeader,
              {
                backgroundColor: currentColors.muted,
                borderBottomColor: currentColors.border ?? "#E5E7EB",
              },
            ]}
          >
            <TouchableOpacity
              style={{ flex: 2.4 }}
              onPress={handleEmpresaSort}
            >
              <Text style={[styles.headerText, { color: currentColors.text }]}>
                Empresa {sortOrder === "empresaAsc" ? "↑" : sortOrder === "empresaDesc" ? "↓" : "↑↓"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1.2 }}
              onPress={handleEstadoSort}
            >
              <Text style={[styles.headerText, { color: currentColors.text }]}>
                Estado {sortOrder === "estadoGroup" ? "⊞" : "↑↓"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1.1 }}
              onPress={() =>
                setSortOrder(
                  sortOrder === "inicioAsc" ? "inicioDesc" : "inicioAsc",
                )
              }
            >
              <Text style={[styles.headerText, { color: currentColors.text }]}>Inicio ↑↓</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1.1 }}
              onPress={() =>
                setSortOrder(
                  sortOrder === "cierreAsc" ? "cierreDesc" : "cierreAsc",
                )
              }
            >
              <Text style={[styles.headerText, { color: currentColors.text }]}>Fin ↑↓</Text>
            </TouchableOpacity>
          </RNView>

          {filteredNegotiations.length === 0 ? (
            <Text style={[styles.emptyText, { color: currentColors.mutedForeground }]}>
              {searchQuery
                ? `No se encontraron resultados para "${searchQuery}"`
                : "Sin negociaciones registradas."}
            </Text>
          ) : (
            sortedNegotiations.map((item) => (
              <NegotiationCard
                key={item.id}
                negotiation={item}
                colorScheme={colorScheme ?? "light"}
                onPress={() =>
                  router.push({
                    pathname: "/negotiation-detail",
                    params: {
                      id: item.id,
                      clientName: item.clientName,
                      planName: item.planName,
                      amount: item.amount,
                      status: item.status,
                      date: item.date,
                      advisorName: item.advisorName,
                      estimatedCloseDate: item.estimatedCloseDate,
                    },
                  })
                }
              />
            ))
          )}

          {hasMore && filteredNegotiations.length > 0 && (
            <TouchableOpacity
              style={[
                styles.loadMoreButton,
                {
                  backgroundColor: currentColors.card,
                  borderTopWidth: 1,
                  borderTopColor: currentColors.border ?? "#E5E7EB",
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

          <RNView
            style={[
              styles.tableFooter,
              { borderTopColor: currentColors.border ?? "#E5E7EB" },
            ]}
          >
            <Text style={[styles.totalText, { color: currentColors.mutedForeground }]}>
              {filteredNegotiations.length} resultado
              {filteredNegotiations.length !== 1 ? "s" : ""}
            </Text>
          </RNView>
        </RNView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "700",
  },
  tableFooter: {
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  totalText: {
    fontSize: 12,
  },
  emptyText: {
    padding: 24,
    textAlign: "center",
    fontSize: 14,
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
