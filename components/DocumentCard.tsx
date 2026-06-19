import React from "react";
import { View } from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";

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
}

export default function DocumentCard({
  document,
  colorScheme,
}: DocumentCardProps) {
  const currentColors = Colors[colorScheme ?? "light"];

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
      <Text style={[globalStyles.clientName, { color: currentColors.text }]}>
        {document.fileName}
      </Text>

      <Text style={[globalStyles.clientInfo, { color: currentColors.text, marginBottom: 4 }]}>
        Empresa: {document.company}
      </Text>

      <Text style={[globalStyles.clientInfo, { color: currentColors.text, marginBottom: 4 }]}>
        Fecha: {document.date}
      </Text>

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
  );
}
