import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import Toast from "react-native-toast-message";
import axiosInstance from '../../../services/axiosInstance';

const EnrollmentFormModal = ({ visible, onClose, enrollment, refreshEnrollments }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    class_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      student_id: '',
      class_id: ''
    });
    setErrors({});
  }, [enrollment, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/enrollment', formData);
      Toast.show({
        type: "success",
        text1: "Enrollment Created",
      });
      refreshEnrollments();
      onClose();
    } catch (error) {
      console.error('Error saving enrollment:', error);
      if (error.response?.data?.message) {
        setErrors({ api: error.response.data.message });
      }
      const message =
        error.response?.data?.message || 
        error.message || "Something went wrong";
        
      Toast.show({
        type: "error",
        text1: "Enrollment proccessing failed",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {'Add New Enrollment'}
          </Text>

          {errors.api && (
            <Text style={styles.errorText}>{errors.api}</Text>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student ID*</Text>
            <TextInput
              style={[styles.input, errors.student_id && styles.inputError]}
              placeholder="eg. 13"
              value={formData.student_id}
              onChangeText={(text) => setFormData({...formData, student_id: text})}
            />
            {errors.student_id && <Text style={styles.errorText}>{errors.student_id}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course ID*</Text>
            <TextInput
              style={[styles.input, errors.class_id && styles.inputError]}
              placeholder="eg. 12"
              value={formData.class_id}
              onChangeText={(text) => setFormData({...formData, class_id: text})}
            />
            {errors.class_id && <Text style={styles.errorText}>{errors.class_id}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {'Create'}
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
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  statusContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  activeStatusButton: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  activeStatusButtonText: {
    color: '#FFF',
  },
  inactiveStatusButton: {
    backgroundColor: '#FF7675',
    borderColor: '#FF7675',
  },
  inactiveStatusButtonText: {
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default EnrollmentFormModal;