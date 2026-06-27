import { Text } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import { router, useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useCallback } from "react";
import {
    ActivityIndicator,
    View as RNView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Pressable,
    FlatList,
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import * as Location from "expo-location";
import { useAuth } from "@/context/AuthContext";
import BackButton from "./BackButton";
import EditarButton from "./EditarButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import {
  getNegotiation,
  getNegotiationDocuments,
  DocumentItem,
  getNegotiationVisits,
  getVisitTypes,
  createVisit,
  VisitItem,
  getNegotiationMatrices,
  createOfferMatrix,
  getMatrixAttachments,
  createMatrixAttachment,
  uploadDocumentFile,
} from "@/services/ClientServices";
import { getAccessToken, API_URL } from "@/services/api";

interface Props {
  id?: string;
  clientName?: string;
  planName?: string;
  amount?: string;
  status?: string;
  date?: string;
  advisorName?: string;
  estimatedCloseDate?: string;
}

const STAGE_CONFIG: Record<
  string,
  {
    light: { bg: string; text: string };
    dark: { bg: string; text: string };
    icon: string;
    label: string;
  }
> = {
  Prospeccion: {
    light: { bg: "#FEF3C7", text: "#D97706" },
    dark: { bg: "rgba(245, 158, 11, 0.15)", text: "#FBBF24" },
    icon: "bullseye",
    label: "Prospección",
  },
  Prospección: {
    light: { bg: "#FEF3C7", text: "#D97706" },
    dark: { bg: "rgba(245, 158, 11, 0.15)", text: "#FBBF24" },
    icon: "bullseye",
    label: "Prospección",
  },
  "Contacto Inicial": {
    light: { bg: "#F3E8FF", text: "#7C3AED" },
    dark: { bg: "rgba(168, 85, 247, 0.15)", text: "#C084FC" },
    icon: "comments-o",
    label: "Contacto Inicial",
  },
  Negociacion: {
    light: { bg: "#DBEAFE", text: "#2563EB" },
    dark: { bg: "rgba(59, 130, 246, 0.15)", text: "#60A5FA" },
    icon: "handshake-o",
    label: "Negociación",
  },
  Negociación: {
    light: { bg: "#DBEAFE", text: "#2563EB" },
    dark: { bg: "rgba(59, 130, 246, 0.15)", text: "#60A5FA" },
    icon: "handshake-o",
    label: "Negociación",
  },
  Cierre: {
    light: { bg: "#D1FAE5", text: "#059669" },
    dark: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ADE80" },
    icon: "check-circle-o",
    label: "Cierre",
  },
  "Post-venta": {
    light: { bg: "#CCFBF1", text: "#0D9488" },
    dark: { bg: "rgba(20, 184, 166, 0.15)", text: "#2DD4BF" },
    icon: "star-o",
    label: "Post-venta",
  },
};

const DEFAULT_CONFIG = {
  light: { bg: "#F3F4F6", text: "#4B5563" },
  dark: { bg: "rgba(156, 163, 175, 0.15)", text: "#D1D5DB" },
  icon: "tag",
  label: "Status",
};

const TABS = ["Visitas", "Documentos", "Matrices", "Comentarios"] as const;
type Tab = (typeof TABS)[number];

