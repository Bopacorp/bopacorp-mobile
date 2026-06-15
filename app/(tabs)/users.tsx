import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function UsersManagementScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@bopacorpsa.com",
      role: "Asesor",
      status: "Activo",
      lastAccess: "15/01/2026 09:30",
      activeClients: 45,
    },
    {
      id: 2,
      name: "María González",
      email: "maria.gonzalez@bopacorpsa.com",
      role: "Asesor",
      status: "Activo",
      lastAccess: "15/01/2026 08:15",
      activeClients: 38,
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@bopacorpsa.com",
      role: "Admin",
      status: "Activo",
      lastAccess: "15/01/2026 10:45",
      activeClients: 0,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <Pressable style={styles.addButton}>
          <FontAwesome name="user-plus" size={16} color="white" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={16}
          color="#9E9E9E"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.badgesContainer}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      user.role === "Admin" ? "#FF9800" : "#2196F3",
                  },
                ]}
              >
                <Text style={styles.badgeText}>{user.role}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      user.status === "Activo" ? "#4CAF50" : "#F44336",
                    marginLeft: 6,
                  },
                ]}
              >
                <Text style={styles.badgeText}>{user.status}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <FontAwesome
                name="clock-o"
                size={14}
                color="#757575"
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>
                Último acceso: {user.lastAccess}
              </Text>
            </View>
            {user.role === "Asesor" && (
              <View style={styles.detailRow}>
                <FontAwesome
                  name="building-o"
                  size={14}
                  color="#757575"
                  style={styles.detailIcon}
                />
                <Text style={styles.detailText}>
                  Clientes activos: {user.activeClients}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.actionButtonsContainer}>
            <Pressable style={[styles.actionBtn, { borderColor: "#2196F3" }]}>
              <FontAwesome name="pencil" size={14} color="#2196F3" />
              <Text style={[styles.actionBtnText, { color: "#2196F3" }]}>
                Editar
              </Text>
            </Pressable>

            <Pressable style={[styles.actionBtn, { borderColor: "#FF9800" }]}>
              <FontAwesome name="refresh" size={14} color="#FF9800" />
              <Text style={[styles.actionBtnText, { color: "#FF9800" }]}>
                Reset
              </Text>
            </Pressable>

            <Pressable style={[styles.actionBtn, { borderColor: "#F44336" }]}>
              <FontAwesome name="trash" size={14} color="#F44336" />
              <Text style={[styles.actionBtnText, { color: "#F44336" }]}>
                Eliminar
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#1976D2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  badgesContainer: {
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailIcon: {
    width: 20,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 12,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
  },
  actionBtnText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
});
