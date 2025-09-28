import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { uploadFile, updateMateri, getFileIcon, formatFileSize } from '../services/materiService';

const MaterialForm = ({ material, onSuccess, onCancel }) => {
  const [judul, setJudul] = useState(material?.judul || '');
  const [deskripsi, setDeskripsi] = useState(material?.deskripsi || '');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        setFile({
          name: result.name,
          type: result.mimeType,
          size: fileInfo.size,
          uri: result.uri,
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Gagal memilih dokumen');
    }
  };

  const handleSubmit = async () => {
    if (!judul.trim()) {
      Alert.alert('Error', 'Judul tidak boleh kosong');
      return;
    }

    if (!material && !file) {
      Alert.alert('Error', 'Silakan pilih file');
      return;
    }

    setIsSubmitting(true);

    try {
      if (material) {
        await updateMateri(material.id, { 
          judul, 
          deskripsi: deskripsi || '',
        });
        Alert.alert('Sukses', 'Materi berhasil diperbarui');
      } else {
        const fileContent = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        await uploadFile(
          { ...file, content: fileContent },
          { judul, deskripsi: deskripsi || '' }
        );
        Alert.alert('Sukses', 'Materi berhasil diunggah');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Judul*</Text>
      <TextInput
        style={styles.input}
        value={judul}
        onChangeText={setJudul}
        placeholder="Masukkan judul materi"
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={deskripsi}
        onChangeText={setDeskripsi}
        placeholder="Masukkan deskripsi materi"
        multiline
        numberOfLines={4}
      />

      {!material && (
        <>
          <Text style={styles.label}>File Materi*</Text>
          <TouchableOpacity 
            style={styles.fileButton}
            onPress={pickDocument}
            disabled={isSubmitting}
          >
            <MaterialIcons name="attach-file" size={20} color="#007AFF" />
            <Text style={styles.fileButtonText}>
              {file ? file.name : 'Pilih File'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Format yang didukung: PDF, DOC, DOCX, PPT, PPTX
          </Text>
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting || !judul.trim() || (!material && !file)}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {material ? 'Perbarui' : 'Unggah'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fileButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#a0c4ff',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default MaterialForm;
