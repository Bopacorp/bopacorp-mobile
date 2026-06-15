import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getClients, Negotiation } from "../../services/ClientServices";

const MOCK_NEGOTIATIONS: Negotiation[] = [
  {
    id: "1",
    clientName: "Corporación Favorita",
    planName: "Movistar Pro Ilimitado Pyme",
    amount: "$320.00/mes",
    status: "Aprobado",
    date: "Hace 2 horas",
  },
  {
    id: "2",
    clientName: "Importadora Tomati S.A.",
    planName: "Movistar Control Fijo 50GB",
    amount: "$150.00/mes",
    status: "Enviado",
    date: "Hace 5 horas",
  },
  {
    id: "3",
    clientName: "Distribuidora del Pacífico",
    planName: "Plan Datos Compartidos 200GB",
    amount: "$450.00/mes",
    status: "Borrador",
    date: "Ayer",
  },
  {
    id: "4",
    clientName: "Inmobiliaria Los Lagos",
    planName: "Movistar Fibra Óptica 300MB",
    amount: "$85.00/mes",
    status: "Rechazado",
    date: "Hace 3 días",
  },
  {
    id: "5",
    clientName: "Estudio Jurídico Noboa",
    planName: "Línea Móvil Pyme Estándar",
    amount: "$45.00/mes",
    status: "Aprobado",
    date: "Hace 5 días",
  },
];

const STATUS_COLORS = {
  Borrador: {
    bg: "#e5e5e5",
    text: "#555555",
    darkBg: "#333333",
    darkText: "#cccccc",
  },
  Enviado: {
    bg: "#e5f3ff",
    text: "#006cb8",
    darkBg: "rgba(0,108,184,0.2)",
    darkText: "#3b9be0",
  },
  Aprobado: {
    bg: "#e6fcf5",
    text: "#0ca678",
    darkBg: "rgba(12,166,120,0.2)",
    darkText: "#20c997",
  },
  Rechazado: {
    bg: "#fff0f6",
    text: "#d6336c",
    darkBg: "rgba(214,51,108,0.2)",
    darkText: "#f783ac",
  },
};

export default function NegotiationsScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "Todos" | "Borrador" | "Enviado" | "Aprobado"
  >("Todos");

  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getClients();
        console.log("DATOS RECIBIDOS:", data);
        if (data && data.length > 0) {
          setNegotiations(data);
        } else {
          setNegotiations(MOCK_NEGOTIATIONS);
        }
      } catch (error) {
        console.error("ERROR API:", error);
        setNegotiations(MOCK_NEGOTIATIONS);
      }
    };
    loadData();
  }, []);

  const filteredData = negotiations.filter((item) => {
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.planName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "Todos" ||
      item.status.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }: { item: Negotiation }) => {
    const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.Borrador;
    const badgeBg =
      colorScheme === "dark" ? statusStyle.darkBg : statusStyle.bg;
    const badgeText =
      colorScheme === "dark" ? statusStyle.darkText : statusStyle.text;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.clientName, { color: currentColors.text }]}>
              {item.clientName}
            </Text>
            <Text
              style={[
                styles.planName,
                { color: currentColors.mutedForeground },
              ]}
            >
              {item.planName}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeText }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.cardDivider,
            { backgroundColor: currentColors.border },
          ]}
        />

        <View style={styles.cardFooter}>
          <Text style={[styles.amountText, { color: currentColors.primary }]}>
            {item.amount}
          </Text>
          <View style={styles.dateContainer}>
            <FontAwesome
              name="clock-o"
              size={12}
              color={currentColors.mutedForeground}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.dateText,
                { color: currentColors.mutedForeground },
              ]}
            >
              {item.date}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      {/* Search Input */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <FontAwesome
          name="search"
          size={16}
          color={currentColors.mutedForeground}
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Buscar cliente o plan..."
          placeholderTextColor={currentColors.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: currentColors.text }]}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <FontAwesome
              name="times-circle"
              size={16}
              color={currentColors.mutedForeground}
            />
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersWrapper}>
        {(["Todos", "Borrador", "Enviado", "Aprobado"] as const).map(
          (filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive
                      ? currentColors.primary
                      : currentColors.card,
                    borderColor: currentColors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    {
                      color: isActive ? "#ffffff" : currentColors.text,
                      fontWeight: isActive ? "bold" : "normal",
                    },
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>

      {/* Negotiations List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome
              name="folder-open-o"
              size={48}
              color={currentColors.mutedForeground}
              style={{ marginBottom: 12 }}
            />
            <Text
              style={[
                styles.emptyText,
                { color: currentColors.mutedForeground },
              ]}
            >
              No hay negociaciones encontradas
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  filtersWrapper: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  planName: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  amountText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dateText: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "transparent",
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
