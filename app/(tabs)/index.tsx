import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import SearchBar from "../../components/SearchBar";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

export default function OverviewScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar en dashboard..."
          colorScheme={colorScheme ?? "light"}
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
          <FontAwesome name="home" size={24} color={currentColors.primary} />
          <Text style={[styles.title, { color: currentColors.text }]}>
            Overview
          </Text>
        </View>

        <Text
          style={[styles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Resumen operativo y métricas clave de negocio.
        </Text>

        <View
          style={[styles.divider, { backgroundColor: currentColors.border }]}
        />

        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Visitas hoy</Text>

            <Text style={styles.kpiNumber}>3</Text>

            <Text style={styles.kpiSubtitle}>Programadas y completadas</Text>
          </View>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiTitle}>Visitas hoy</Text>

          <Text style={styles.kpiNumber}>3</Text>

          <Text style={styles.kpiSubtitle}>Programadas y completadas</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiTitle}>Top performers</Text>

          <Text style={styles.kpiNumber}>1</Text>

          <Text style={styles.kpiSubtitle}>Asesores destacados</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
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
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "transparent",
  },

  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: "white",
  },

  kpiTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  kpiNumber: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },

  kpiSubtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
});
