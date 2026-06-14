import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingrese sus credenciales.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(tabs)");
    }, 1000);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: currentColors.card,
                borderColor: currentColors.border,
              },
            ]}
          >
            <FontAwesome name="lock" size={40} color={currentColors.primary} />
          </View>
          <Text style={[styles.title, { color: currentColors.text }]}>
            BOPACORP
          </Text>
          <Text
            style={[styles.subtitle, { color: currentColors.mutedForeground }]}
          >
            Acceso al sistema CRM
          </Text>
        </View>

        <View
          style={[
            styles.formContainer,
            {
              backgroundColor: currentColors.card,
              borderColor: currentColors.border,
            },
          ]}
        >
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.text }]}>
              Correo Electrónico
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: currentColors.border,
                  backgroundColor: currentColors.background,
                },
              ]}
            >
              <FontAwesome
                name="envelope-o"
                size={16}
                color={currentColors.mutedForeground}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: currentColors.text }]}
                placeholder="asesor@bopacorp.com"
                placeholderTextColor={currentColors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.text }]}>
              Contraseña
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: currentColors.border,
                  backgroundColor: currentColors.background,
                },
              ]}
            >
              <FontAwesome
                name="key"
                size={16}
                color={currentColors.mutedForeground}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: currentColors.text }]}
                placeholder="••••••••"
                placeholderTextColor={currentColors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Pressable
            style={[
              styles.loginButton,
              {
                backgroundColor: currentColors.primary,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Verificando..." : "Iniciar Sesión"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
