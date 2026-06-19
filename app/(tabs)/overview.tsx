import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import SearchBar from "@/components/SearchBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";

export default function OverviewScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={globalStyles.scrollPadding}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar en dashboard..."
          colorScheme={colorScheme ?? "light"}
        />
      </View>

      <View
        style={[
          globalStyles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={globalStyles.titleRow}>
          <Text style={globalStyles.title}>Overview</Text>
        </View>

        <Text
          style={[globalStyles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Resumen operativo y métricas clave de negocio.
        </Text>

        <View
          style={[globalStyles.divider, { backgroundColor: currentColors.border }]}
        />

        <View style={globalStyles.kpiContainer}>
          <View
            style={[
              globalStyles.kpiCard,
              {
                backgroundColor: currentColors.card,
                borderColor: currentColors.border,
              },
            ]}
          >
            <Text style={globalStyles.kpiTitle}>Visitas hoy</Text>
            <Text style={[globalStyles.kpiNumber, { color: currentColors.primary }]}>
              3
            </Text>
            <Text
              style={[
                globalStyles.kpiSubtitle,
                { color: currentColors.mutedForeground },
              ]}
            >
              Programadas
            </Text>
          </View>

          <View
            style={[
              globalStyles.kpiCard,
              {
                backgroundColor: currentColors.card,
                borderColor: currentColors.border,
              },
            ]}
          >
            <Text style={globalStyles.kpiTitle}>Completadas</Text>
            <Text style={[globalStyles.kpiNumber, { color: "#10B981" }]}>
              2
            </Text>
            <Text
              style={[
                globalStyles.kpiSubtitle,
                { color: currentColors.mutedForeground },
              ]}
            >
              Visitas del día
            </Text>
          </View>

          <View
            style={[
              globalStyles.kpiCard,
              {
                backgroundColor: currentColors.card,
                borderColor: currentColors.border,
              },
            ]}
          >
            <Text style={globalStyles.kpiTitle}>Rendimiento</Text>
            <Text style={[globalStyles.kpiNumber, { color: "#F59E0B" }]}>
              1º
            </Text>
            <Text
              style={[
                globalStyles.kpiSubtitle,
                { color: currentColors.mutedForeground },
              ]}
            >
              Top performer
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
