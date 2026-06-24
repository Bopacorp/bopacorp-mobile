import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { BusinessClient } from "@/services/ClientServices";

interface ClientCardProps {
  client: BusinessClient;
  colorScheme: "light" | "dark";
  onPress?: () => void;
}

export default function ClientCard({
  client,
  colorScheme,
  onPress,
}: ClientCardProps) {
  const c = Colors[colorScheme ?? "light"];

  const initials = client.businessName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      {/* ── row 1: avatar + nombre + badge ── */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: c.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.headerCenter}>
          <Text style={[styles.name, { color: c.text }]}>
            {client.businessName}
          </Text>
          <Text style={[styles.ruc, { color: c.mutedForeground }]}>
            {client.ruc}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: client.isActive
                ? colorScheme === "dark" ? "rgba(34, 197, 94, 0.2)" : "#DCFCE7"
                : colorScheme === "dark" ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2",
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: client.isActive
                  ? colorScheme === "dark" ? "#4ADE80" : "#166534"
                  : colorScheme === "dark" ? "#F87171" : "#991B1B",
              },
            ]}
          >
            {client.isActive ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>

      {/* ── divider ── */}
      <View style={[styles.divider, { backgroundColor: c.border }]} />

      {/* ── row 2: contacto + asesor ── */}
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={13} color={c.mutedForeground} />
          <Text style={[styles.metaText, { color: c.mutedForeground }]}>
            {client.contactName}
          </Text>
        </View>

        {client.contactPhone ? (
          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={c.mutedForeground}
            />
            <Text style={[styles.metaText, { color: c.mutedForeground }]}>
              {new Date(client.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ) : null}

        <View style={styles.metaItem}>
          <Ionicons
            name="person-circle-outline"
            size={13}
            color={c.mutedForeground}
          />
          <Text style={[styles.metaText, { color: c.mutedForeground }]}>
            {client.advisorName}
          </Text>
        </View>
      </View>

      {/* ── footer: ver detalle ── */}
      <View style={styles.footer}>
        <Text style={[styles.footerLink, { color: c.primary }]}>
          Ver detalle
        </Text>
        <Ionicons name="chevron-forward" size={14} color={c.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  headerCenter: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  ruc: {
    fontSize: 12,
    fontWeight: "400",
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },

  /* meta */
  meta: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 5,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },

  /* footer */
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "600",
  },
});
