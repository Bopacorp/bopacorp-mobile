import React from "react";
import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as WebBrowser from "expo-web-browser";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { getAccessToken, API_URL } from "@/services/api";
import { deleteNegotiationDocument } from "@/services/ClientServices";

export interface DocumentItem {
  id: string;
  company: string;
  fileName: string;
  status: string;
  date: string;
}

interface DocumentCardProps {
  document: DocumentItem;
  colorScheme: "light" | "dark";
  onRefresh?: () => void;
}

export default function DocumentCard({
  document,
  colorScheme,
  onRefresh,
}: DocumentCardProps) {
  const currentColors = Colors[colorScheme ?? "light"];

  const handleView = async () => {
    const token = getAccessToken();
    if (!token) return;
    const downloadUrl = `${API_URL}/api/v1/documents/${document.id}/download?token=${token}`;
    try {
      await WebBrowser.openBrowserAsync(downloadUrl);
    } catch (err) {
      console.error("Failed to open document browser:", err);
      Alert.alert("Error", "No se pudo visualizar el documento.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar Documento",
      "¿Está seguro de que desea eliminar este documento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  };

  const handleDelete = async () => {
    try {
      await deleteNegotiationDocument(document.id);
      Alert.alert("Éxito", "Documento eliminado correctamente.");
      if (onRefresh) {
        onRefresh();
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      Alert.alert("Error", err?.message || "No se pudo eliminar el documento.");
    }
  };

  return (
    <View
      style={[
        globalStyles.clientCard,
        {
          borderColor: currentColors.border,
          backgroundColor: currentColors.card,
        },
      ]}
    >
      <Text style={globalStyles.clientName}>
        {document.fileName}
      </Text>

      <Text style={globalStyles.clientInfo}>
        Empresa: {document.company}
      </Text>

      <Text style={globalStyles.clientInfo}>
        Fecha: {document.date}
      </Text>

      <View
        style={[
          globalStyles.cardDivider,
          {
            backgroundColor: currentColors.border,
          },
        ]}
      />

      <View style={localCardStyles.actionRow}>
        <View style={localCardStyles.leftActions}>
          <TouchableOpacity
            style={[localCardStyles.actionBtn, { backgroundColor: currentColors.primary + "15" }]}
            onPress={handleView}
          >
            <FontAwesome name="eye" size={14} color={currentColors.primary} />
            <Text style={[localCardStyles.actionText, { color: currentColors.primary }]}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[localCardStyles.actionBtn, { backgroundColor: "#EF444415" }]}
            onPress={confirmDelete}
          >
            <FontAwesome name="trash" size={14} color="#EF4444" />
            <Text style={[localCardStyles.actionText, { color: "#EF4444" }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            globalStyles.statusBadge,
            {
              backgroundColor:
                document.status === "ACCEPTED"
                  ? colorScheme === "dark"
                    ? "rgba(34, 197, 94, 0.2)"
                    : "#DCFCE7"
                  : document.status === "REJECTED"
                    ? colorScheme === "dark"
                      ? "rgba(239, 68, 68, 0.2)"
                      : "#FEE2E2"
                    : colorScheme === "dark"
                      ? "rgba(245, 158, 11, 0.2)"
                      : "#FEF3C7",
            },
          ]}
        >
          <Text
            style={{
              color:
                document.status === "ACCEPTED"
                  ? colorScheme === "dark"
                    ? "#4ADE80"
                    : "#166534"
                  : document.status === "REJECTED"
                    ? colorScheme === "dark"
                      ? "#F87171"
                      : "#991B1B"
                    : colorScheme === "dark"
                      ? "#FBBF24"
                      : "#92400E",
              fontWeight: "600",
              fontSize: 12,
            }}
          >
            {document.status === "ACCEPTED"
              ? "Aceptado"
              : document.status === "REJECTED"
                ? "Rechazado"
                : "Pendiente"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const localCardStyles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
