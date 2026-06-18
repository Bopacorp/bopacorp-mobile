import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    let finalEmail = email.trim();
    let finalPassword = password;

    // Autofill seeded Advisor credentials for developer convenience if fields are empty
    if (!finalEmail && !finalPassword) {
      finalEmail = "lreyes@bopacorp.com";
      finalPassword = "Bopa2026!";
      setEmail(finalEmail);
      setPassword(finalPassword);
    }

    if (!finalEmail || !finalPassword) {
      Alert.alert("Campos incompletos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(finalEmail, finalPassword);
    } catch (err: any) {
      const errorMsg = err.message || "Credenciales incorrectas o problema de red.";
      Alert.alert("Error de Autenticación", errorMsg);
    } finally {
      setIsLoggingIn(false);
    }
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
        <Text style={styles.subtitle}>CRM Movil - Asesores</Text>
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
          editable={!isLoggingIn}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#B0B0B0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoggingIn}
        />

        {isLoggingIn ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loaderText}>Iniciando sesión...</Text>
          </View>
        ) : (
          <Pressable
            style={[styles.button, styles.btnLogin]}
            onPress={handleLogin}
          >
            <FontAwesome
              name="sign-in"
              size={16}
              color="white"
              style={styles.btnIcon}
            />
            <Text style={styles.buttonText}>Ingresar</Text>
          </Pressable>
        )}
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
  },
  btnLogin: { backgroundColor: "#2196F3" },
  btnIcon: { marginRight: 10 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loaderText: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
});
