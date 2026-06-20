import { Text } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DocumentCard from "@/components/DocumentCard";
import FilterButton from "@/components/FilterButton";
import SearchBar from "@/components/SearchBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import {
  getNegotiationDocuments,
  DocumentItem,
  getNegotiations,
  Negotiation,
  getDocumentTypes,
  DocumentTypeItem,
  uploadDocumentFile,
  createNegotiationDocument,
} from "@/services/ClientServices";

export default function DocumentationScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeItem[]>([]);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<DocumentTypeItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingPickers, setLoadingPickers] = useState(false);

  const [negPickerVisible, setNegPickerVisible] = useState(false);
  const [typePickerVisible, setTypePickerVisible] = useState(false);

  const filterOptions = [
    { value: "all", label: "Todos" },
    { value: "PENDING_APPROVAL", label: "Pendientes" },
    { value: "ACCEPTED", label: "Aceptados" },
    { value: "REJECTED", label: "Rechazados" },
  ];

  useEffect(() => {
    async function loadDocs() {
      try {
        const data = await getNegotiationDocuments();
        setDocuments(data);
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const openUploadModal = async () => {
    setModalVisible(true);
    setLoadingPickers(true);
    try {
      const [negs, types] = await Promise.all([
        getNegotiations(),
        getDocumentTypes(),
      ]);
      setNegotiations(negs);
      setDocumentTypes(types);
    } catch (err) {
      console.error("Failed to load upload metadata:", err);
    } finally {
      setLoadingPickers(false);
    }
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile(file);
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "No se pudo seleccionar el archivo.");
    }
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Por favor seleccione un archivo.");
      return;
    }
    if (!selectedNegotiation) {
      Alert.alert("Error", "Por favor seleccione una negociación.");
      return;
    }
    if (!selectedDocType) {
      Alert.alert("Error", "Por favor seleccione un tipo de documento.");
      return;
    }

    setUploading(true);
    try {
      const uploadResponse = await uploadDocumentFile(
        selectedFile.uri,
        selectedFile.name,
        selectedFile.mimeType || "application/octet-stream"
      );

      await createNegotiationDocument({
        negotiationId: selectedNegotiation.id,
        documentTypeId: selectedDocType.id,
        filename: uploadResponse.filename,
        fileExtension: uploadResponse.fileExtension,
        fileSizeMb: uploadResponse.fileSizeMb,
        storagePath: uploadResponse.storagePath,
        mimeType: uploadResponse.mimeType,
        encryptionMetadata: uploadResponse.encryptionMetadata,
      });

      Alert.alert("Éxito", "Documento subido correctamente.");

      setSelectedFile(null);
      setSelectedNegotiation(null);
      setSelectedDocType(null);
      setModalVisible(false);

      setLoading(true);
      const data = await getNegotiationDocuments();
      setDocuments(data);
    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert("Error", err?.message || "Ocurrió un error al subir el documento.");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchSearch =
      doc.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFilter = activeFilter === "all" || doc.status === activeFilter;

    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <View style={[globalStyles.loadingContainer, { backgroundColor: currentColors.background }]}>
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text style={[globalStyles.loadingText, { color: currentColors.mutedForeground }]}>
          Cargando documentos...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={globalStyles.scrollPadding}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.searchRow}>
        <View style={globalStyles.flex1}>
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
        onPress={openUploadModal}
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
          <Text style={globalStyles.title}>Documentación</Text>
        </View>

        <Text
          style={[globalStyles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Gestión de archivos contractuales y aprobaciones de carpetas.
        </Text>

        <View
          style={[globalStyles.divider, { backgroundColor: currentColors.border }]}
        />

        <Text style={[globalStyles.totalCountText, { color: currentColors.mutedForeground }]}>
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
                onRefresh={async () => {
                  setLoading(true);
                  try {
                    const data = await getNegotiationDocuments();
                    setDocuments(data);
                  } catch (err) {
                    console.error("Failed to reload documents:", err);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            ))
          )}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContainer, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: currentColors.text }]}>Subir Documento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="times" size={20} color={currentColors.text} />
              </TouchableOpacity>
            </View>

            {loadingPickers ? (
              <View style={localStyles.pickerLoader}>
                <ActivityIndicator size="small" color={currentColors.primary} />
                <Text style={{ color: currentColors.mutedForeground, marginTop: 8 }}>Cargando datos...</Text>
              </View>
            ) : (
              <ScrollView style={localStyles.modalForm}>
                <Text style={[localStyles.label, { color: currentColors.text }]}>Negociación</Text>
                <TouchableOpacity
                  style={[localStyles.selectButton, { borderColor: currentColors.border }]}
                  onPress={() => setNegPickerVisible(true)}
                >
                  <Text style={{ color: selectedNegotiation ? currentColors.text : currentColors.mutedForeground }}>
                    {selectedNegotiation ? selectedNegotiation.clientName : "Seleccionar negociación..."}
                  </Text>
                  <FontAwesome name="chevron-down" size={12} color={currentColors.mutedForeground} />
                </TouchableOpacity>

                <Text style={[localStyles.label, { color: currentColors.text }]}>Tipo de documento</Text>
                <TouchableOpacity
                  style={[localStyles.selectButton, { borderColor: currentColors.border }]}
                  onPress={() => setTypePickerVisible(true)}
                >
                  <Text style={{ color: selectedDocType ? currentColors.text : currentColors.mutedForeground }}>
                    {selectedDocType ? selectedDocType.name : "Seleccionar tipo..."}
                  </Text>
                  <FontAwesome name="chevron-down" size={12} color={currentColors.mutedForeground} />
                </TouchableOpacity>

                <Text style={[localStyles.label, { color: currentColors.text }]}>Archivo</Text>
                {selectedFile ? (
                  <View style={[localStyles.fileRow, { borderColor: currentColors.border }]}>
                    <Text style={[localStyles.fileName, { color: currentColors.text }]} numberOfLines={1}>
                      {selectedFile.name}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedFile(null)}>
                      <FontAwesome name="trash" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[localStyles.uploadArea, { borderColor: currentColors.border }]}
                    onPress={handleSelectFile}
                  >
                    <FontAwesome name="cloud-upload" size={24} color={currentColors.primary} />
                    <Text style={{ color: currentColors.mutedForeground, marginTop: 4 }}>
                      Seleccionar archivo
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    localStyles.submitButton,
                    {
                      backgroundColor: currentColors.primary,
                      opacity: (uploading || !selectedFile || !selectedNegotiation || !selectedDocType) ? 0.6 : 1,
                    },
                  ]}
                  disabled={uploading || !selectedFile || !selectedNegotiation || !selectedDocType}
                  onPress={handleSubmitUpload}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={localStyles.submitButtonText}>Subir Documento</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>

        <Modal
          visible={negPickerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setNegPickerVisible(false)}
        >
          <View style={localStyles.pickerOverlay}>
            <View style={[localStyles.pickerContainer, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
              <View style={localStyles.pickerHeader}>
                <Text style={[localStyles.pickerTitle, { color: currentColors.text }]}>Seleccionar Negociación</Text>
                <TouchableOpacity onPress={() => setNegPickerVisible(false)}>
                  <FontAwesome name="close" size={18} color={currentColors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {negotiations.map((n) => (
                  <TouchableOpacity
                    key={n.id}
                    style={[localStyles.pickerItem, { borderBottomColor: currentColors.border }]}
                    onPress={() => {
                      setSelectedNegotiation(n);
                      setNegPickerVisible(false);
                    }}
                  >
                    <Text style={{ color: currentColors.text }}>{n.clientName}</Text>
                    <Text style={{ color: currentColors.mutedForeground, fontSize: 12 }}>{n.planName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={typePickerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setTypePickerVisible(false)}
        >
          <View style={localStyles.pickerOverlay}>
            <View style={[localStyles.pickerContainer, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
              <View style={localStyles.pickerHeader}>
                <Text style={[localStyles.pickerTitle, { color: currentColors.text }]}>Seleccionar Tipo</Text>
                <TouchableOpacity onPress={() => setTypePickerVisible(false)}>
                  <FontAwesome name="close" size={18} color={currentColors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {documentTypes.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[localStyles.pickerItem, { borderBottomColor: currentColors.border }]}
                    onPress={() => {
                      setSelectedDocType(t);
                      setTypePickerVisible(false);
                    }}
                  >
                    <Text style={{ color: currentColors.text }}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </Modal>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerLoader: {
    padding: 40,
    alignItems: "center",
  },
  modalForm: {
    flexGrow: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  selectButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  fileRow: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  fileName: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  uploadArea: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 10,
    height: 48,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "80%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
});
