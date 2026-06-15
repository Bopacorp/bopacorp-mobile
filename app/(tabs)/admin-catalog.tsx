import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext"; // Importamos el rol

export default function ServiceCatalogScreen() {
  const { role } = useAuth(); // Preguntamos quién está viendo la pantalla

  // Datos del catálogo basados en tu diseño
  const services = [
    {
      id: 1,
      title: "Consultoría Empresarial",
      status: "Activo",
      tag: "Consultoría",
      tagBg: "#E3F2FD",
      tagText: "#1976D2",
      description: "Asesoría estratégica para optimización de procesos",
      price: "$150.00",
      duration: "4 horas",
      durationIcon: "clock-o",
    },
    {
      id: 2,
      title: "Desarrollo de Software",
      status: "Activo",
      tag: "Tecnología",
      tagBg: "#F3E5F5",
      tagText: "#9C27B0",
      description: "Creación de soluciones tecnológicas a medida",
      price: "$2500.00",
      duration: "Por proyecto",
      durationIcon: "bullseye",
    },
    {
      id: 3,
      title: "Auditoría de Sistemas",
      status: "Activo",
      tag: "Auditoría",
      tagBg: "#FFF3E0",
      tagText: "#FF9800",
      description: "Revisión completa de sistemas y procesos",
      price: "$800.00",
      duration: "2 días",
      durationIcon: "calendar-o",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* CABECERA (El botón "+" solo se muestra si es Admin) */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Gestión de Servicios</Text>
        {role === "Admin" && (
          <Pressable style={styles.addButton}>
            <FontAwesome name="plus" size={16} color="white" />
          </Pressable>
        )}
      </View>

      {/* LISTA DE SERVICIOS */}
      {services.map((service) => (
        <View key={service.id} style={styles.serviceCard}>
          {/* Fila 1: Título y Botones de Acción */}
          <View style={styles.cardHeader}>
            <Text style={styles.serviceTitle}>{service.title}</Text>

            <View style={styles.headerActions}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{service.status}</Text>
              </View>

              {/* Iconos de Editar/Eliminar (Solo visibles para el Admin) */}
              {role === "Admin" && (
                <>
                  <Pressable style={styles.actionIcon}>
                    <FontAwesome name="pencil" size={16} color="#2196F3" />
                  </Pressable>
                  <Pressable style={styles.actionIcon}>
                    <FontAwesome name="trash" size={16} color="#F44336" />
                  </Pressable>
                </>
              )}
            </View>
          </View>

          {/* Fila 2: Etiqueta de Categoría (Pill) */}
          <View
            style={[styles.categoryPill, { backgroundColor: service.tagBg }]}
          >
            <Text style={[styles.categoryText, { color: service.tagText }]}>
              {service.tag}
            </Text>
          </View>

          {/* Fila 3: Descripción */}
          <Text style={styles.description}>{service.description}</Text>

          {/* Fila 4: Precio y Duración */}
          <View style={styles.footerContainer}>
            <Text style={styles.priceText}>{service.price}</Text>
            <View style={styles.durationContainer}>
              <FontAwesome
                name={service.durationIcon as any}
                size={14}
                color="#FF9800"
              />
              <Text style={styles.durationText}>{service.duration}</Text>
            </View>
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#1976D2",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  serviceCard: {
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
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    paddingRight: 10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  actionIcon: {
    marginLeft: 10,
    padding: 2,
  },
  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50", // Verde para el dinero
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 13,
    color: "#FF9800", // Naranja para el tiempo
    marginLeft: 6,
    fontWeight: "500",
  },
});
