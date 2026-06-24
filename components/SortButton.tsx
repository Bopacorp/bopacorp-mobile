import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../constants/Colors";

export type SortOrder = "default" | "az" | "za";

interface SortButtonProps {
  value: SortOrder;
  onSelect: (value: SortOrder) => void;
  colorScheme: "light" | "dark";
}

const SORT_OPTIONS: { value: SortOrder; label: string; icon: string }[] = [
  { value: "default", label: "Orden original", icon: "clock-o" },
  { value: "az", label: "A → Z", icon: "sort-alpha-asc" },
  { value: "za", label: "Z → A", icon: "sort-alpha-desc" },
];

export default function SortButton({ value, onSelect, colorScheme }: SortButtonProps) {
  const currentColors = Colors[colorScheme ?? "light"];
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (v: SortOrder) => {
    onSelect(v);
    setModalVisible(false);
  };

  const isActive = value !== "default";

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.sortButton,
          {
            backgroundColor: currentColors.card,
            borderColor: isActive ? currentColors.primary : currentColors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome
          name="sort"
          size={16}
          color={isActive ? currentColors.primary : currentColors.tabIconDefault}
        />
        {isActive && (
          <Text style={[styles.badgeText, { color: currentColors.primary }]}>
            {value === "az" ? "A→Z" : "Z→A"}
          </Text>
        )}
      </Pressable>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: currentColors.card,
                borderTopColor: currentColors.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentColors.text }]}>Ordenar por</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <FontAwesome name="times" size={18} color={currentColors.tabIconDefault} />
              </Pressable>
            </View>

            <FlatList
              data={SORT_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                const activeBg =
                  colorScheme === "dark"
                    ? "rgba(0, 127, 206, 0.15)"
                    : "rgba(19, 163, 236, 0.12)";

                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionItem,
                      isSelected && { backgroundColor: activeBg },
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <View style={styles.optionLeft}>
                      <FontAwesome
                        name={item.icon as any}
                        size={15}
                        color={isSelected ? currentColors.primary : currentColors.tabIconDefault}
                        style={{ width: 20 }}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected ? currentColors.primary : currentColors.text,
                            fontWeight: isSelected ? "700" : "500",
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <FontAwesome name="check" size={14} color={currentColors.primary} />
                    )}
                  </Pressable>
                );
              }}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sortButton: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContent: {
    gap: 4,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  optionText: {
    fontSize: 15,
  },
});
