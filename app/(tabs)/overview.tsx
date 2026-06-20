import { Text } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState, useEffect } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import SearchBar from "@/components/SearchBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { getAdvisorMetrics, AdvisorMetrics } from "@/services/ClientServices";
import { useAuth } from "@/context/AuthContext";

export default function OverviewScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [metrics, setMetrics] = useState<AdvisorMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getAdvisorMetrics();
        if (user) {
          const myMetrics = data.find((m) => m.advisor.id === user.id);
          if (myMetrics) {
            setMetrics(myMetrics);
          }
        }
      } catch (err) {
        console.error("Failed to load advisor metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, [user]);

  if (loading) {
    return (
      <View style={[globalStyles.loadingContainer, { backgroundColor: currentColors.background }]}>
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text style={[globalStyles.loadingText, { color: currentColors.mutedForeground }]}>
          Cargando resumen...
        </Text>
      </View>
    );
  }

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
            <Text style={globalStyles.kpiTitle}>Visitas</Text>
            <Text style={[globalStyles.kpiNumber, { color: currentColors.primary }]}>
              {metrics?.clientsVisited ?? 0}
            </Text>
            <Text
              style={[
                globalStyles.kpiSubtitle,
                { color: currentColors.mutedForeground },
              ]}
            >
              Clientes visitados
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
            <Text style={globalStyles.kpiTitle}>Negociaciones</Text>
            <Text style={[globalStyles.kpiNumber, { color: "#10B981" }]}>
              {metrics?.clientsInNegotiation ?? 0}
            </Text>
            <Text
              style={[
                globalStyles.kpiSubtitle,
                { color: currentColors.mutedForeground },
              ]}
            >
              Casos activos
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
            <Text style={globalStyles.kpiTitle}>Facturación</Text>
            <Text style={[globalStyles.kpiNumber, { color: "#F59E0B", fontSize: 18 }]}>
              ${metrics?.totalBilledAmount ?? 0}
            </Text>
            <Text
              style={[
                globalStyles.kpiSubtitle,
                { color: currentColors.mutedForeground },
              ]}
            >
              Monto total
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
