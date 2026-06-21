import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Negotiation } from "@/services/ClientServices";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface NegotiationCardProps {
  negotiation: Negotiation;
  colorScheme: "light" | "dark";
  onPress?: () => void;
}

const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; filled?: boolean }
> = {
  Negociación: { bg: "#13a3ec", text: "#fff", filled: true },
  Cierre: { bg: "#13a3ec", text: "#fff", filled: true },
  "Post-venta": { bg: "#F3F4F6", text: "#374151" },
  "Contacto Inicial": { bg: "#F3F4F6", text: "#374151" },
  Prospección: { bg: "#F3F4F6", text: "#374151" },
  Aprobado: { bg: "#D1FAE5", text: "#065F46" },
  Enviado: { bg: "#DBEAFE", text: "#1E40AF" },
  Borrador: { bg: "#F3F4F6", text: "#374151" },
  Rechazado: { bg: "#FEE2E2", text: "#991B1B" },
};

export default function NegotiationCard({
  negotiation,
  colorScheme,
  onPress,
}: NegotiationCardProps) {
  const currentColors = Colors[colorScheme ?? "light"];
  const s = STATUS_STYLE[negotiation.status ?? ""] ?? {
    bg: "#F3F4F6",
    text: "#374151",
  };

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
            { color: currentColors.primary ?? "#13a3ec" },
          ]}
        >
          {negotiation.clientName}
        </Text>
      </View>

      {/* Estado badge */}
      <View style={styles.colEstado}>
        <View style={[styles.badge, { backgroundColor: s.bg }]}>
          <Text style={[styles.badgeText, { color: s.text }]}>
            {negotiation.status}
          </Text>
        </View>
      </View>

      {/* Fecha inicio */}
      <View style={styles.colFecha}>
        <Text style={styles.cell}>{negotiation.date ?? "—"}</Text>
      </View>

      {/* Cierre estimado */}
      <View style={styles.colCierre}>
        <Text style={styles.cell}>{negotiation.estimatedCloseDate ?? "—"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  colEmpresa: { flex: 2.2 },
  colEstado: { flex: 1.4 },
  colAsesor: { flex: 1.4 },
  colFecha: { flex: 1.1 },
  colCierre: { flex: 1.1 },

  empresa: {
    fontSize: 13,
    fontWeight: "500",
  },
  cell: {
    fontSize: 12,
    color: "#374151",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
