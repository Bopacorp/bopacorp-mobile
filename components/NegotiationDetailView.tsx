import { Text } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    View as RNView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./BackButton";
import EditarButton from "./EditarButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

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

const TABS = ["Historial", "Visitas", "Documentos", "Matrices"] as const;
type Tab = (typeof TABS)[number];

export default function NegotiationDetailView({
  id,
  clientName,
  planName,
  amount,
  status,
  date,
  advisorName,
  estimatedCloseDate,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Historial");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const currentColors = Colors[scheme ?? "light"];

  const statusStr = status as string;
  const config = STAGE_CONFIG[statusStr] || DEFAULT_CONFIG;
  const s = scheme === "dark" ? config.dark : config.light;

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
          {planName && (
            <RNView style={[styles.badge, { backgroundColor: currentColors.muted }]}>
              <Text style={[styles.badgeText, { color: currentColors.text }]}>
                {planName}
              </Text>
            </RNView>
          )}
        </RNView>
      </RNView>

      {/* ── Detalles en grid 2 columnas ── */}
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
            <Text style={[styles.detailKey, { color: currentColors.mutedForeground }]}>Monto</Text>
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

      {/* ── Contenido del tab activo ── */}
      <RNView style={styles.tabContent}>
        {activeTab === "Historial" && (
          <Text style={[styles.emptyText, { color: currentColors.mutedForeground }]}>Sin historial registrado.</Text>
        )}
        {activeTab === "Visitas" && (
          <RNView style={{ gap: 12, backgroundColor: "transparent" }}>
            <TouchableOpacity
              style={[
                globalStyles.actionButton,
                { backgroundColor: currentColors.primary, marginBottom: 0 },
              ]}
              onPress={() => {
                alert("Función para agregar visita próximamente");
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

            <Text style={[styles.emptyText, { color: currentColors.mutedForeground, marginTop: 12 }]}>
              Sin visitas registradas.
            </Text>
          </RNView>
        )}
        {activeTab === "Documentos" && (
          <Text style={[styles.emptyText, { color: currentColors.mutedForeground }]}>Sin documentos adjuntos.</Text>
        )}
        {activeTab === "Matrices" && (
          <Text style={[styles.emptyText, { color: currentColors.mutedForeground }]}>Sin matrices disponibles.</Text>
        )}
      </RNView>
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
});
