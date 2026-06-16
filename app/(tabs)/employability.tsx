import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { apiClient } from '../../services/api';

export default function EmployabilityScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? 'light'];

  const [nationalId, setNationalId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vacancyId, setVacancyId] = useState<string | null>(null);
  const [isLoadingVacancy, setIsLoadingVacancy] = useState(true);

  // Fetch the first published vacancy on screen load to attach candidate to
  useEffect(() => {
    async function loadVacancy() {
      try {
        const response: any = await apiClient.get('/api/v1/employability/vacancies/published');
        if (response && response.length > 0) {
          setVacancyId(response[0].id);
        }
      } catch (err) {
        console.warn("Could not fetch published vacancies:", err);
      } finally {
        setIsLoadingVacancy(false);
      }
    }
    loadVacancy();
  }, []);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'No se pudo seleccionar el documento.');
    }
  };

  const handleRemoveDocument = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!nationalId || !fullName || !email || !phone) {
      Alert.alert('Campos Incompletos', 'Por favor, llene todos los campos del formulario.');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Falta Documento', 'Por favor, adjunte su currículum en formato PDF.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Split full name into firstName and lastName for database schemas
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || 'Sin Apellido';

      // Construct multipart FormData payload
      const formData = new FormData();
      
      // Candidate info object (parsed by backend parseMultipartJsonBody(['candidate']))
      formData.append('candidate', JSON.stringify({
        nationalId: nationalId.trim(),
        firstName,
        lastName,
        email: email.trim(),
        phone: phone.trim(),
      }));

      // Vacancy ID (fallback to dummy UUID if no vacancy published is loaded)
      formData.append('vacancyId', vacancyId || '00000000-0000-0000-0000-000000000000');

      // PDF Document attachment
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name || 'cv.pdf',
        type: selectedFile.mimeType || 'application/pdf',
      } as any);

      // Perform POST request with custom header configuration
      await apiClient.post('/api/v1/employability/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert(
        'Postulación Recibida',
        'Su información y hoja de vida han sido registradas exitosamente en el sistema de BOPACORP.',
        [
          {
            text: 'OK',
            onPress: () => {
              setNationalId('');
              setFullName('');
              setEmail('');
              setPhone('');
              setSelectedFile(null);
            },
          },
        ]
      );
    } catch (err: any) {
      const errorMsg = err.message || 'No se pudo registrar su postulación. Inténtelo de nuevo.';
      Alert.alert('Error al Postular', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.description, { color: currentColors.mutedForeground }]}>
        Registre candidatos externos para puestos de asesores comerciales o aplique a convocatorias vigentes.
      </Text>

      {/* Form Fields */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: currentColors.text }]}>Número de Cédula</Text>
        <TextInput
          value={nationalId}
          onChangeText={setNationalId}
          placeholder="Ej: 1712345678"
          placeholderTextColor={currentColors.mutedForeground}
          keyboardType="numeric"
          editable={!isSubmitting}
          style={[styles.input, { color: currentColors.text, borderColor: currentColors.border, backgroundColor: currentColors.card }]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: currentColors.text }]}>Nombres Completos</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Ej: Juan Pérez"
          placeholderTextColor={currentColors.mutedForeground}
          editable={!isSubmitting}
          style={[styles.input, { color: currentColors.text, borderColor: currentColors.border, backgroundColor: currentColors.card }]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: currentColors.text }]}>Correo Electrónico</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Ej: juan.perez@bopacorp.com"
          placeholderTextColor={currentColors.mutedForeground}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isSubmitting}
          style={[styles.input, { color: currentColors.text, borderColor: currentColors.border, backgroundColor: currentColors.card }]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: currentColors.text }]}>Teléfono de Contacto</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Ej: 0987654321"
          placeholderTextColor={currentColors.mutedForeground}
          keyboardType="phone-pad"
          editable={!isSubmitting}
          style={[styles.input, { color: currentColors.text, borderColor: currentColors.border, backgroundColor: currentColors.card }]}
        />
      </View>

      {/* Document Picker */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: currentColors.text }]}>Hoja de Vida (PDF)</Text>
        {selectedFile ? (
          <View style={[styles.fileCard, { borderColor: currentColors.border, backgroundColor: currentColors.card }]}>
            <View style={styles.fileCardLeft}>
              <FontAwesome name="file-pdf-o" size={24} color="#d6336c" style={{ marginRight: 10 }} />
              <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                <Text numberOfLines={1} style={[styles.fileName, { color: currentColors.text }]}>
                  {selectedFile.name}
                </Text>
                <Text style={[styles.fileSize, { color: currentColors.mutedForeground }]}>
                  {(selectedFile.size ? selectedFile.size / (1024 * 1024) : 0).toFixed(2)} MB
                </Text>
              </View>
            </View>
            <Pressable onPress={handleRemoveDocument} style={styles.removeButton} disabled={isSubmitting}>
              <FontAwesome name="trash" size={18} color={currentColors.mutedForeground} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handlePickDocument}
            disabled={isSubmitting}
            style={[styles.pickerButton, { borderColor: currentColors.primary, backgroundColor: currentColors.card }]}
          >
            <FontAwesome name="upload" size={18} color={currentColors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerButtonText, { color: currentColors.primary }]}>Seleccionar PDF</Text>
          </Pressable>
        )}
      </View>

      {/* Submit Button */}
      <Pressable
        disabled={isSubmitting || isLoadingVacancy}
        onPress={handleSubmit}
        style={[styles.submitButton, { backgroundColor: currentColors.primary, opacity: (isSubmitting || isLoadingVacancy) ? 0.7 : 1 }]}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isLoadingVacancy ? 'Cargando convocatorias...' : 'Enviar Postulación'}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  pickerButton: {
    height: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  fileCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  fileName: {
    fontSize: 14,
    fontWeight: 'medium',
  },
  fileSize: {
    fontSize: 11,
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
