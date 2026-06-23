import BackButton from "@/components/BackButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text, View } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";
import { createBusinessClient } from "@/services/ClientServices";

export default function CreateClientScreen() {
  const [ruc, setRuc] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const insets = useSafeAreaInsets();

  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const placeholderColor = colorScheme === "dark" ? "#5c6e8c" : "#9CA3AF";
  async function handleSave() {
    try {
      const response = await createBusinessClient({
        ruc,
        businessName,
        contactName,
        contactPhone: phone,
        contactEmail: email,
        address,
        activeServicesCount: 0,
        currentMonthlyBilling: 0,
        isActive: true,
      });

      console.log("CLIENTE CREADO:");
      console.log(JSON.stringify(response, null, 2));

      alert("Cliente creado");

      router.back();
    } catch (error: any) {
      console.log("ERROR COMPLETO:");
      console.log(error);

      if (error?.details) {
        console.log("DETAILS:");
        console.log(error.details);
      }

      alert("Error al crear cliente");
    }
  }
  return (
    <ScrollView
      style={[
        globalStyles.container,
        { backgroundColor: currentColors.background, paddingTop: insets.top },
      ]}
      contentContainerStyle={[
        globalStyles.scrollPadding,
        { paddingBottom: 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: 20, backgroundColor: "transparent" }}>
        <BackButton />
      </View>

      <Text style={[styles.title, { color: currentColors.text }]}>
        Nuevo cliente
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: currentColors.text }]}>RUC</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
              color: currentColors.text,
            },
          ]}
          value={ruc}
          onChangeText={setRuc}
          placeholder="0991234567001"
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>
          Nombre comercial
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
              color: currentColors.text,
            },
          ]}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Empresa S.A."
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>
          Contacto
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
              color: currentColors.text,
            },
          ]}
          value={contactName}
          onChangeText={setContactName}
          placeholder="Nombre del contacto"
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>
          Teléfono
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
              color: currentColors.text,
            },
          ]}
          value={phone}
          onChangeText={setPhone}
          placeholder="0999999999"
          keyboardType="phone-pad"
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
              color: currentColors.text,
            },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="correo@empresa.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={placeholderColor}
        />

        <Text style={[styles.label, { color: currentColors.text }]}>
          Dirección
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
              color: currentColors.text,
            },
          ]}
          value={address}
          onChangeText={setAddress}
          placeholder="Dirección"
          multiline
          numberOfLines={4}
          placeholderTextColor={placeholderColor}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: currentColors.primary },
          ]}
          activeOpacity={0.8}
          onPress={handleSave}
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
