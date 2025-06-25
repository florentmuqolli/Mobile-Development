import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import Toast from "react-native-toast-message";
import axiosInstance from '../../../services/axiosInstance';

const TeacherFormModal = ({ visible, onClose, teacher, refreshTeachers }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        department: teacher.department || '',
        status: teacher.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [teacher, visible]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (teacher) {
        await axiosInstance.put(`/teachers/${teacher.id}`, formData);
        Toast.show({
            type: "success",
            text1: "Teacher Updated",
        });
      } else {
        await axiosInstance.post('/teachers', formData);
        Toast.show({
            type: "success",
            text1: "Teacher Created",
        });
      }
      refreshTeachers();
      onClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
      if (error.response?.data?.message) {
        setErrors({ api: error.response.data.message });
      }
      const message =
        error.response?.data?.message || 
        error.message || "Something went wrong";
        
      Toast.show({
        type: "error",
        text1: "Teacher proccessing failed",
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
            {teacher ? 'Edit Teacher' : 'Add New Teacher'}
          </Text>

          {errors.api && (
            <Text style={styles.errorText}>{errors.api}</Text>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="teacher@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone*</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department*</Text>
            <TextInput
              style={[styles.input, errors.department && styles.inputError]}
              placeholder="Biology"
              value={formData.department}
              onChangeText={(text) => setFormData({...formData, department: text})}
            />
            {errors.address && <Text style={styles.errorText}>{errors.department}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === 'Active' && styles.activeStatusButton
                ]}
                onPress={() => setFormData({...formData, status: 'Active'})}
              >
                <Text style={[
                  styles.statusButtonText,
                  formData.status === 'Active' && styles.activeStatusButtonText
                ]}>
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === 'Inactive' && styles.inactiveStatusButton
                ]}
                onPress={() => setFormData({...formData, status: 'Inactive'})}
              >
                <Text style={[
                  styles.statusButtonText,
                  formData.status === 'Inactive' && styles.inactiveStatusButtonText
                ]}>
                  Inactive
                </Text>
              </TouchableOpacity>
            </View>
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
                  {teacher ? 'Update' : 'Create'}
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

export default TeacherFormModal;