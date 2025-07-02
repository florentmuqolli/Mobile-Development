import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import Toast from "react-native-toast-message";
import axiosInstance from '../../../services/axiosInstance';

const AssignmentFormModal = ({ visible, onClose, assignment, refreshAssignments }) => {
  const [formData, setFormData] = useState({
    class_id: '',
    title: '',
    description: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
      setFormData({
        class_id: assignment.class_id || '',
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: assignment.due_date || ''
      });
    } else {
      setFormData({
        class_id: '',
        title: '',
        description: '',
        due_date: ''
      });
    }
    setErrors({});
  }, [assignment, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (assignment) {
        await axiosInstance.put(`/assignment/${assignment.id}`, formData);
        Toast.show({
            type: "success",
            text1: "Assignment Updated",
        });
      } else {
        await axiosInstance.post('/assignment', formData);
        Toast.show({
            type: "success",
            text1: "Assignment Created",
        });
      }
      refreshAssignments();
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.response?.data?.message) {
        setErrors({ api: error.response.data.message });
      }
      const message =
        error.response?.data?.message || 
        error.message || "Something went wrong";
        
      Toast.show({
        type: "error",
        text1: "Assignment proccessing failed",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {assignment ? 'Edit Assignment' : 'Add New Assignment'}
          </Text>

          {errors.api && (
            <Text style={styles.errorText}>{errors.api}</Text>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course ID*</Text>
              <TextInput
                style={[styles.input, errors.class_id && styles.inputError]}
                placeholder="Course ID"
                value={formData.class_id}
                onChangeText={(text) => setFormData({...formData, class_id: text})}
              />
            {errors.class_id && <Text style={styles.errorText}>{errors.class_id}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title*</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Assignment Title"
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description*</Text>
              <TextInput
                style={[styles.input, errors.description && styles.inputError]}
                placeholder="Assignment Description"
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
              />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deadline*</Text>
              <TextInput
                style={[styles.input, errors.due_date && styles.inputError]}
                placeholder="Assignment deadline"
                value={formData.due_date}
                onChangeText={(text) => setFormData({...formData, due_date: text})}
              />
            {errors.due_date && <Text style={styles.errorText}>{errors.due_date}</Text>}
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {assignment ? 'Update' : 'Create'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#2D3436',
  },
  inputError: {
    borderColor: '#FF7675',
  },
  errorText: {
    color: '#FF7675',
    fontSize: 12,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DFE6E9',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#636E72',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6C5CE7',
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default AssignmentFormModal;