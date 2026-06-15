import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// ESTRUCTURA REAL SEGÚN TUS DATOS
const NEGOTIATIONS = [
  {
    id: "1",
    client: "Corporación Favorita",
    plan: "Movistar Pro Ilimitado Pyme",
    amount: "$320.00/mes",
    status: "Aprobado",
    time: "2h",
  },
  {
    id: "2",
    client: "Importadora Tomati S.A.",
    plan: "Movistar Control Fijo 50GB",
    amount: "$150.00/mes",
    status: "Enviado",
    time: "5h",
  },
];

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState("Todos");

  return (
    <View style={styles.container}>
      {/* 1. BUSCADOR */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={16} color="#666" />
        <TextInput
          placeholder="Buscar cliente o plan..."
          style={styles.input}
        />
      </View>

      {/* 2. FILTROS (Basado en tu info) */}
      <View style={styles.tabContainer}>
        {["Todos", "Borrador", "Enviado", "Aprobado"].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={activeTab === tab ? styles.activeTabText : styles.tabText}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 3. LISTA DE NEGOCIACIONES */}
      <FlatList
        data={NEGOTIATIONS}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.client}>{item.client}</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.status === "Aprobado" ? "#E6FCF5" : "#E5F3FF",
                  },
                ]}
              >
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.plan}>{item.plan}</Text>
            <View style={styles.footer}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  input: { marginLeft: 10, flex: 1 },
  tabContainer: { flexDirection: "row", marginBottom: 20, gap: 10 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#EEE",
  },
  activeTab: { backgroundColor: "#1E88E5" },
  activeTabText: { color: "#FFF", fontWeight: "bold" },
  tabText: { color: "#333" },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  client: { fontWeight: "bold", fontSize: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: "bold" },
  plan: { color: "#666", marginBottom: 10 },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  amount: { fontWeight: "bold", color: "#1E88E5" },
  time: { color: "#999", fontSize: 12 },
});
