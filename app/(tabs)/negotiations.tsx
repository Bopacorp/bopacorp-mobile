import FilterButton from "@/components/FilterButton";
import NegotiationCard from "@/components/NegotiationCard";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { Negotiation, getNegotiations } from "@/services/ClientServices";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
  { label: "Fecha inicio", flex: 1.1 },
  { label: "Cierre estimado", flex: 1.1 },
];

export default function NegotiationsScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [sortOrder, setSortOrder] = useState<
    "inicioAsc" | "inicioDesc" | "cierreAsc" | "cierreDesc"
  >("inicioDesc");

  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Prospección", label: "Prospección" },
    { value: "Contacto Inicial", label: "Contacto Inicial" },
    { value: "Negociación", label: "Negociación" },
    { value: "Cierre", label: "Cierre" },
    { value: "Post-venta", label: "Post-venta" },
  ];

  useEffect(() => {
    loadNegotiations();
  }, []);

  async function loadNegotiations() {
    try {
      const data = await getNegotiations();
      setNegotiations(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
      {/* ── Page header ── */}
      <RNView style={styles.pageHeader}>
        <RNView>
          <Text style={styles.pageTitle}>Negociaciones</Text>
          <Text style={styles.pageSubtitle}>
            Gestión de cuentas, contratos y visitas comerciales
          </Text>
        </RNView>

        <TouchableOpacity
          style={[styles.newBtn, { backgroundColor: currentColors.primary }]}
          activeOpacity={0.8}
          onPress={() => router.push("/create-negotiation")}
        >
          <FontAwesome
            name="plus"
            size={12}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.newBtnText}>Nueva negociación</Text>
        </TouchableOpacity>
      </RNView>

      {/* ── Filtros ── */}
      <RNView style={styles.filtersRow}>
        <RNView style={styles.searchWrap}>
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

      {/* ── Tabla ── */}
      <RNView
        style={[
          styles.tableCard,
          {
            backgroundColor: currentColors.card ?? "#fff",
            borderColor: currentColors.border ?? "#E5E7EB",
          },
        ]}
      >
        {/* Header de columnas */}
        <RNView
          style={[
            styles.tableHeader,
            { borderBottomColor: currentColors.border ?? "#E5E7EB" },
          ]}
        >
          <RNView style={{ flex: 2.2 }}>
            <Text style={styles.headerText}>Empresa</Text>
          </RNView>

          <RNView style={{ flex: 1.4 }}>
            <Text style={styles.headerText}>Estado</Text>
          </RNView>

          <TouchableOpacity
            style={{ flex: 1.1 }}
            onPress={() =>
              setSortOrder(
                sortOrder === "inicioAsc" ? "inicioDesc" : "inicioAsc",
              )
            }
          >
            <Text style={styles.headerText}>Fecha inicio ↑↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1.1 }}
            onPress={() =>
              setSortOrder(
                sortOrder === "cierreAsc" ? "cierreDesc" : "cierreAsc",
              )
            }
          >
            <Text style={styles.headerText}>Cierre est. ↑↓</Text>
          </TouchableOpacity>
        </RNView>

        {/* Filas */}
        {filteredNegotiations.length === 0 ? (
          <Text style={styles.emptyText}>
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

        {/* Footer con total */}
        <RNView
          style={[
            styles.tableFooter,
            { borderTopColor: currentColors.border ?? "#E5E7EB" },
          ]}
        >
          <Text style={styles.totalText}>
            {filteredNegotiations.length} resultado
            {filteredNegotiations.length !== 1 ? "s" : ""}
          </Text>
        </RNView>
      </RNView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* page header */
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  newBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  /* filtros */
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  searchWrap: {
    flex: 1,
  },

  /* tabla */
  tableCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: "#FAFAFA",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  /* footer */
  tableFooter: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  totalText: {
    fontSize: 12,
    color: "#6B7280",
  },

  emptyText: {
    padding: 24,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
  },
});
