import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";

export default function CreateClientScreen() {
  const [ruc, setRuc] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={[
        globalStyles.scrollPadding,
        { paddingBottom: 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20 }}
      >
        <FontAwesome name="arrow-left" size={22} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Nuevo cliente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>RUC</Text>
        <TextInput
          style={styles.input}
          value={ruc}
          onChangeText={setRuc}
          placeholder="0991234567001"
        />

        <Text style={styles.label}>Nombre comercial</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Empresa S.A."
        />

        <Text style={styles.label}>Contacto</Text>
        <TextInput
          style={styles.input}
          value={contactName}
          onChangeText={setContactName}
          placeholder="Nombre del contacto"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="0999999999"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="correo@empresa.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          placeholder="Dirección"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={() => {
            console.log({
              ruc,
              businessName,
              contactName,
              phone,
              email,
              address,
            });
          }}
        >
          <FontAwesome
            name="save"
            size={16}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.saveButtonText}>Guardar cliente</Text>
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
    color: "#111827",
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
    color: "#374151",
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },

  textArea: {
    minHeight: 100,
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
    fontSize: 15,
  },
});
