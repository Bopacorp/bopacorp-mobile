import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import FilterButton from "@/components/FilterButton";
import NegotiationCard from "@/components/NegotiationCard";
import SearchBar from "@/components/SearchBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { Negotiation, getNegotiations } from "@/services/ClientServices";

export default function NegotiationsScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Borrador", label: "Borrador" },
    { value: "Enviado", label: "Enviado" },
    { value: "Aprobado", label: "Aprobado" },
    { value: "Rechazado", label: "Rechazado" },
  ];
  useEffect(() => {
    loadNegotiations();
  }, []);

  async function loadNegotiations() {
    try {
      const data = await getNegotiations();
      setNegotiations(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  const filteredNegotiations = negotiations.filter((negotiation) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      (negotiation.clientName || "").toLowerCase().includes(query) ||
      (negotiation.planName || "").toLowerCase().includes(query) ||
      (negotiation.advisorName || "").toLowerCase().includes(query);

    const matchFilter =
      activeFilter === "Todos" || negotiation.status === activeFilter;

    return matchSearch && matchFilter;
  });
  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>Cargando negociaciones...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar negociaciones..."
            colorScheme={colorScheme ?? "light"}
          />
        </View>
        <FilterButton
          options={filterOptions}
          selectedValue={activeFilter}
          onSelect={setActiveFilter}
          colorScheme={colorScheme ?? "light"}
          title="Etapa de Negociación"
        />
      </View>
      <TouchableOpacity
        style={[globalStyles.actionButton, { backgroundColor: currentColors.primary }]}
        activeOpacity={0.8}
      >
          <Text style={globalStyles.actionButtonText}>Nueva negociación</Text>
      </TouchableOpacity>
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
          <Text style={[globalStyles.title, { color: currentColors.text, marginLeft: 0 }]}>
            Negociaciones
          </Text>
        </View>

        <Text
          style={[globalStyles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Acuerdos comerciales y seguimiento de ventas.
        </Text>

        <View
          style={[globalStyles.divider, { backgroundColor: currentColors.border }]}
        />
        <Text style={[globalStyles.sectionTitle, { color: currentColors.text }]}>
          Total negociaciones: {filteredNegotiations.length}
        </Text>

        <View style={globalStyles.listContainer}>
          {filteredNegotiations.length === 0 ? (
            <Text style={[globalStyles.noResultsText, { color: currentColors.mutedForeground }]}>
              No se encontraron negociaciones para "{searchQuery}"
            </Text>
          ) : (
            filteredNegotiations.map((item) => (
              <NegotiationCard
                key={item.id}
                negotiation={item}
                colorScheme={colorScheme ?? "light"}
                onPress={() => console.log(item)}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
