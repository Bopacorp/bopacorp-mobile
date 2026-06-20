import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <FontAwesome
          name={icon}
          size={14}
          color="#6B7280"
          style={styles.icon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.infoRight}>{children}</View>
    </View>
  );
}

interface Props {
  businessName?: string;
  ruc?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  advisorName?: string;
  isActive?: string;
}

export default function ClientDetailView({
  businessName,
  ruc,
  contactName,
  contactPhone,
  contactEmail,
  address,
  advisorName,
  isActive,
}: Props) {
  const active = isActive === "true";

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={[
        globalStyles.scrollPadding,
        { paddingBottom: 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/edit-client",
              params: {
                businessName,
                ruc,
                contactName,
                contactPhone,
                contactEmail,
                address,
                advisorName,
                isActive,
              },
            })
          }
        >
          <FontAwesome name="pencil" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {businessName?.charAt(0)?.toUpperCase()}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[globalStyles.title, { marginBottom: 2 }]}>
            {businessName}
          </Text>

          <Text style={styles.subtitle}>Cliente corporativo</Text>
        </View>
      </View>

      <Text style={[globalStyles.sectionTitle, { marginBottom: 8 }]}>
        INFORMACIÓN
      </Text>

      <View style={styles.card}>
        <InfoRow icon="id-card" label="RUC">
          <Text style={styles.value}>{ruc}</Text>
        </InfoRow>

        <View style={styles.divider} />

        <InfoRow icon="building" label="Empresa">
          <Text style={styles.value}>{businessName}</Text>
        </InfoRow>

        <View style={styles.divider} />

        <InfoRow icon="gear" label="Estado">
          <View
            style={[
              styles.badge,
              {
                backgroundColor: active ? "#DCFCE7" : "#FEE2E2",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: active ? "#166534" : "#991B1B",
                },
              ]}
            >
              {active ? "Activo" : "Inactivo"}
            </Text>
          </View>
        </InfoRow>
      </View>

      <Text
        style={[
          globalStyles.sectionTitle,
          {
            marginTop: 20,
            marginBottom: 8,
          },
        ]}
      >
        CONTACTO
      </Text>

      <View style={styles.card}>
        <InfoRow icon="user" label="Nombre">
          <Text style={styles.value}>{contactName}</Text>
        </InfoRow>

        <View style={styles.divider} />

        <InfoRow icon="phone" label="Teléfono">
          <Text style={[styles.value, styles.link]}>{contactPhone}</Text>
        </InfoRow>

        <View style={styles.divider} />

        <InfoRow icon="envelope" label="Email">
          <Text style={[styles.value, styles.link]}>{contactEmail}</Text>
        </InfoRow>

        <View style={styles.divider} />

        <InfoRow icon="map-marker" label="Dirección">
          <Text style={styles.value}>{address}</Text>
        </InfoRow>
      </View>

      <Text
        style={[
          globalStyles.sectionTitle,
          {
            marginTop: 20,
            marginBottom: 8,
          },
        ]}
      >
        ASESOR
      </Text>

      <View style={styles.card}>
        <InfoRow icon="user-circle" label="Asesor">
          <Text style={styles.value}>{advisorName}</Text>
        </InfoRow>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "transparent",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#13a3ec",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },

  headerText: {
    flex: 1,
    backgroundColor: "transparent",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 13,
  },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "#FFFFFF",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "transparent",
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 110,
    backgroundColor: "transparent",
  },

  icon: {
    width: 20,
    textAlign: "center",
    marginRight: 8,
  },

  label: {
    color: "#6B7280",
    fontSize: 13,
  },

  infoRight: {
    flex: 1,
    backgroundColor: "transparent",
  },

  value: {
    fontSize: 14,
    color: "#111827",
  },

  link: {
    color: "#13a3ec",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: -16,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
