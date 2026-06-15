import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole } = useAuth();

  const handleLogin = (selectedRole: "Asesor" | "Admin") => {
    setRole(selectedRole);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <FontAwesome
          name="building"
          size={54}
          color="#1E88E5"
          style={styles.logo}
        />
        <Text style={styles.title}>BOPACORPSA</Text>
        <Text style={styles.subtitle}>CRM Empresarial</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="usuario@empresa.com"
          placeholderTextColor="#B0B0B0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#B0B0B0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, styles.btnAsesor]}
          onPress={() => handleLogin("Asesor")}
        >
          <FontAwesome
            name="user"
            size={16}
            color="white"
            style={styles.btnIcon}
          />
          <Text style={styles.buttonText}>Ingresar como Asesor</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.btnAdmin]}
          onPress={() => handleLogin("Admin")}
        >
          <FontAwesome
            name="shield"
            size={16}
            color="white"
            style={styles.btnIcon}
          />
          <Text style={styles.buttonText}>Ingresar como Admin</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F6F8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: { alignItems: "center", marginBottom: 32 },
  logo: { marginBottom: 12 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333333",
    letterSpacing: 0.5,
  },
  subtitle: { fontSize: 16, color: "#F57C00", fontWeight: "600", marginTop: 2 },
  formCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: { fontSize: 14, color: "#4B5563", marginBottom: 8, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  button: {
    flexDirection: "row",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  btnAsesor: { backgroundColor: "#2196F3" },
  btnAdmin: { backgroundColor: "#F57C00" },
  btnIcon: { marginRight: 10 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  testCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 400,
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  testTitle: {
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    fontSize: 14,
  },
  testText: { color: "#6B7280", fontSize: 13, marginBottom: 4 },
});
