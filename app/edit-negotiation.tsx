import { Text } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";
import { updateNegotiation } from "@/services/ClientServices";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
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

const ESTADOS = [
  "Prospección",
  "Contacto Inicial",
  "Negociación",
  "Cierre",
  "Post-venta",
] as const;
type Estado = (typeof ESTADOS)[number];

export default function EditNegotiationScreen() {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  const params = useLocalSearchParams();
  const negotiationId = params.id?.toString() || "";

  const [startDate, setStartDate] = useState(
    params.date
      ? new Date(params.date.toString().split("/").reverse().join("-"))
      : new Date(),
  );

  const [closeDate, setCloseDate] = useState(
    params.estimatedCloseDate
      ? new Date(
          params.estimatedCloseDate.toString().split("/").reverse().join("-"),
        )
      : new Date(),
  );

  const [isActive, setIsActive] = useState(true);
  const [observations, setObservations] = useState(
    params.observations?.toString() || "",
  );
  const [selectedStatus, setSelectedStatus] = useState<Estado | "">(
    (params.status?.toString() as Estado) || "",
  );
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // Read-only info
  const clientName = params.clientName?.toString() || "";

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ── Top bar ── */}
      <RNView style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={18} color="#374151" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </RNView>

      <Text style={styles.title}>Editar negociación</Text>
      {clientName ? <Text style={styles.subtitle}>{clientName}</Text> : null}

      {/* ── Campos editables ── */}
      <RNView style={styles.card}>
        <Text style={styles.label}>Cliente</Text>

        <TextInput style={styles.input} value={clientName} editable={false} />

        {/* Estado — selector modal */}
        <Text style={styles.label}>Estado</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setStatusModalVisible(true)}
        >
          <Text
            style={[
              styles.selectorText,
              !selectedStatus && styles.selectorPlaceholder,
            ]}
          >
            {selectedStatus || "Seleccionar estado"}
          </Text>
          <FontAwesome name="chevron-down" size={12} color="#6B7280" />
        </TouchableOpacity>

        <Text style={styles.label}>Fecha de inicio</Text>

        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate.toLocaleDateString("es-ES")}</Text>

          <FontAwesome name="calendar-o" size={14} color="#9CA3AF" />
        </TouchableOpacity>

        {showStartPicker && (
          <Calendar
            current={startDate.toISOString().split("T")[0]}
            onDayPress={(day) => {
              setStartDate(new Date(day.dateString));
              setShowStartPicker(false);
            }}
            theme={{
              todayTextColor: "#13a3ec",
              selectedDayBackgroundColor: "#13a3ec",
              arrowColor: "#13a3ec",
            }}
          />
        )}

        <Text style={styles.label}>Fecha de cierre</Text>

        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={() => setShowClosePicker(true)}
        >
          <Text style={styles.input}>
            {closeDate.toLocaleDateString("es-ES")}
          </Text>

          <FontAwesome name="calendar-o" size={14} color="#9CA3AF" />
        </TouchableOpacity>

        {showClosePicker && (
          <Calendar
            current={closeDate.toISOString().split("T")[0]}
            onDayPress={(day) => {
              setCloseDate(new Date(day.dateString));
              setShowClosePicker(false);
            }}
            theme={{
              todayTextColor: "#13a3ec",
              selectedDayBackgroundColor: "#13a3ec",
              arrowColor: "#13a3ec",
            }}
          />
        )}

        {/* Observaciones */}
        <Text style={styles.label}>Observaciones</Text>
        <TextInput
          style={[styles.inputBare, styles.textarea]}
          value={observations}
          onChangeText={setObservations}
          placeholder="Notas adicionales..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </RNView>
      <RNView style={styles.switchRow}>
        <Text style={styles.label}>Activa</Text>

        <Switch value={isActive} onValueChange={setIsActive} />
      </RNView>
      {/* ── Acciones ── */}
      <RNView style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={async () => {
            try {
              await updateNegotiation(negotiationId, {
                estimatedCloseDate: closeDate.toISOString(),
                observations,
                isActive,
              });

              alert("Negociación actualizada");

              router.back();
            } catch (error) {
              console.error(error);
              alert("Error al actualizar negociación");
            }
          }}
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
          <RNView style={styles.modalBox}>
            <RNView style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar estado</Text>
              <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                <FontAwesome name="times" size={18} color="#6B7280" />
              </TouchableOpacity>
            </RNView>

            <FlatList
              data={ESTADOS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = selectedStatus === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedStatus(item);
                      setStatusModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        isSelected && styles.modalItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <FontAwesome name="check" size={14} color="#13a3ec" />
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
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 44, fontSize: 14, color: "#111827" },
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
