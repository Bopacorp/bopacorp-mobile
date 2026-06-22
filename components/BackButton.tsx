import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

interface BackButtonProps {
  title?: string;
  onPress?: () => void;
}

export default function BackButton({ title = "Volver", onPress }: BackButtonProps) {
  const handlePress = onPress || (() => router.back());
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity onPress={handlePress} style={styles.backBtn}>
      <FontAwesome name="arrow-left" size={16} color={currentColors.primary} />
      <Text style={[styles.backText, { color: currentColors.primary }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
