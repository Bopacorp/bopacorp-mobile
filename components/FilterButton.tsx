import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../constants/Colors";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterButtonProps {
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  colorScheme: "light" | "dark";
  title?: string;
}

export default function FilterButton({
  options,
  selectedValue,
  onSelect,
  colorScheme,
  title = "Filtrar por",
}: FilterButtonProps) {
  const currentColors = Colors[colorScheme ?? "light"];
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setModalVisible(false);
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const isActiveFilter = selectedValue && selectedValue !== "all" && selectedValue !== "Todos";

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.filterButton,
          {
            backgroundColor: currentColors.card,
            borderColor: isActiveFilter ? currentColors.primary : currentColors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome
          name="filter"
          size={16}
          color={isActiveFilter ? currentColors.primary : currentColors.tabIconDefault}
        />
        {selectedOption && isActiveFilter && (
          <Text style={[styles.filterBadgeText, { color: currentColors.primary }]}>
            {selectedOption.label}
          </Text>
        )}
      </Pressable>

      <Modal
        animationType="slide"
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
              <Text style={[styles.modalTitle, { color: currentColors.text }]}>{title}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <FontAwesome name="times" size={18} color={currentColors.tabIconDefault} />
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
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
  filterButton: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  filterBadgeText: {
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
  optionText: {
    fontSize: 15,
  },
});
