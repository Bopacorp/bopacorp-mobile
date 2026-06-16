import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../services/api";

export default function NewClientScreen() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ruc, setRuc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!ruc.trim() || !businessName.trim() || !contactName.trim()) {
      Alert.alert("Campos Requeridos", "Por favor completa el RUC, Nombre de Empresa y Nombre de Contacto.");
      return;
    }

    if (ruc.trim().length < 10) {
      Alert.alert("RUC Inválido", "El RUC/Identificación debe tener al menos 10 dígitos.");
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.post("/api/v1/crm/business-clients", {
        ruc: ruc.trim(),
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        address: address.trim() || undefined,
      });

      Alert.alert(
        "Cliente Creado",
        "El cliente corporativo ha sido registrado exitosamente.",
        [
          {
            text: "Aceptar",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: any) {
      const errorMsg = err.message || "No se pudo crear el cliente. Revisa los datos e intenta de nuevo.";
      Alert.alert("Error al guardar", errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} disabled={isSaving}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Nuevo Cliente</Text>
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Registrar Empresa</Text>
        <Text style={styles.subtitle}>
          Ingresa la información requerida por el sistema de facturación y CRM.
        </Text>

        <Text style={styles.label}>RUC / Cédula *</Text>
        <TextInput
          placeholder="Ej: 0992345678001"
          value={ruc}
          onChangeText={setRuc}
          keyboardType="numeric"
          editable={!isSaving}
          style={styles.input}
        />

        <Text style={styles.label}>Nombre de Empresa / Razón Social *</Text>
        <TextInput
          placeholder="Ej: Distribuidora El Pacífico S.A."
          value={businessName}
          onChangeText={setBusinessName}
          editable={!isSaving}
          style={styles.input}
        />

        <Text style={styles.label}>Nombre de Contacto *</Text>
        <TextInput
          placeholder="Ej: Juan Pérez"
          value={contactName}
          onChangeText={setContactName}
          editable={!isSaving}
          style={styles.input}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          placeholder="cliente@empresa.com"
          value={contactEmail}
          onChangeText={setContactEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isSaving}
          style={styles.input}
        />

        <Text style={styles.label}>Teléfono de Contacto</Text>
        <TextInput
          placeholder="Ej: 042234567 o 0987654321"
          value={contactPhone}
          onChangeText={setContactPhone}
          keyboardType="phone-pad"
          editable={!isSaving}
          style={styles.input}
        />

        <Text style={styles.label}>Dirección Comercial</Text>
        <TextInput
          placeholder="Dirección completa de la empresa"
          value={address}
          onChangeText={setAddress}
          multiline
          editable={!isSaving}
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        />

        <TouchableOpacity style={[styles.saveBtn, { opacity: isSaving ? 0.7 : 1 }]} onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveBtnText}>Guardar Cliente</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1976d2",
  },
  navTitle: { color: "#fff", fontSize: 18, marginLeft: 15, fontWeight: "bold" },
  formContainer: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5, color: "#333" },
  subtitle: { color: "#666", marginBottom: 20, fontSize: 14, lineHeight: 20 },
  label: { fontWeight: "bold", marginBottom: 5, color: "#333", fontSize: 14 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 18,
    fontSize: 15,
    color: "#333",
  },
  saveBtn: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
    height: 50,
  },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
