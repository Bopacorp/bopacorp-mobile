import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

interface EditarButtonProps {
  onPress: () => void;
}

export default function EditarButton({ onPress }: EditarButtonProps) {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.editBtn,
        {
          borderColor: currentColors.primary,
          backgroundColor: colorScheme === "dark" ? "transparent" : "#FFFFFF",
        },
      ]}
    >
      <FontAwesome name="pencil" size={14} color={currentColors.primary} />
      <Text style={[styles.editText, { color: currentColors.primary }]}>Editar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
