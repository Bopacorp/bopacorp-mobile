import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { Negotiation } from "@/services/ClientServices";

interface NegotiationCardProps {
  negotiation: Negotiation;
  colorScheme: "light" | "dark";
  onPress?: () => void;
}

export default function NegotiationCard({
  negotiation,
  colorScheme,
  onPress,
}: NegotiationCardProps) {
  const currentColors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        globalStyles.clientCard,
        {
          borderColor: currentColors.border,
          backgroundColor: currentColors.card,
        },
      ]}
      onPress={onPress}
    >
      <View style={globalStyles.clientHeader}>
        <Text style={globalStyles.clientName}>
          {negotiation.clientName}
        </Text>

        <View
          style={[
            globalStyles.statusBadge,
            {
              backgroundColor:
                negotiation.status === "Aprobado"
                  ? colorScheme === "dark"
                    ? "rgba(34, 197, 94, 0.2)"
                    : "#DCFCE7"
                  : negotiation.status === "Enviado"
                    ? colorScheme === "dark"
                      ? "rgba(59, 130, 246, 0.2)"
                      : "#DBEAFE"
                    : colorScheme === "dark"
                      ? "rgba(107, 114, 128, 0.2)"
                      : "#F3F4F6",
            },
          ]}
        >
          <Text
            style={{
              color:
                negotiation.status === "Aprobado"
                  ? colorScheme === "dark"
                    ? "#4ADE80"
                    : "#166534"
                  : negotiation.status === "Enviado"
                    ? colorScheme === "dark"
                      ? "#60A5FA"
                      : "#1E40AF"
                    : colorScheme === "dark"
                      ? "#9CA3AF"
                      : "#4B5563",
              fontWeight: "600",
              fontSize: 12,
            }}
          >
            {negotiation.status}
          </Text>
        </View>
      </View>

      <Text style={globalStyles.clientInfo}>
        Etapa: {negotiation.planName}
      </Text>

      <Text style={globalStyles.clientInfo}>
        Asesor: {negotiation.advisorName}
      </Text>
      <Text style={globalStyles.clientInfo}>
        Monto: {negotiation.amount}
      </Text>
      <Text style={globalStyles.clientInfo}>
        Inicio: {negotiation.date}
      </Text>

      <Text style={globalStyles.clientInfo}>
        Cierre: {negotiation.estimatedCloseDate}
      </Text>

      <View
        style={[
          globalStyles.cardDivider,
          {
            backgroundColor: currentColors.border,
          },
        ]}
      />

      <View style={globalStyles.cardFooter}>
        <Text
          style={[
            globalStyles.cardActionText,
            {
              color: currentColors.primary,
            },
          ]}
        >
          Ver detalle →
        </Text>
      </View>
    </TouchableOpacity>
  );
}
