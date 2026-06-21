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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Aprobado: { bg: "#D1FAE5", text: "#065F46" },
  Enviado: { bg: "#DBEAFE", text: "#1E40AF" },
  Negociación: { bg: "#13a3ec", text: "#ffffff" },
  Cierre: { bg: "#13a3ec", text: "#ffffff" },
  Prospección: { bg: "#F3F4F6", text: "#374151" },
  "Post-venta": { bg: "#F3F4F6", text: "#374151" },
  "Contacto Inicial": { bg: "#F3F4F6", text: "#374151" },
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

  const statusStyle = STATUS_COLORS[status ?? ""] ?? {
    bg: "#F3F4F6",
    text: "#374151",
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ── Header ── */}
      <RNView style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={18} color="#374151" />
          <Text style={styles.backText}>Negociaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
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
        >
          <FontAwesome name="pencil" size={14} color="#374151" />
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
      </RNView>

      {/* ── Título + badges ── */}
      <RNView style={styles.titleRow}>
        <Text style={styles.clientName}>{clientName}</Text>
        <RNView style={styles.badgesRow}>
          {status && (
            <RNView style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                {status}
              </Text>
            </RNView>
          )}
          {planName && (
            <RNView style={[styles.badge, { backgroundColor: "#F3F4F6" }]}>
              <Text style={[styles.badgeText, { color: "#374151" }]}>
                {planName}
              </Text>
            </RNView>
          )}
        </RNView>
      </RNView>

      {/* ── Detalles en grid 2 columnas ── */}
      <RNView style={styles.detailCard}>
        <Text style={styles.sectionLabel}>DETALLES</Text>

        <RNView style={styles.grid}>
          <RNView style={styles.gridItem}>
            <FontAwesome
              name="user-o"
              size={13}
              color="#6B7280"
              style={styles.detailIcon}
            />
            <Text style={styles.detailKey}>Asesor</Text>
            <Text style={styles.detailValue}>{advisorName ?? "—"}</Text>
          </RNView>

          <RNView style={styles.gridItem}>
            <FontAwesome
              name="dollar"
              size={13}
              color="#6B7280"
              style={styles.detailIcon}
            />
            <Text style={styles.detailKey}>Monto</Text>
            <Text style={styles.detailValue}>{amount ?? "—"}</Text>
          </RNView>

          <RNView style={styles.gridItem}>
            <FontAwesome
              name="calendar-o"
              size={13}
              color="#6B7280"
              style={styles.detailIcon}
            />
            <Text style={styles.detailKey}>Fecha inicio</Text>
            <Text style={styles.detailValue}>{date ?? "—"}</Text>
          </RNView>

          <RNView style={styles.gridItem}>
            <FontAwesome
              name="calendar-check-o"
              size={13}
              color="#6B7280"
              style={styles.detailIcon}
            />
            <Text style={styles.detailKey}>Cierre est.</Text>
            <Text style={styles.detailValue}>{estimatedCloseDate ?? "—"}</Text>
          </RNView>
        </RNView>
      </RNView>

      {/* ── Tabs ── */}
      <RNView style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
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
          <Text style={styles.emptyText}>Sin historial registrado.</Text>
        )}
        {activeTab === "Visitas" && (
          <Text style={styles.emptyText}>Sin visitas registradas.</Text>
        )}
        {activeTab === "Documentos" && (
          <Text style={styles.emptyText}>Sin documentos adjuntos.</Text>
        )}
        {activeTab === "Matrices" && (
          <Text style={styles.emptyText}>Sin matrices disponibles.</Text>
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
    color: "#111827",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
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
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  /* tabs */
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#13a3ec",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#13a3ec",
    fontWeight: "600",
  },

  /* tab content */
  tabContent: {
    minHeight: 80,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});
