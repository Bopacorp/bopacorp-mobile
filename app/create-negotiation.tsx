import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";

import BackButton from "@/components/BackButton";
import { Text } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import { useAuth } from "@/context/AuthContext";
import {
  createNegotiation,
  getBusinessClients,
  getNegotiationStates,
} from "@/services/ClientServices";

export default function CreateNegotiationScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const [clients, setClients] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const [clientId, setClientId] = useState("");
  const [stateId, setStateId] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [estimatedCloseDate, setEstimatedCloseDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  });
  const [observations, setObservations] = useState("");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);

  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");

  const toLocalYYYYMMDD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const calendarTheme = {
    calendarBackground: currentColors.card,
    textSectionTitleColor: currentColors.mutedForeground,
    selectedDayBackgroundColor: currentColors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: currentColors.primary,
    dayTextColor: currentColors.text,
    textDisabledColor: currentColors.border,
    dotColor: currentColors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: currentColors.primary,
    disabledArrowColor: currentColors.border,
    monthTextColor: currentColors.text,
    indicatorColor: currentColors.primary,
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const clientsData = await getBusinessClients();
      const sortedClients = [...clientsData].sort((a: any, b: any) =>
        (a.businessName || "").localeCompare(b.businessName || "", "es", { sensitivity: "base" })
      );
      setClients(sortedClients);

      const statesData = await getNegotiationStates();
      const sortedStates = [...statesData].sort((a: any, b: any) =>
        (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" })
      );
      setStates(sortedStates);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleCreate() {
    try {
      if (!clientId || !stateId) {
        alert("Seleccione cliente y estado");
        return;
      }
      const dateStart = toLocalYYYYMMDD(startDate);
      const dateClose = toLocalYYYYMMDD(estimatedCloseDate);
      await createNegotiation({
        clientId,
        advisorId: user?.id || "",
        stateId,
        startDate: dateStart,
        estimatedCloseDate: dateClose,
        observations,
        isActive: true,
      });

      alert("Negociación creada");

      router.back();
    } catch (error) {
      console.log(error);
      alert("Error al crear negociación");
    }
  }

  const insets = useSafeAreaInsets();
  const placeholderColor = colorScheme === "dark" ? "#5c6e8c" : "#9CA3AF";

  return (
    <ScrollView
      style={[
        globalStyles.container,
        { backgroundColor: currentColors.background, paddingTop: insets.top },
      ]}
      contentContainerStyle={[
        styles.content,
        { backgroundColor: currentColors.background },
      ]}
    >
      <View style={{ marginBottom: 20, backgroundColor: "transparent" }}>
        <BackButton onPress={() => router.replace("/negotiations")} />
      </View>

      <View style={[styles.header, { backgroundColor: "transparent" }]}>
        <Text style={[styles.title, { color: currentColors.text }]}>
          Nueva negociación
        </Text>
      </View>

      <Text style={[styles.label, { color: currentColors.text }]}>Cliente</Text>

      <TouchableOpacity
        style={[
          styles.selector,
          {
            borderColor: currentColors.border,
            backgroundColor: currentColors.secondary,
          },
        ]}
        onPress={() => setClientModalVisible(true)}
      >
        <Text
          style={{
            color: selectedClientName ? currentColors.text : placeholderColor,
          }}
        >
          {selectedClientName || "Seleccionar cliente"}
        </Text>
        <FontAwesome
          name="chevron-down"
          size={12}
          color={placeholderColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.actionButton,
          {
            backgroundColor: currentColors.primary,
            marginTop: 10,
            marginBottom: 0,
          },
        ]}
        onPress={() => router.push("/create-client")}
      >
        <FontAwesome
          name="plus"
          size={14}
          color="white"
          style={globalStyles.actionIcon}
        />
        <Text style={globalStyles.actionButtonText}>Nuevo cliente</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: currentColors.text }]}>
        Estado inicial
      </Text>

      <TouchableOpacity
        style={[
          styles.selector,
          {
            borderColor: currentColors.border,
            backgroundColor: currentColors.secondary,
          },
        ]}
        onPress={() => setStateModalVisible(true)}
      >
        <Text
          style={{
            color: selectedStateName ? currentColors.text : placeholderColor,
          }}
        >
          {selectedStateName || "Seleccionar estado"}
        </Text>
        <FontAwesome
          name="chevron-down"
          size={12}
          color={placeholderColor}
        />
      </TouchableOpacity>

      <Text style={[styles.label, { color: currentColors.text }]}>
        Fecha de inicio
      </Text>

      <TouchableOpacity
        style={[
          styles.selector,
          {
            borderColor: currentColors.border,
            backgroundColor: currentColors.secondary,
          },
        ]}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={{ color: currentColors.text }}>
          {startDate.toLocaleDateString("es-ES")}
        </Text>
        <FontAwesome name="calendar-o" size={14} color={placeholderColor} />
      </TouchableOpacity>

      {showStartPicker && (
        <Calendar
          current={toLocalYYYYMMDD(startDate)}
          onDayPress={(day) => {
            setStartDate(new Date(day.year, day.month - 1, day.day));
            setShowStartPicker(false);
          }}
          theme={calendarTheme}
        />
      )}

      <Text style={[styles.label, { color: currentColors.text }]}>
        Cierre estimado
      </Text>

      <TouchableOpacity
        style={[
          styles.selector,
          {
            borderColor: currentColors.border,
            backgroundColor: currentColors.secondary,
          },
        ]}
        onPress={() => setShowClosePicker(true)}
      >
        <Text style={{ color: currentColors.text }}>
          {estimatedCloseDate.toLocaleDateString("es-ES")}
        </Text>
        <FontAwesome name="calendar-o" size={14} color={placeholderColor} />
      </TouchableOpacity>

      {showClosePicker && (
        <Calendar
          current={toLocalYYYYMMDD(estimatedCloseDate)}
          onDayPress={(day) => {
            setEstimatedCloseDate(new Date(day.year, day.month - 1, day.day));
            setShowClosePicker(false);
          }}
          theme={calendarTheme}
        />
      )}

      <Text style={[styles.label, { color: currentColors.text }]}>
        Observaciones
      </Text>

      <TextInput
        style={[
          styles.textarea,
          {
            borderColor: currentColors.border,
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          },
        ]}
        multiline
        value={observations}
        onChangeText={setObservations}
        placeholder="Notas adicionales..."
        placeholderTextColor={placeholderColor}
      />

      <TouchableOpacity
        style={[
          styles.createButton,
          { backgroundColor: currentColors.primary },
        ]}
        onPress={handleCreate}
      >
        <Text style={styles.createButtonText}>Crear negociación</Text>
      </TouchableOpacity>

      <Modal visible={clientModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setClientModalVisible(false)}
        >
          <View
            style={[styles.modalBox, { backgroundColor: currentColors.card }]}
          >
            <FlatList
              data={clients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: currentColors.border },
                  ]}
                  onPress={() => {
                    setClientId(item.id);
                    setSelectedClientName(item.businessName);
                    setClientModalVisible(false);
                  }}
                >
                  <Text style={{ color: currentColors.text }}>
                    {item.businessName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <Modal visible={stateModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setStateModalVisible(false)}
        >
          <View
            style={[styles.modalBox, { backgroundColor: currentColors.card }]}
          >
            <FlatList
              data={states}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: currentColors.border },
                  ]}
                  onPress={() => {
                    setStateId(item.id);
                    setSelectedStateName(item.name);
                    setStateModalVisible(false);
                  }}
                >
                  <Text style={{ color: currentColors.text }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  label: {
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
  },

  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },

  newClientButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  newClientText: {
    fontWeight: "600",
  },

  createButton: {
    marginTop: 30,
    backgroundColor: "#13a3ec",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  createButtonText: {
    color: "white",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    maxHeight: 400,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
  },

  modalItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});
