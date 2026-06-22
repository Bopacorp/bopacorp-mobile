import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Negotiation } from "@/services/ClientServices";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface NegotiationCardProps {
  negotiation: Negotiation;
  colorScheme: "light" | "dark";
  onPress?: () => void;
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
    label: "Prosp.",
  },
  Prospección: {
    light: { bg: "#FEF3C7", text: "#D97706" },
    dark: { bg: "rgba(245, 158, 11, 0.15)", text: "#FBBF24" },
    icon: "bullseye",
    label: "Prosp.",
  },
  "Contacto Inicial": {
    light: { bg: "#F3E8FF", text: "#7C3AED" },
    dark: { bg: "rgba(168, 85, 247, 0.15)", text: "#C084FC" },
    icon: "comments-o",
    label: "Contact.",
  },
  Negociacion: {
    light: { bg: "#DBEAFE", text: "#2563EB" },
    dark: { bg: "rgba(59, 130, 246, 0.15)", text: "#60A5FA" },
    icon: "handshake-o",
    label: "Negoc.",
  },
  Negociación: {
    light: { bg: "#DBEAFE", text: "#2563EB" },
    dark: { bg: "rgba(59, 130, 246, 0.15)", text: "#60A5FA" },
    icon: "handshake-o",
    label: "Negoc.",
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
    label: "Post-V.",
  },
};

const DEFAULT_CONFIG = {
  light: { bg: "#F3F4F6", text: "#4B5563" },
  dark: { bg: "rgba(156, 163, 175, 0.15)", text: "#D1D5DB" },
  icon: "tag",
  label: "Status",
};

export default function NegotiationCard({
  negotiation,
  colorScheme,
  onPress,
}: NegotiationCardProps) {
  const scheme = useColorScheme();
  const currentColors = Colors[scheme ?? "light"];
  const statusStr = negotiation.status as string;

  const config = STAGE_CONFIG[statusStr] || DEFAULT_CONFIG;
  const s = scheme === "dark" ? config.dark : config.light;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.row,
        { borderBottomColor: currentColors.border ?? "#F3F4F6" },
      ]}
      onPress={onPress}
    >
      {/* Empresa */}
      <View style={styles.colEmpresa}>
        <Text
          style={[
            styles.empresa,
            { color: currentColors.text },
          ]}
        >
          {negotiation.clientName}
        </Text>
      </View>

      {/* Estado badge */}
      <View style={styles.colEstado}>
        <View style={[styles.badge, { backgroundColor: s.bg }]}>
          <Text style={[styles.badgeText, { color: s.text }]}>
            {config.label}
          </Text>
        </View>
      </View>

      {/* Fecha inicio */}
      <View style={styles.colFecha}>
        <Text style={[styles.cell, { color: currentColors.mutedForeground }]}>{negotiation.date ?? "—"}</Text>
      </View>

      {/* Cierre estimado */}
      <View style={styles.colCierre}>
        <Text style={[styles.cell, { color: currentColors.mutedForeground }]}>{negotiation.estimatedCloseDate ?? "—"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
  },
  colEmpresa: { flex: 2.4 },
  colEstado: { flex: 1.2 },
  colAsesor: { flex: 1.4 },
  colFecha: { flex: 1.1 },
  colCierre: { flex: 1.1 },

  empresa: {
    fontSize: 13,
    fontWeight: "600",
  },
  cell: {
    fontSize: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
