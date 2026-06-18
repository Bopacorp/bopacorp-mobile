import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../constants/Colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  colorScheme: "light" | "dark";
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar...",
  colorScheme,
}: SearchBarProps) {
  const currentColors = Colors[colorScheme ?? "light"];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: currentColors.card,
          borderColor: isFocused ? currentColors.primary : currentColors.border,
        },
      ]}
    >
      <FontAwesome
        name="search"
        size={14}
        color={isFocused ? currentColors.primary : currentColors.tabIconDefault}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.searchInput, { color: currentColors.text }]}
        placeholder={placeholder}
        placeholderTextColor={currentColors.tabIconDefault}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} style={styles.clearButton}>
          <FontAwesome name="times-circle" size={16} color={currentColors.tabIconDefault} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: "100%",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
