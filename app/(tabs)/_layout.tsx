import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useAuth } from "../../context/AuthContext";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

function HeaderLogo() {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={{ width: 130, height: 32, resizeMode: "contain" }}
    />
  );
}
export default function TabLayout() {
  const { role } = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1976D2",
        tabBarInactiveTintColor: currentColors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: currentColors.card,
          borderTopColor: currentColors.border,
        },
        headerStyle: {
          backgroundColor: currentColors.card,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: currentColors.text,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      {/* 1. NEGOCIACIONES */}
      <Tabs.Screen
        name="index"
        options={{
          href: role === "Admin" ? null : undefined,
          headerTitle: () => <HeaderLogo />,
          tabBarLabel: "Negociaciones",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="handshake-o" color={color} />
          ),
        }}
      />
      {/* 2. CATÁLOGO */}
      <Tabs.Screen
        name="catalog"
        options={{
          href: role === "Admin" ? null : undefined,
          title: "Catálogo",
          tabBarIcon: ({ color }) => <TabBarIcon name="tags" color={color} />,
        }}
      />
      {/* 3. POSTULACIÓN */}
      <Tabs.Screen
        name="employability"
        options={{
          href: role === "Admin" ? null : undefined,
          title: "Postulación",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-text-o" color={color} />
          ),
        }}
      />
      {/* 4. MIS CLIENTES (NUEVO) */}
      <Tabs.Screen
        name="clients"
        options={{
          href: role === "Admin" ? null : undefined,
          title: "Mis Clientes",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="building" color={color} />
          ),
        }}
      />
      {/* 5. MIS ACTIVIDADES (NUEVO) */}
      <Tabs.Screen
        name="activities"
        options={{
          href: role === "Admin" ? null : undefined,
          title: "Actividades",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
      {/* 6. MI PERFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          href: role === "Admin" ? null : undefined,
          title: "Mi Perfil",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

      {/* --- MUNDO ADMIN (SE MANTIENE IGUAL) --- */}
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          href: role === "Admin" ? undefined : null,
          title: "Admin",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="th-large" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          href: role === "Admin" ? undefined : null,
          title: "Usuarios",
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin-catalog"
        options={{
          href: role === "Admin" ? undefined : null,
          title: "Catálogo",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="archive" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: role === "Admin" ? undefined : null,
          title: "Config",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
