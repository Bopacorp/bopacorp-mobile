import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "../../constants/Colors";
import { useColorScheme } from "../../components/useColorScheme";
import SearchBar from "../../components/SearchBar";

export default function OverviewScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");

  const items = [
    "KpiCard: Cuentas activas (Total de cuentas en operación)",
    "KpiCard: Visitas hoy (Programadas y completadas para el asesor)",
    "KpiCard: Top performers (Clasificación de asesores destacados)",
    "Panel de Resumen operativo diario y métricas de rendimiento comercial",
  ];

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Text style={[styles.title, { color: currentColors.text }]}>Overview</Text>
        </View>
        
        <Text style={[styles.subtitle, { color: currentColors.mutedForeground }]}>
          Resumen operativo y métricas clave de negocio.
        </Text>

        <View style={[styles.divider, { backgroundColor: currentColors.border }]} />

        <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
          Componentes que se ubicarán aquí:
        </Text>

        <View style={styles.listContainer}>
          {filteredItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <FontAwesome name="circle" size={8} color={currentColors.primary} style={styles.listBullet} />
              <Text style={[styles.listText, { color: currentColors.text }]}>{item}</Text>
            </View>
          ))}
          {filteredItems.length === 0 && (
            <Text style={[styles.noResultsText, { color: currentColors.mutedForeground }]}>
              Sin resultados para "{searchQuery}"
            </Text>
          )}
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
});
