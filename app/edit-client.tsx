import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

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

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={[
        globalStyles.scrollPadding,
        { paddingBottom: 40 },
      ]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20 }}
      >
        <FontAwesome name="arrow-left" size={22} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar cliente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>RUC</Text>
        <TextInput style={styles.input} value={ruc} onChangeText={setRuc} />

        <Text style={styles.label}>Nombre comercial</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Text style={styles.label}>Contacto</Text>
        <TextInput
          style={styles.input}
          value={contactName}
          onChangeText={setContactName}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={contactPhone}
          onChangeText={setContactPhone}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={contactEmail}
          onChangeText={setContactEmail}
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <TouchableOpacity
          style={styles.saveButton}
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
