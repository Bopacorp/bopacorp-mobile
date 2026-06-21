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

import { Text } from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";
import { useAuth } from "@/context/AuthContext";
import {
    createNegotiation,
    getBusinessClients,
    getNegotiationStates,
} from "@/services/ClientServices";

export default function CreateNegotiationScreen() {
  const { user } = useAuth();

  const [clients, setClients] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const [clientId, setClientId] = useState("");
  const [stateId, setStateId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [estimatedCloseDate, setEstimatedCloseDate] = useState("");
  const [observations, setObservations] = useState("");

  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);

  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const clientsData = await getBusinessClients();

      console.log("CLIENTES:", clientsData);

      setClients(clientsData);

      const statesData = await getNegotiationStates();

      console.log("ESTADOS:", statesData);

      setStates(statesData);
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

      await createNegotiation({
        clientId,
        advisorId: user?.id || "",
        stateId,
        startDate,
        estimatedCloseDate,
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

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Nueva negociación</Text>

        <TouchableOpacity onPress={() => router.replace("/negotiations")}>
          <FontAwesome name="times" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Cliente</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setClientModalVisible(true)}
      >
        <Text>{selectedClientName || "Seleccionar cliente"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.newClientButton}
        onPress={() => router.push("/create-client")}
      >
        <FontAwesome name="plus" size={14} color="#111827" />
        <Text style={styles.newClientText}>Nuevo cliente</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Estado inicial</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setStateModalVisible(true)}
      >
        <Text>{selectedStateName || "Seleccionar estado"}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Fecha de inicio</Text>

      <TextInput
        style={styles.input}
        placeholder="dd/mm/aaaa"
        value={startDate}
        onChangeText={setStartDate}
      />

      <Text style={styles.label}>Cierre estimado</Text>

      <TextInput
        style={styles.input}
        placeholder="dd/mm/aaaa"
        value={estimatedCloseDate}
        onChangeText={setEstimatedCloseDate}
      />

      <Text style={styles.label}>Observaciones</Text>

      <TextInput
        style={styles.textarea}
        multiline
        value={observations}
        onChangeText={setObservations}
        placeholder="Notas adicionales..."
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Crear negociación</Text>
      </TouchableOpacity>

      <Modal visible={clientModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setClientModalVisible(false)}
        >
          <View style={styles.modalBox}>
            <FlatList
              data={clients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setClientId(item.id);
                    setSelectedClientName(item.businessName);
                    setClientModalVisible(false);
                  }}
                >
                  <Text>{item.businessName}</Text>
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
          <View style={styles.modalBox}>
            <FlatList
              data={states}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setStateId(item.id);
                    setSelectedStateName(item.name);
                    setStateModalVisible(false);
                  }}
                >
                  <Text>{item.name}</Text>
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
