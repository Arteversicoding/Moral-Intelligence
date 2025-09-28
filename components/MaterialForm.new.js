import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  Platform,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { uploadFile, updateMateri, getFileIcon, formatFileSize } from '../services/materiService';

const MaterialForm = ({ material, onSuccess, onCancel }) => {
  const [judul, setJudul] = useState(material?.judul || '');
  const [deskripsi, setDeskripsi] = useState(material?.deskripsi || '');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (material) {
      setJudul(material.judul || '');
      setDeskripsi(material.deskripsi || '');
      if (material.nama_file) {
        setFile({
          name: material.nama_file,
          type: material.tipe_file,
          size: material.ukuran_file,
          uri: material.url_file
        });
      }
    }
  }, [material]);

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
          content: await FileSystem.readAsStringAsync(result.uri, {
            encoding: FileSystem.EncodingType.Base64,
          })
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
          ...(file && { file })
        });
        Alert.alert('Sukses', 'Materi berhasil diperbarui');
      } else {
        await uploadFile(file, { 
          judul, 
          deskripsi: deskripsi || '' 
        });
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
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Judul</Text>
        <TextInput
          style={styles.input}
          value={judul}
          onChangeText={setJudul}
          placeholder="Masukkan judul materi"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Deskripsi (Opsional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={deskripsi}
          onChangeText={setDeskripsi}
          placeholder="Masukkan deskripsi materi"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>File Materi {!material && '(Wajib)'}</Text>
        {file ? (
          <View style={styles.filePreview}>
            <MaterialIcons 
              name={getFileIcon(file.name)} 
              size={32} 
              color="#007AFF" 
              style={styles.fileIcon}
            />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
              <Text style={styles.fileSize}>
                {formatFileSize(file.size)}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={pickDocument}
              style={styles.changeFileButton}
            >
              <Text style={styles.changeFileText}>Ganti</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={pickDocument}
            disabled={isSubmitting}
          >
            <MaterialIcons name="cloud-upload" size={24} color="#007AFF" />
            <Text style={styles.uploadButtonText}>Pilih File</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, (isSubmitting || !judul.trim() || (!material && !file)) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting || !judul.trim() || (!material && !file)}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {material ? 'Perbarui' : 'Simpan'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
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
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    backgroundColor: '#f0f7ff',
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  changeFileButton: {
    marginLeft: 12,
    padding: 8,
  },
  changeFileText: {
    color: '#007AFF',
    fontWeight: '500',
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
