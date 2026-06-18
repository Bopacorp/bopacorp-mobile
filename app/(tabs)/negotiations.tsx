import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import FilterButton from "../../components/FilterButton";
import SearchBar from "../../components/SearchBar";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
import { Negotiation, getClients } from "../../services/ClientServices";

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
      const data = await getClients();
      setNegotiations(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  const filteredNegotiations = negotiations.filter((negotiation) => {
    const matchSearch = negotiation.clientName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchFilter =
      activeFilter === "Todos" || negotiation.status === activeFilter;

    return matchSearch && matchFilter;
  });
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando negociaciones...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchRow}>
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
      <TouchableOpacity style={styles.newButton}>
        <Text style={styles.newButtonText}>+ Nueva negociación</Text>
      </TouchableOpacity>
      <View
        style={[
          styles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <FontAwesome
            name="handshake-o"
            size={24}
            color={currentColors.primary}
          />
          <Text style={[styles.title, { color: currentColors.text }]}>
            Negociaciones
          </Text>
        </View>

        <Text
          style={[styles.subtitle, { color: currentColors.mutedForeground }]}
        >
          Acuerdos comerciales y seguimiento de ventas.
        </Text>

        <View
          style={[styles.divider, { backgroundColor: currentColors.border }]}
        />
        <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
          Total negociaciones: {filteredNegotiations.length}
        </Text>

        <View style={styles.listContainer}>
          {filteredNegotiations.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[
                styles.clientCard,
                {
                  borderColor: currentColors.border,
                  backgroundColor: currentColors.card,
                },
              ]}
            >
              <View style={styles.clientHeader}>
                <Text
                  style={[styles.clientName, { color: currentColors.text }]}
                >
                  {item.clientName}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === "Aprobado"
                          ? "#DCFCE7"
                          : item.status === "Enviado"
                            ? "#DBEAFE"
                            : "#F3F4F6",
                    },
                  ]}
                >
                  <Text>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.clientInfo}>Etapa: {item.planName}</Text>

              <Text style={styles.clientInfo}>Asesor: {item.advisorName}</Text>
              <Text style={styles.clientInfo}>Monto: {item.amount}</Text>
              <Text style={styles.clientInfo}>Inicio: {item.date}</Text>

              <Text style={styles.clientInfo}>
                Cierre: {item.estimatedCloseDate}
              </Text>
              <Text
                style={{
                  color: currentColors.primary,
                  fontWeight: "600",
                  marginTop: 8,
                }}
              >
                Ver detalle →
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  card: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  listContainer: {
    gap: 12,
    backgroundColor: "transparent",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  listBullet: {
    marginRight: 12,
  },
  listText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  noResultsText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  clientCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },

  clientName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  clientInfo: {
    marginBottom: 5,
  },

  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  newButton: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 3,
  },

  newButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  clientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
