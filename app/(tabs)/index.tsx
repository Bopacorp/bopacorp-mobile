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
          setNegotiations([]);
        }
      } catch (error) {
        console.error("ERROR API:", error);
        setNegotiations([]);
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
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={[styles.clientName, { color: currentColors.text }]} numberOfLines={1}>
              {item.clientName}
            </Text>
            <Text
              style={[
                styles.planName,
                { color: currentColors.mutedForeground },
              ]}
            >
              Estado: {item.planName}
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
            { backgroundColor: currentColors.border, marginVertical: 10 },
          ]}
        />

        {/* Dynamic API Data: Advisor & Estimated Closing */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <FontAwesome
              name="user"
              size={12}
              color={currentColors.mutedForeground}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.detailText, { color: currentColors.mutedForeground }]} numberOfLines={1}>
              Asesor: {item.advisorName}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome
              name="calendar"
              size={12}
              color={currentColors.mutedForeground}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.detailText, { color: currentColors.mutedForeground }]}>
              Cierre: {item.estimatedCloseDate}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.cardDivider,
            { backgroundColor: currentColors.border, marginVertical: 10 },
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
              Inicio: {item.date}
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
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
  },
  detailText: {
    fontSize: 12,
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
