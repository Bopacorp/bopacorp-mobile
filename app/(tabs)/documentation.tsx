import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { StyleSheet, ScrollView, Pressable, Alert, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Text } from "@/components/Themed";
import Colors from "../../constants/Colors";
import { useColorScheme } from "../../components/useColorScheme";
import SearchBar from "../../components/SearchBar";
import FilterButton from "../../components/FilterButton";

export default function DocumentationScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "Todos" },
    { value: "PENDING_APPROVAL", label: "Pendientes" },
    { value: "ACCEPTED", label: "Aceptados" },
    { value: "REJECTED", label: "Rechazados" },
  ];

  const items = [
    "Barra de búsqueda de archivos y filtrado por estado de aprobación (Pendiente, Aceptado, Rechazado)",
    "Listado de documentos subidos por negociación (Empresa cliente, tipo de documento, nombre de archivo, fecha de subida)",
    "Botón de carga de nuevos documentos por negociación (Selector local de archivos PDF o imágenes)",
    "Acción rápida para descargar o previsualizar archivos de forma segura",
    "Flujo de aprobación/rechazo de documentos con observaciones para coordinadores",
  ];

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User canceled file selection");
        return;
      }

      const file = result.assets[0];
      console.log("Selected file:", file.name, file.uri, file.size);
      
      const sizeText = file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Desconocido";
      Alert.alert(
        "Archivo Seleccionado",
        `Nombre: ${file.name}\nTamaño: ${sizeText}`
      );
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "No se pudo seleccionar el archivo.");
    }
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar documentos..."
            colorScheme={colorScheme ?? "light"}
          />
        </View>
        <FilterButton
          options={filterOptions}
          selectedValue={activeFilter}
          onSelect={setActiveFilter}
          colorScheme={colorScheme ?? "light"}
          title="Estado del Documento"
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.uploadButton,
          {
            backgroundColor: currentColors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={handleUploadFile}
      >
        <FontAwesome name="upload" size={16} color="white" style={styles.uploadIcon} />
        <Text style={styles.uploadButtonText}>Subir Documento</Text>
      </Pressable>

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
          <FontAwesome name="file-text-o" size={24} color={currentColors.primary} />
          <Text style={[styles.title, { color: currentColors.text }]}>Documentación</Text>
        </View>
        
        <Text style={[styles.subtitle, { color: currentColors.mutedForeground }]}>
          Gestión de archivos contractuales y aprobaciones de carpetas.
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
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
