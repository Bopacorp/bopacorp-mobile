import { Text } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import DocumentCard from "@/components/DocumentCard";
import FilterButton from "@/components/FilterButton";
import SearchBar from "@/components/SearchBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";

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

  const documents = [
    {
      id: "1",
      company: "Importadora Costa Azul",
      fileName: "Contrato_Movistar.pdf",
      status: "ACCEPTED",
      date: "18/06/2026",
    },
    {
      id: "2",
      company: "Clinica Dental Sonrisa",
      fileName: "Cedula_Representante.pdf",
      status: "PENDING_APPROVAL",
      date: "17/06/2026",
    },
    {
      id: "3",
      company: "Papeleria Galaxia",
      fileName: "RUC.pdf",
      status: "REJECTED",
      date: "16/06/2026",
    },
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

      const sizeText = file.size
        ? `${(file.size / 1024).toFixed(1)} KB`
        : "Desconocido";
      Alert.alert(
        "Archivo Seleccionado",
        `Nombre: ${file.name}\nTamaño: ${sizeText}`,
      );
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "No se pudo seleccionar el archivo.");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchSearch =
      doc.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFilter = activeFilter === "all" || doc.status === activeFilter;

    return matchSearch && matchFilter;
  });
  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.searchRow}>
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
          globalStyles.actionButton,
          {
            backgroundColor: currentColors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={handleUploadFile}
      >
        <FontAwesome
          name="upload"
          size={16}
          color="white"
          style={globalStyles.actionIcon}
        />
        <Text style={globalStyles.actionButtonText}>Subir Documento</Text>
      </Pressable>

      <View
        style={[
          globalStyles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={globalStyles.titleRow}>
          <Text style={[globalStyles.title, { color: currentColors.text, marginLeft: 0 }]}>
            Documentación
          </Text>
        </View>

        <Text
          style={[globalStyles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Gestión de archivos contractuales y aprobaciones de carpetas.
        </Text>

        <View
          style={[globalStyles.divider, { backgroundColor: currentColors.border }]}
        />

        <Text style={[globalStyles.sectionTitle, { color: currentColors.text }]}>
          Total documentos: {filteredDocuments.length}
        </Text>

        <View style={globalStyles.listContainer}>
          {filteredDocuments.length === 0 ? (
            <Text style={[globalStyles.noResultsText, { color: currentColors.mutedForeground }]}>
              No se encontraron documentos para "{searchQuery}"
            </Text>
          ) : (
            filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                colorScheme={colorScheme ?? "light"}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
