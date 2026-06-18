import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

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
      {/* 1. NEGOCIACIONES (Advisor Dashboard) */}
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <HeaderLogo />,
          tabBarLabel: "Negociaciones",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="handshake-o" color={color} />
          ),
        }}
      />
      
      {/* 2. MIS CLIENTES */}
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="building" color={color} />
          ),
        }}
      />
      
      {/* 3. MIS ACTIVIDADES */}
      <Tabs.Screen
        name="activities"
        options={{
          title: "Actividades",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
      
      {/* 4. CATÁLOGO */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color }) => <TabBarIcon name="tags" color={color} />,
        }}
      />
      
      {/* 5. MI PERFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      
      {/* 6. POSTULACIÓN (Hidden from main tabs, accessed via direct links) */}
      <Tabs.Screen
        name="employability"
        options={{
          href: null,
          title: "Postulación",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-text-o" color={color} />
          ),
        }}
      />

      {/* Exclude admin-dashboard, users, admin-catalog, and settings screens from tab menu */}
      <Tabs.Screen name="admin-dashboard" options={{ href: null }} />
      <Tabs.Screen name="users" options={{ href: null }} />
      <Tabs.Screen name="admin-catalog" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
