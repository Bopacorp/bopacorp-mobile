import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function NewClientScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Cliente - BOPACORPSA</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <Text style={styles.title}>Nuevo Cliente</Text>
        <Text style={styles.subtitle}>
          Ingresa la información del nuevo cliente
        </Text>

        <View style={styles.photoSection}>
          <View style={styles.photoPlaceholder}>
            <MaterialIcons name="person" size={40} color="#CCC" />
          </View>
          <Text style={styles.photoText}>Agregar Foto</Text>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <MaterialIcons name="camera-alt" size={16} color="#1976d2" />
            <Text style={styles.changePhotoText}> Cambiar Foto</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nombre de Empresa *</Text>
        <TextInput placeholder="Ej: Empresa XYZ S.A." style={styles.input} />

        <Text style={styles.label}>Nombre de Contacto *</Text>
        <TextInput placeholder="Ej: Juan Pérez" style={styles.input} />

        <Text style={styles.label}>Correo Electrónico *</Text>
        <TextInput placeholder="cliente@empresa.com" style={styles.input} />

        <Text style={styles.label}>Teléfono *</Text>
        <TextInput placeholder="+593 98 123 4567" style={styles.input} />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          placeholder="Dirección completa de la empresa"
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Guardar Cliente</Text>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "#666", marginBottom: 20 },
  photoSection: { alignItems: "center", marginBottom: 20 },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  photoText: { color: "#666", fontSize: 14, marginBottom: 5 },
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1976d2",
    padding: 8,
    borderRadius: 20,
  },
  changePhotoText: { color: "#1976d2", marginLeft: 5 },
  label: { fontWeight: "bold", marginBottom: 5, color: "#333" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveBtn: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
