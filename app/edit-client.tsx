import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

import { Text, View } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";

export default function EditClientScreen() {
  const params = useLocalSearchParams();

  const [ruc, setRuc] = useState(params.ruc?.toString() || "");
  const [businessName, setBusinessName] = useState(
    params.businessName?.toString() || "",
  );
  const [contactName, setContactName] = useState(
    params.contactName?.toString() || "",
  );
  const [contactPhone, setContactPhone] = useState(
    params.contactPhone?.toString() || "",
  );
  const [contactEmail, setContactEmail] = useState(
    params.contactEmail?.toString() || "",
  );
  const [address, setAddress] = useState(params.address?.toString() || "");

  const insets = useSafeAreaInsets();

  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const placeholderColor = colorScheme === "dark" ? "#5c6e8c" : "#9CA3AF";

  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: currentColors.background, paddingTop: insets.top }]}
      contentContainerStyle={[
        globalStyles.scrollPadding,
        { paddingBottom: 40 },
      ]}
    >
      <View style={{ marginBottom: 20, backgroundColor: "transparent" }}>
        <BackButton />
      </View>

      <Text style={[styles.title, { color: currentColors.text }]}>Editar cliente</Text>

      <View style={[styles.card, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
        <Text style={[styles.label, { color: currentColors.text }]}>RUC</Text>
        <TextInput
          style={[styles.input, { borderColor: currentColors.border, backgroundColor: currentColors.secondary, color: currentColors.text }]}
          value={ruc}
          onChangeText={setRuc}
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>Nombre comercial</Text>
        <TextInput
          style={[styles.input, { borderColor: currentColors.border, backgroundColor: currentColors.secondary, color: currentColors.text }]}
          value={businessName}
          onChangeText={setBusinessName}
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>Contacto</Text>
        <TextInput
          style={[styles.input, { borderColor: currentColors.border, backgroundColor: currentColors.secondary, color: currentColors.text }]}
          value={contactName}
          onChangeText={setContactName}
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>Teléfono</Text>
        <TextInput
          style={[styles.input, { borderColor: currentColors.border, backgroundColor: currentColors.secondary, color: currentColors.text }]}
          value={contactPhone}
          onChangeText={setContactPhone}
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { borderColor: currentColors.border, backgroundColor: currentColors.secondary, color: currentColors.text }]}
          value={contactEmail}
          onChangeText={setContactEmail}
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>Dirección</Text>
        <TextInput
          style={[styles.input, styles.textArea, { borderColor: currentColors.border, backgroundColor: currentColors.secondary, color: currentColors.text }]}
          value={address}
          onChangeText={setAddress}
          multiline
          placeholderTextColor={placeholderColor}
        />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: currentColors.primary }]}
          onPress={() => {
            console.log("Actualizar cliente");
          }}
        >
          <FontAwesome
            name="save"
            size={16}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  saveButton: {
    marginTop: 24,
    backgroundColor: "#13a3ec",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  saveButtonText: {
    color: "white",
    fontWeight: "700",
  },
});
