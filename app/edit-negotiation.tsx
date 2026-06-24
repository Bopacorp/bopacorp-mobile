import BackButton from "@/components/BackButton";
import { Text } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { globalStyles } from "@/constants/Styles";
import {
  getNegotiationStates,
  updateNegotiation,
} from "@/services/ClientServices";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  View as RNView,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditNegotiationScreen() {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  const params = useLocalSearchParams();
  const negotiationId = params.id?.toString() || "";

  const toLocalYYYYMMDD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const parseDate = (dateStr: string | string[] | undefined) => {
    if (!dateStr || dateStr === "N/A") return new Date();
    const str = Array.isArray(dateStr) ? dateStr[0] : dateStr;
    const parts = str.split("/");
    if (parts.length !== 3) return new Date();
    const [day, month, year] = parts;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const [startDate, setStartDate] = useState(() => parseDate(params.date));
  const [closeDate, setCloseDate] = useState(() =>
    parseDate(params.estimatedCloseDate),
  );

  const [isActive, setIsActive] = useState(() => params.isActive !== "false");
  const [observations, setObservations] = useState(
    params.observations?.toString() || "",
  );
  const [states, setStates] = useState<any[]>([]);
  const [stateId, setStateId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    loadStates();
  }, []);

  async function loadStates() {
    try {
      const statesData = await getNegotiationStates();
      setStates(statesData);

      const currentStatusName = params.status?.toString();
      if (currentStatusName) {
        const found = statesData.find(
          (s: any) =>
            s.name.toLowerCase() === currentStatusName.toLowerCase() ||
            s.name.replace(/ó/g, "o").replace(/é/g, "e").toLowerCase() ===
              currentStatusName
                .replace(/ó/g, "o")
                .replace(/é/g, "e")
                .toLowerCase(),
        );
        if (found) {
          setStateId(found.id);
          setSelectedStatus(found.name);
        } else {
          setSelectedStatus(currentStatusName);
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoadingStates(false);
    }
  }

  // Read-only info
  const clientName = params.clientName?.toString() || "";
  const amount = params.amount?.toString() || "$0.00";

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const placeholderColor = colorScheme === "dark" ? "#5c6e8c" : "#9CA3AF";

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

  const handleSave = async () => {
    try {
      await updateNegotiation(negotiationId, {
        stateId: stateId || undefined,
        startDate: toLocalYYYYMMDD(startDate),
        estimatedCloseDate: toLocalYYYYMMDD(closeDate),
        observations,
        isActive,
      });

      alert("Negociación actualizada");

      router.back();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar negociación");
    }
  };

  if (loadingStates) {
    return (
      <RNView
        style={[
          globalStyles.loadingContainer,
          { backgroundColor: currentColors.background, paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={currentColors.primary} />
      </RNView>
    );
  }

  return (
    <ScrollView
      style={[
        globalStyles.container,
        { backgroundColor: currentColors.background, paddingTop: insets.top },
      ]}
      contentContainerStyle={[
        styles.scrollContent,
        { backgroundColor: currentColors.background },
      ]}
    >
      {/* ── Top bar ── */}
      <RNView style={styles.topBar}>
        <BackButton />
      </RNView>

      <Text style={[styles.title, { color: currentColors.text }]}>
        Editar negociación
      </Text>
      {clientName ? (
        <Text
          style={[styles.subtitle, { color: currentColors.mutedForeground }]}
        >
          {clientName}
        </Text>
      ) : null}

      {/* ── Campos editables ── */}
      <RNView
        style={[
          styles.card,
          {
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: currentColors.text }]}>
          Cliente
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: currentColors.text,
            paddingVertical: 6,
          }}
        >
          {clientName}
        </Text>



        {/* Estado — selector modal */}
        <Text style={[styles.label, { color: currentColors.text }]}>
          Estado
        </Text>
        <TouchableOpacity
          style={[
            styles.selector,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
            },
          ]}
          onPress={() => setStatusModalVisible(true)}
        >
          <Text
            style={[
              styles.selectorText,
              { color: selectedStatus ? currentColors.text : placeholderColor },
            ]}
          >
            {selectedStatus || "Seleccionar estado"}
          </Text>
          <FontAwesome
            name="chevron-down"
            size={12}
            color={currentColors.mutedForeground}
          />
        </TouchableOpacity>

        <Text style={[styles.label, { color: currentColors.mutedForeground }]}>
          Fecha de inicio{" "}
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: currentColors.mutedForeground,
            paddingVertical: 6,
          }}
        >
          {startDate.toLocaleDateString("es-ES")}
        </Text>


        <Text style={[styles.label, { color: currentColors.text }]}>
          Fecha de cierre
        </Text>

        <TouchableOpacity
          style={[
            styles.inputWrapper,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
            },
          ]}
          onPress={() => setShowClosePicker(true)}
        >
          <Text style={[styles.input, { color: currentColors.text }]}>
            {closeDate.toLocaleDateString("es-ES")}
          </Text>

          <FontAwesome name="calendar-o" size={14} color={placeholderColor} />
        </TouchableOpacity>

        {showClosePicker && (
          <Calendar
            current={toLocalYYYYMMDD(closeDate)}
            onDayPress={(day) => {
              setCloseDate(new Date(day.year, day.month - 1, day.day));
              setShowClosePicker(false);
            }}
            theme={calendarTheme}
          />
        )}

        {/* Observaciones */}
        <Text style={[styles.label, { color: currentColors.text }]}>
          Observaciones
        </Text>
        <TextInput
          style={[
            styles.inputBare,
            styles.textarea,
            {
              borderColor: currentColors.border,
              backgroundColor: currentColors.secondary,
              color: currentColors.text,
            },
          ]}
          value={observations}
          onChangeText={setObservations}
          placeholder="Notas adicionales..."
          placeholderTextColor={placeholderColor}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </RNView>
      <RNView style={styles.switchRow}>
        <Text
          style={[styles.label, { color: currentColors.text, marginTop: 0 }]}
        >
          Activa
        </Text>

        <Switch value={isActive} onValueChange={setIsActive} />
      </RNView>
      {/* ── Acciones ── */}
      <RNView style={styles.actions}>
        <TouchableOpacity
          style={[styles.cancelBtn, { borderColor: currentColors.border }]}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.cancelText,
              { color: currentColors.mutedForeground },
            ]}
          >
            Cancelar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: currentColors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Guardar cambios</Text>
        </TouchableOpacity>
      </RNView>

      {/* ── Modal de estado ── */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setStatusModalVisible(false)}
        >
          <RNView
            style={[styles.modalBox, { backgroundColor: currentColors.card }]}
          >
            <RNView
              style={[
                styles.modalHeader,
                { borderBottomColor: currentColors.border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: currentColors.text }]}>
                Seleccionar estado
              </Text>
              <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                <FontAwesome
                  name="times"
                  size={18}
                  color={currentColors.mutedForeground}
                />
              </TouchableOpacity>
            </RNView>

            <FlatList
              data={states}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = stateId === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      { borderBottomColor: currentColors.border },
                      isSelected && {
                        backgroundColor:
                          colorScheme === "dark"
                            ? "rgba(0, 127, 206, 0.15)"
                            : "#EFF6FF",
                      },
                    ]}
                    onPress={() => {
                      setStateId(item.id);
                      setSelectedStatus(item.name);
                      setStatusModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        { color: currentColors.text },
                        isSelected && {
                          color: currentColors.primary,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isSelected && (
                      <FontAwesome
                        name="check"
                        size={14}
                        color={currentColors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </RNView>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },

  topBar: { marginBottom: 16 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { fontSize: 14, color: "#6B7280", marginLeft: 6 },

  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#6B7280", marginBottom: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  readonlyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  readonlyKey: { fontSize: 14, color: "#6B7280" },
  readonlyValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  divider: { height: 1, backgroundColor: "#F3F4F6" },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 14,
    marginBottom: 6,
  },

  /* selector */
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: "#FAFAFA",
  },
  selectorText: { fontSize: 14, color: "#111827" },
  selectorPlaceholder: { color: "#9CA3AF" },

  /* inputs */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
    height: 44,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: "#111827" },
  inputBare: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FAFAFA",
  },
  textarea: { height: 100 },

  /* actions */
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#13a3ec",
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    width: "100%",
    maxWidth: 360,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  modalItemSelected: { backgroundColor: "#EFF6FF" },
  modalItemText: { fontSize: 15, color: "#374151" },
  modalItemTextSelected: { color: "#13a3ec", fontWeight: "600" },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
});
