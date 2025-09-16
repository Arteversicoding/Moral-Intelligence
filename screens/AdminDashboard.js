import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialList from '../components/MaterialList';
import MaterialForm from '../components/MaterialForm';

const AdminDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setIsModalVisible(true);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setIsModalVisible(true);
  };

  const handleFormSuccess = () => {
    setIsModalVisible(false);
    setEditingMaterial(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingMaterial(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kelola Materi</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMaterial}>
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Tambah Materi</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <MaterialList onEditMaterial={handleEditMaterial} />
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMaterial ? 'Edit Materi' : 'Tambah Materi Baru'}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <MaterialForm
              material={editingMaterial}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
});

export default AdminDashboard;