export default function NegotiationDetailView({
  id,
  clientName: initialClientName,
  planName: initialPlanName,
  amount: initialAmount,
  status: initialStatus,
  date: initialDate,
  advisorName: initialAdvisorName,
  estimatedCloseDate: initialEstimatedCloseDate,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Visitas");
  const [clientName, setClientName] = useState(initialClientName);
  const [planName, setPlanName] = useState(initialPlanName);
  const [amount, setAmount] = useState(initialAmount);
  const [status, setStatus] = useState(initialStatus);
  const [date, setDate] = useState(initialDate);
  const [advisorName, setAdvisorName] = useState(initialAdvisorName);
  const [estimatedCloseDate, setEstimatedCloseDate] = useState(initialEstimatedCloseDate);
  const [observations, setObservations] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const { user } = useAuth();
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Visits state
  const [visitsList, setVisitsList] = useState<VisitItem[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [visitTypesList, setVisitTypesList] = useState<any[]>([]);

  // Create visit form state
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [selectedVisitType, setSelectedVisitType] = useState<any>(null);
  const [visitTypeModalVisible, setVisitTypeModalVisible] = useState(false);
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visitObservations, setVisitObservations] = useState("");
  const [submittingVisit, setSubmittingVisit] = useState(false);

  // Matrices state
  const [matrixId, setMatrixId] = useState<string | null>(null);
  const [offerMatrixFile, setOfferMatrixFile] = useState<{ id?: string; name: string; isUploaded: boolean } | null>(null);
  const [emailTemplateFile, setEmailTemplateFile] = useState<{ id?: string; name: string; isUploaded: boolean } | null>(null);
  const [pendingOfferFile, setPendingOfferFile] = useState<any | null>(null);
  const [pendingEmailFile, setPendingEmailFile] = useState<any | null>(null);
  const [submittingMatrices, setSubmittingMatrices] = useState(false);

  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const currentColors = Colors[scheme ?? "light"];
  const placeholderColor = scheme === "dark" ? "#5c6e8c" : "#9CA3AF";

  const toLocalYYYYMMDD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const calendarTheme = {
    calendarBackground: currentColors.card,
    textSectionTitleColor: currentColors.mutedForeground,
    selectedDayBackgroundColor: currentColors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: currentColors.primary,
    dayTextColor: currentColors.text,
    textDisabledColor: currentColors.border,
    dotColor: currentColors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: currentColors.primary,
    disabledArrowColor: currentColors.border,
    monthTextColor: currentColors.text,
    indicatorColor: currentColors.primary,
  };

  useFocusEffect(
    useCallback(() => {
      console.log("[DEBUG] useFocusEffect triggered, id =", id);
      if (id) {
        loadNegotiationDetails();
        loadVisitTypes();
      }
    }, [id])
  );

  async function loadVisitTypes() {
    try {
      const types = await getVisitTypes();
      console.log("[DEBUG] loadVisitTypes returned:", JSON.stringify(types));
      setVisitTypesList(types);
    } catch (error) {
      console.warn("Error loading visit types:", error);
    }
  }

  async function loadNegotiationDetails() {
    console.log("[DEBUG] loadNegotiationDetails started for id =", id);
    setLoadingDetails(true);
    setLoadingDocs(true);
    setLoadingVisits(true);
    try {
      // 1. Fetch negotiation details first to get the clientId
      const fresh = await getNegotiation(id!);
      console.log("[DEBUG] getNegotiation returned clientId =", fresh.clientId);
      setClientId(fresh.clientId);
      setClientName(fresh.clientName);
      setPlanName(fresh.planName);
      setAmount(fresh.amount);
      setStatus(fresh.status);
      setDate(fresh.date);
      setAdvisorName(fresh.advisorName);
      setEstimatedCloseDate(fresh.estimatedCloseDate);
      setObservations(fresh.observations);
      setIsActive(fresh.isActive);

      // 2. Fetch documents, visits and matrices in parallel
      const docsPromise = getNegotiationDocuments(id!);
      const visitsPromise = fresh.clientId
        ? getNegotiationVisits(fresh.clientId)
        : Promise.resolve([]);
      const matricesPromise = getNegotiationMatrices(id!);

      console.log("[DEBUG] Fetching documents, visits and matrices in parallel...");
      const [docs, visits, matrices] = await Promise.all([docsPromise, visitsPromise, matricesPromise]);
      
      console.log("[DEBUG] Loaded docs length =", docs.length, "visits length =", visits.length);
      setDocuments(docs);
      setVisitsList(visits);

      if (matrices && matrices.length > 0) {
        const activeMatrix = matrices[0];
        setMatrixId(activeMatrix.id);
        const atts = await getMatrixAttachments(activeMatrix.id);
        
        const offerAtt = atts.find((a: any) => a.attachmentType === "OFFER_MATRIX");
        const emailAtt = atts.find((a: any) => a.attachmentType === "EMAIL_TEMPLATE");
        
        if (offerAtt) {
          setOfferMatrixFile({ name: offerAtt.filename, isUploaded: true });
        } else {
          setOfferMatrixFile(null);
        }
        
        if (emailAtt) {
          setEmailTemplateFile({ name: emailAtt.filename, isUploaded: true });
        } else {
          setEmailTemplateFile(null);
        }
      } else {
        setMatrixId(null);
        setOfferMatrixFile(null);
        setEmailTemplateFile(null);
      }
    } catch (error) {
      console.warn("[DEBUG] loadNegotiationDetails failed:", error);
    } finally {
      setLoadingDetails(false);
      setLoadingDocs(false);
      setLoadingVisits(false);
    }
  }

  async function handleSubmitVisit() {
    if (!selectedVisitType) {
      Alert.alert("Error", "Por favor seleccione un tipo de visita.");
      return;
    }
    if (!clientId) {
      Alert.alert("Error", "No se encontró el ID del cliente de la negociación.");
      return;
    }

    setSubmittingVisit(true);
    let gpsData: any = {};

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        gpsData = {
          gpsLatitude: location.coords.latitude,
          gpsLongitude: location.coords.longitude,
          gpsAccuracy: location.coords.accuracy || undefined,
          gpsTimestamp: new Date(location.timestamp).toISOString(),
        };
      } else {
        console.warn("GPS Permission not granted");
      }
    } catch (err) {
      console.warn("Error fetching geolocation data:", err);
    }

    try {
      await createVisit({
        negotiationId: id,
        clientId: clientId,
        advisorId: user?.id || "",
        visitTypeId: selectedVisitType.id,
        visitDate: visitDate.toISOString(),
        observations: visitObservations || undefined,
        ...gpsData,
      });

      Alert.alert("Éxito", "Visita guardada correctamente.");
      setVisitModalVisible(false);
      setSelectedVisitType(null);
      setVisitObservations("");
      setVisitDate(new Date());

      // Reload visits list
      setLoadingVisits(true);
      const visits = await getNegotiationVisits(clientId);
      setVisitsList(visits);
    } catch (error: any) {
      console.warn("Error creating visit:", error);
      Alert.alert("Error", error?.message || "Ocurrió un error al guardar la visita.");
    } finally {
      setSubmittingVisit(false);
      setLoadingVisits(false);
    }
  }

  const handlePickFile = async (type: "OFFER_MATRIX" | "EMAIL_TEMPLATE") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "application/pdf",
          "image/*",
          "text/*"
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      if (type === "OFFER_MATRIX") {
        setPendingOfferFile(file);
      } else {
        setPendingEmailFile(file);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "No se pudo seleccionar el archivo.");
    }
  };

  const handleSaveMatrices = async () => {
    setSubmittingMatrices(true);
    try {
      let currentMatrixId = matrixId;
      
      // 1. Create matrix if it doesn't exist
      if (!currentMatrixId) {
        console.log("[DEBUG] No matrix exists, creating one...");
        const matrixResult = await createOfferMatrix({
          negotiationId: id!,
          observations: "",
        });
        currentMatrixId = matrixResult.id;
        setMatrixId(currentMatrixId);
      }
      
      // 2. Upload pending Offer Matrix if present
      if (pendingOfferFile) {
        console.log("[DEBUG] Uploading pending OFFER_MATRIX file...");
        const uploadResponse = await uploadDocumentFile(
          pendingOfferFile.uri,
          pendingOfferFile.name,
          pendingOfferFile.mimeType || "application/octet-stream"
        );
        
        await createMatrixAttachment(currentMatrixId, {
          matrixId: currentMatrixId,
          attachmentType: "OFFER_MATRIX",
          filename: uploadResponse.filename,
          fileExtension: uploadResponse.fileExtension,
          fileSizeMb: uploadResponse.fileSizeMb,
          storagePath: uploadResponse.storagePath,
          mimeType: uploadResponse.mimeType,
          encryptionMetadata: uploadResponse.encryptionMetadata,
        });
        
        setOfferMatrixFile({ name: uploadResponse.filename, isUploaded: true });
        setPendingOfferFile(null);
      }

      // 3. Upload pending Email Template if present
      if (pendingEmailFile) {
        console.log("[DEBUG] Uploading pending EMAIL_TEMPLATE file...");
        const uploadResponse = await uploadDocumentFile(
          pendingEmailFile.uri,
          pendingEmailFile.name,
          pendingEmailFile.mimeType || "application/octet-stream"
        );
        
        await createMatrixAttachment(currentMatrixId, {
          matrixId: currentMatrixId,
          attachmentType: "EMAIL_TEMPLATE",
          filename: uploadResponse.filename,
          fileExtension: uploadResponse.fileExtension,
          fileSizeMb: uploadResponse.fileSizeMb,
          storagePath: uploadResponse.storagePath,
          mimeType: uploadResponse.mimeType,
          encryptionMetadata: uploadResponse.encryptionMetadata,
        });
        
        setEmailTemplateFile({ name: uploadResponse.filename, isUploaded: true });
        setPendingEmailFile(null);
      }

      Alert.alert("Éxito", "Matriz y adjuntos guardados correctamente.");
      
      // Refresh list to sync state
      await loadNegotiationDetails();
    } catch (error: any) {
      console.warn("Error saving matrices:", error);
      Alert.alert("Error", error?.message || "Ocurrió un error al guardar los archivos.");
    } finally {
      setSubmittingMatrices(false);
    }
  };

  const statusStr = status as string;
  const config = STAGE_CONFIG[statusStr] || DEFAULT_CONFIG;
  const s = scheme === "dark" ? config.dark : config.light;

  if (loadingDetails) {
    return (
      <RNView
        style={[
          globalStyles.loadingContainer,
          { backgroundColor: currentColors.background, paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={currentColors.primary} />
      </RNView>
    );
  }

  return (
    <ScrollView
      style={[globalStyles.container, { paddingTop: insets.top, backgroundColor: currentColors.background }]}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: currentColors.background }]}
    >
      {/* ── Header ── */}
      <RNView style={styles.topBar}>
        <BackButton />

        <EditarButton
          onPress={() =>
            router.push({
              pathname: "/edit-negotiation",
              params: {
                id,
                clientName,
                planName,
                amount,
                status,
                date,
                advisorName,
                estimatedCloseDate,
                observations,
                isActive: isActive ? "true" : "false",
              },
            })
          }
        />
      </RNView>

      {/* ── Título + badges ── */}
      <RNView style={styles.titleRow}>
        <Text style={[styles.clientName, { color: currentColors.text }]}>{clientName}</Text>
        <RNView style={styles.badgesRow}>
          {status && (
            <RNView style={[styles.badge, { backgroundColor: s.bg }]}>
              <Text style={[styles.badgeText, { color: s.text }]}>
                {config.label}
              </Text>
            </RNView>
          )}
          <RNView
            style={[
              styles.badge,
              {
                backgroundColor: isActive
                  ? scheme === "dark" ? "rgba(34, 197, 94, 0.2)" : "#DCFCE7"
                  : scheme === "dark" ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: isActive
                    ? scheme === "dark" ? "#4ADE80" : "#166534"
                    : scheme === "dark" ? "#F87171" : "#991B1B",
                },
              ]}
            >
              {isActive ? "Activa" : "Inactiva"}
            </Text>
          </RNView>
        </RNView>
      </RNView>

      <RNView style={[styles.detailCard, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
        <Text style={[styles.sectionLabel, { color: currentColors.mutedForeground }]}>DETALLES</Text>

        <RNView style={styles.grid}>
          <RNView style={styles.gridItem}>
            <FontAwesome
              name="user-o"
              size={13}
              color={currentColors.mutedForeground}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailKey, { color: currentColors.mutedForeground }]}>Asesor</Text>
            <Text style={[styles.detailValue, { color: currentColors.text }]}>{advisorName ?? "—"}</Text>
          </RNView>

          <RNView style={styles.gridItem}>
            <FontAwesome
              name="dollar"
              size={13}
              color={currentColors.mutedForeground}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailKey, { color: currentColors.mutedForeground }]}>Facturación mensual</Text>
            <Text style={[styles.detailValue, { color: currentColors.text }]}>{amount ?? "—"}</Text>
          </RNView>

          <RNView style={styles.gridItem}>
            <FontAwesome
              name="calendar-o"
              size={13}
              color={currentColors.mutedForeground}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailKey, { color: currentColors.mutedForeground }]}>Fecha inicio</Text>
            <Text style={[styles.detailValue, { color: currentColors.text }]}>{date ?? "—"}</Text>
          </RNView>

          <RNView style={styles.gridItem}>
            <FontAwesome
              name="calendar-check-o"
              size={13}
              color={currentColors.mutedForeground}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailKey, { color: currentColors.mutedForeground }]}>Cierre est.</Text>
            <Text style={[styles.detailValue, { color: currentColors.text }]}>{estimatedCloseDate ?? "—"}</Text>
          </RNView>
        </RNView>
      </RNView>

      {/* ── Tabs ── */}
      <RNView style={[styles.tabsRow, { borderBottomColor: currentColors.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [styles.tabActive, { borderBottomColor: currentColors.primary }],
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: currentColors.mutedForeground },
                activeTab === tab && [styles.tabTextActive, { color: currentColors.primary }],
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </RNView>

      <RNView style={styles.tabContent}>
        {activeTab === "Visitas" && (
          <RNView style={{ gap: 12, backgroundColor: "transparent" }}>
            <TouchableOpacity
              style={[
                globalStyles.actionButton,
                { backgroundColor: currentColors.primary, marginBottom: 0 },
              ]}
              onPress={() => {
                loadVisitTypes();
                setVisitModalVisible(true);
              }}
            >
              <FontAwesome
                name="plus"
                size={14}
                color="white"
                style={globalStyles.actionIcon}
              />
              <Text style={globalStyles.actionButtonText}>Agregar Visita</Text>
            </TouchableOpacity>

            {loadingVisits ? (
              <ActivityIndicator size="small" color={currentColors.primary} style={{ marginTop: 12 }} />
            ) : visitsList.length === 0 ? (
              <Text style={[styles.emptyText, { color: currentColors.mutedForeground, marginTop: 12 }]}>
                Sin visitas registradas.
              </Text>
            ) : (
              visitsList.map((visit) => (
                <RNView
                  key={visit.id}
                  style={[
                    styles.visitCard,
                    {
                      backgroundColor: currentColors.card,
                      borderColor: currentColors.border,
                    },
                  ]}
                >
                  <RNView style={styles.visitHeader}>
                    <Text style={[styles.visitTypeName, { color: currentColors.text }]}>
                      {visit.visitType?.name || "Visita"}
                    </Text>
                    <RNView
                      style={[
                        globalStyles.statusBadge,
                        {
                          backgroundColor: visit.isVerified
                            ? scheme === "dark" ? "rgba(34, 197, 94, 0.2)" : "#DCFCE7"
                            : scheme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#FEF3C7",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          color: visit.isVerified
                            ? scheme === "dark" ? "#4ADE80" : "#166534"
                            : scheme === "dark" ? "#FBBF24" : "#92400E",
                        }}
                      >
                        {visit.isVerified ? "Verificada" : "Pendiente"}
                      </Text>
                    </RNView>
                  </RNView>

                  <Text style={[styles.visitDetail, { color: currentColors.text }]}>
                    Fecha: {visit.visitDate}
                  </Text>

                  <Text style={[styles.visitDetail, { color: currentColors.mutedForeground }]}>
                    Asesor: {visit.advisor?.profile ? `${visit.advisor.profile.firstName} ${visit.advisor.profile.lastName}` : visit.advisor?.username}
                  </Text>

                  {visit.observations ? (
                    <Text style={[styles.visitObservations, { color: currentColors.mutedForeground }]}>
                      Obs: {visit.observations}
                    </Text>
                  ) : null}
                </RNView>
              ))
            )}
          </RNView>
        )}
        {activeTab === "Documentos" && (
          <RNView style={styles.documentsContainer}>
            {loadingDocs ? (
              <ActivityIndicator size="small" color={currentColors.primary} />
            ) : documents.length === 0 ? (
              <Text style={[styles.emptyText, { color: currentColors.mutedForeground }]}>
                Sin documentos adjuntos.
              </Text>
            ) : (
              documents.map((doc) => {
                const handleViewDoc = async () => {
                  const token = getAccessToken();
                  if (!token) return;
                  const downloadUrl = `${API_URL}/api/v1/documents/${doc.id}/download?token=${token}`;
                  try {
                    await WebBrowser.openBrowserAsync(downloadUrl);
                  } catch (err) {
                    console.error("Failed to open document browser:", err);
                    alert("No se pudo visualizar el documento.");
                  }
                };

                return (
                  <RNView
                    key={doc.id}
                    style={[
                      styles.documentRow,
                      {
                        backgroundColor: currentColors.card,
                        borderColor: currentColors.border,
                      },
                    ]}
                  >
                    <RNView style={styles.documentInfo}>
                      <Text
                        style={[styles.documentName, { color: currentColors.text }]}
                        numberOfLines={1}
                      >
                        {doc.fileName}
                      </Text>
                      <Text style={{ fontSize: 11, color: currentColors.mutedForeground, marginTop: 2 }}>
                        Fecha: {doc.date}
                      </Text>
                    </RNView>

                    <TouchableOpacity
                      style={[
                        styles.viewButton,
                        { backgroundColor: currentColors.primary + "15" },
                      ]}
                      onPress={handleViewDoc}
                    >
                      <FontAwesome name="eye" size={14} color={currentColors.primary} />
                    </TouchableOpacity>
                  </RNView>
                );
              })
            )}
          </RNView>
        )}
        
        {activeTab === "Comentarios" && (
          <Text style={[styles.commentsText, { color: currentColors.text }]}>
            {observations || "Sin comentarios registrados."}
          </Text>
        )}

        {activeTab === "Matrices" && (
          <RNView style={{ gap: 16, backgroundColor: "transparent" }}>
            <Text style={[styles.sectionLabel, { color: currentColors.mutedForeground }]}>MATRICES DE LA NEGOCIACIÓN</Text>
            
            {/* Offer Matrix Slot */}
            <RNView style={[localStyles.fileCard, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
              <RNView style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <FontAwesome name="file-excel-o" size={24} color="#1D7444" />
                <RNView style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", color: currentColors.text }}>Matriz de Oferta</Text>
                  <Text style={{ fontSize: 12, color: currentColors.mutedForeground }}>Hoja de cálculo de oferta comercial</Text>
                </RNView>
              </RNView>
              
              {offerMatrixFile ? (
                <RNView style={[localStyles.uploadedStatusBox, { backgroundColor: currentColors.secondary + "40" }]}>
                  <FontAwesome name="check-circle" size={16} color="#10B981" />
                  <Text style={{ fontSize: 13, color: currentColors.text, marginLeft: 6 }} numberOfLines={1}>
                    Subido: {offerMatrixFile.name}
                  </Text>
                </RNView>
              ) : pendingOfferFile ? (
                <RNView style={{ marginTop: 12 }}>
                  <RNView style={[localStyles.uploadedStatusBox, { backgroundColor: "#FFFBEB" }]}>
                    <FontAwesome name="file" size={14} color="#D97706" />
                    <Text style={{ fontSize: 13, color: "#92400E", marginLeft: 6 }} numberOfLines={1}>
                      Subido: {pendingOfferFile.name}
                    </Text>
                    <TouchableOpacity onPress={() => setPendingOfferFile(null)} style={{ marginLeft: "auto" }}>
                      <FontAwesome name="times-circle" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </RNView>
                </RNView>
              ) : (
                <TouchableOpacity
                  style={[localStyles.uploadSlotBtn, { borderColor: currentColors.border, backgroundColor: currentColors.secondary + "20" }]}
                  onPress={() => handlePickFile("OFFER_MATRIX")}
                >
                  <FontAwesome name="upload" size={14} color={currentColors.primary} />
                  <Text style={{ color: currentColors.primary, fontWeight: "600", marginLeft: 8 }}>Subir Archivo</Text>
                </TouchableOpacity>
              )}
            </RNView>

            {/* Email Template Slot */}
            <RNView style={[localStyles.fileCard, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
              <RNView style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <FontAwesome name="envelope-o" size={24} color="#1D4ED8" />
                <RNView style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", color: currentColors.text }}>Plantilla de Correo</Text>
                  <Text style={{ fontSize: 12, color: currentColors.mutedForeground }}>Cuerpo de correo para el cliente</Text>
                </RNView>
              </RNView>
              
              {emailTemplateFile ? (
                <RNView style={[localStyles.uploadedStatusBox, { backgroundColor: currentColors.secondary + "40" }]}>
                  <FontAwesome name="check-circle" size={16} color="#10B981" />
                  <Text style={{ fontSize: 13, color: currentColors.text, marginLeft: 6 }} numberOfLines={1}>
                    Subido: {emailTemplateFile.name}
                  </Text>
                </RNView>
              ) : pendingEmailFile ? (
                <RNView style={{ marginTop: 12 }}>
                  <RNView style={[localStyles.uploadedStatusBox, { backgroundColor: "#FFFBEB" }]}>
                    <FontAwesome name="file" size={14} color="#D97706" />
                    <Text style={{ fontSize: 13, color: "#92400E", marginLeft: 6 }} numberOfLines={1}>
                      Subido: {pendingEmailFile.name}
                    </Text>
                    <TouchableOpacity onPress={() => setPendingEmailFile(null)} style={{ marginLeft: "auto" }}>
                      <FontAwesome name="times-circle" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </RNView>
                </RNView>
              ) : (
                <TouchableOpacity
                  style={[localStyles.uploadSlotBtn, { borderColor: currentColors.border, backgroundColor: currentColors.secondary + "20" }]}
                  onPress={() => handlePickFile("EMAIL_TEMPLATE")}
                >
                  <FontAwesome name="upload" size={14} color={currentColors.primary} />
                  <Text style={{ color: currentColors.primary, fontWeight: "600", marginLeft: 8 }}>Subir Archivo</Text>
                </TouchableOpacity>
              )}
            </RNView>
            
            {/* Guardar Button */}
            {(pendingOfferFile || pendingEmailFile) && (
              <TouchableOpacity
                style={[localStyles.saveMatricesBtn, { backgroundColor: currentColors.primary }]}
                onPress={handleSaveMatrices}
                disabled={submittingMatrices}
              >
                {submittingMatrices ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>Guardar</Text>
                )}
              </TouchableOpacity>
            )}
          </RNView>
        )}
      </RNView>

      {/* --- ADD VISIT MODAL --- */}
      <Modal visible={visitModalVisible} transparent animationType="fade">
        <Pressable
          style={localStyles.modalOverlay}
          onPress={() => {
            if (visitTypeModalVisible) {
              setVisitTypeModalVisible(false);
            } else {
              setVisitModalVisible(false);
            }
          }}
        >
          <Pressable
            style={[localStyles.modalContainer, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <RNView style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: currentColors.text }]}>
                Agregar Visita
              </Text>
              <TouchableOpacity onPress={() => setVisitModalVisible(false)}>
                <FontAwesome name="times" size={18} color={currentColors.text} />
              </TouchableOpacity>
            </RNView>

            <ScrollView style={{ flexGrow: 0 }} showsVerticalScrollIndicator={false}>
              {/* Visit Type Dropdown Trigger */}
              <Text style={[localStyles.label, { color: currentColors.text }]}>
                Tipo de Visita
              </Text>
              <TouchableOpacity
                style={[localStyles.selector, { borderColor: currentColors.border }]}
                onPress={() => setVisitTypeModalVisible(true)}
              >
                <Text style={{ color: selectedVisitType ? currentColors.text : currentColors.mutedForeground }}>
                  {selectedVisitType ? selectedVisitType.name : "Seleccionar tipo..."}
                </Text>
                <FontAwesome name="chevron-down" size={12} color={currentColors.mutedForeground} />
              </TouchableOpacity>

              {/* Visit Date Calendar Trigger */}
              <Text style={[localStyles.label, { color: currentColors.text }]}>
                Fecha de la Visita
              </Text>
              <TouchableOpacity
                style={[localStyles.selector, { borderColor: currentColors.border }]}
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Text style={{ color: currentColors.text }}>
                  {visitDate.toLocaleDateString("es-ES")}
                </Text>
                <FontAwesome name="calendar-o" size={14} color={currentColors.mutedForeground} />
              </TouchableOpacity>

              {showDatePicker && (
                <RNView style={{ borderWidth: 1, borderColor: currentColors.border, borderRadius: 8, overflow: "hidden", marginVertical: 8 }}>
                  <Calendar
                    current={toLocalYYYYMMDD(visitDate)}
                    onDayPress={(day) => {
                      setVisitDate(new Date(day.year, day.month - 1, day.day));
                      setShowDatePicker(false);
                    }}
                    theme={calendarTheme}
                  />
                </RNView>
              )}

              {/* Observations Input */}
              <Text style={[localStyles.label, { color: currentColors.text }]}>
                Observaciones
              </Text>
              <TextInput
                style={[
                  localStyles.textarea,
                  {
                    borderColor: currentColors.border,
                    backgroundColor: currentColors.background,
                    color: currentColors.text,
                  },
                ]}
                multiline
                value={visitObservations}
                onChangeText={setVisitObservations}
                placeholder="Detalles sobre lo conversado..."
                placeholderTextColor={placeholderColor}
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  localStyles.submitButton,
                  {
                    backgroundColor: currentColors.primary,
                    opacity: (submittingVisit || !selectedVisitType) ? 0.6 : 1,
                  },
                ]}
                disabled={submittingVisit || !selectedVisitType}
                onPress={handleSubmitVisit}
              >
                {submittingVisit ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={localStyles.submitButtonText}>Guardar Visita</Text>
                )}
              </TouchableOpacity>
            </ScrollView>

            {/* --- VISIT TYPE SELECTION INLINE OVERLAY --- */}
            {visitTypeModalVisible && (
              <Pressable
                style={[StyleSheet.absoluteFill, localStyles.inlinePickerOverlay]}
                onPress={() => setVisitTypeModalVisible(false)}
              >
                <Pressable
                  style={[localStyles.inlinePickerContainer, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}
                  onPress={(e) => e.stopPropagation()}
                >
                  <RNView style={localStyles.pickerHeader}>
                    <Text style={[localStyles.pickerTitle, { color: currentColors.text }]}>Seleccionar Tipo de Visita</Text>
                    <TouchableOpacity onPress={() => setVisitTypeModalVisible(false)}>
                      <FontAwesome name="close" size={18} color={currentColors.text} />
                    </TouchableOpacity>
                  </RNView>
                  <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled={true}>
                    {visitTypesList.length === 0 ? (
                      <Text style={{ color: currentColors.mutedForeground, fontSize: 13, textAlign: "center", paddingVertical: 20 }}>
                        No se encontraron tipos de visita
                      </Text>
                    ) : (
                      visitTypesList.map((t) => (
                        <TouchableOpacity
                          key={t.id}
                          style={[localStyles.pickerItem, { borderBottomColor: currentColors.border }]}
                          onPress={() => {
                            setSelectedVisitType(t);
                            setVisitTypeModalVisible(false);
                          }}
                        >
                          <Text style={{ color: currentColors.text, fontSize: 14 }}>{t.name}</Text>
                          <Text style={{ color: currentColors.mutedForeground, fontSize: 11, marginTop: 2 }}>{t.description}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </Pressable>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /* top bar */
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 4,
  },

  /* título + badges */
  titleRow: {
    marginBottom: 16,
    gap: 8,
  },
  clientName: {
    fontSize: 24,
    fontWeight: "700",
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* detail card */
  detailCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  gridItem: {
    width: "50%",
    paddingRight: 8,
  },
  detailIcon: {
    marginBottom: 2,
  },
  detailKey: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* tabs */
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
  },
  tabTextActive: {
    fontWeight: "600",
  },

  /* tab content */
  tabContent: {
    minHeight: 80,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  documentsContainer: {
    gap: 10,
    backgroundColor: "transparent",
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  documentInfo: {
    flex: 1,
    paddingRight: 10,
    backgroundColor: "transparent",
  },
  documentName: {
    fontSize: 13,
    fontWeight: "600",
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    paddingHorizontal: 6,
  },
  visitCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  visitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  visitTypeName: {
    fontSize: 14,
    fontWeight: "700",
  },
  visitDetail: {
    fontSize: 12,
    marginBottom: 4,
  },
  visitObservations: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
});

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
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 8,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  submitButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    height: 48,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  inlinePickerOverlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  inlinePickerContainer: {
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
  fileCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  uploadSlotBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  uploadedStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  saveMatricesBtn: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    height: 48,
  },
});
