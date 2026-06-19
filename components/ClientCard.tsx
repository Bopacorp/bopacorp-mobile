import React from "react";
import { TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { BusinessClient } from "@/services/ClientServices";

interface ClientCardProps {
  client: BusinessClient;
  colorScheme: "light" | "dark";
  onPress?: () => void;
}

export default function ClientCard({ client, colorScheme, onPress }: ClientCardProps) {
  const currentColors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      style={[
        globalStyles.clientCard,
        {
          borderColor: currentColors.border,
          backgroundColor: currentColors.card,
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={globalStyles.clientHeader}>
        <Text style={globalStyles.clientName}>
          {client.businessName}
        </Text>
        <View
          style={[
            globalStyles.statusBadge,
            {
              backgroundColor: client.isActive ? "#DCFCE7" : "#FEE2E2",
            },
          ]}
        >
          <Text
            style={{
              color: client.isActive ? "#166534" : "#991B1B",
              fontWeight: "600",
              fontSize: 12,
            }}
          >
            {client.isActive ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>

      <View style={globalStyles.infoRow}>
        <FontAwesome name="id-card" size={14} color="#6B7280" />
        <Text style={globalStyles.clientInfo}>{client.ruc}</Text>
      </View>

      <Text style={globalStyles.clientInfo}>
        Contacto: {client.contactName}
      </Text>

      <View style={globalStyles.infoRow}>
        <FontAwesome name="phone" size={14} color="#6B7280" />
        <Text style={globalStyles.clientInfo}>{client.contactPhone}</Text>
      </View>

      <Text style={globalStyles.clientInfo}>
        Asesor: {client.advisorName}
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
