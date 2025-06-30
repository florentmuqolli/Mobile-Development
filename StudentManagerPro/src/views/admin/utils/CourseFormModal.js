import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import Toast from "react-native-toast-message";
import axiosInstance from '../../../services/axiosInstance';

const CourseFormModal = ({ visible, onClose, course, refreshCourses }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teacher_id: '',
    schedule: '',
    day: '',
    room: '',
    status: '' || 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        teacher_id: course.teacher_id || '',
        schedule: course.schedule || '',
        day: course.day || '',
        room: course.room || '',
        status: course.status || 'Active'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        teacher_id: '',
        schedule: '',
        day: '',
        room: '',
        status: '' || 'Active'
      });
    }
    setErrors({});
  }, [course, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (course) {
        await axiosInstance.put(`/class/${course.id}`, formData);
        Toast.show({
            type: "success",
            text1: "Course Updated",
        });
      } else {
        await axiosInstance.post('/class', formData);
        Toast.show({
            type: "success",
            text1: "Course Created",
        });
      }
      refreshCourses();
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
        text1: "Course proccessing failed",
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
            {course ? 'Edit Course' : 'Add New Course'}
          </Text>

          {errors.api && (
            <Text style={styles.errorText}>{errors.api}</Text>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title*</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Title Example"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description*</Text>
            <TextInput
              style={[styles.input, errors.description && styles.inputError]}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Professor id*</Text>
            <TextInput
              style={[styles.input, errors.teacher_id && styles.inputError]}
              placeholder="Teacher id"
              value={formData.teacher_id}
              onChangeText={(text) => setFormData({...formData, teacher_id: text})}
            />
            {errors.teacher_id && <Text style={styles.errorText}>{errors.teacher_id}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Schedule*</Text>
            <TextInput
              style={[styles.input, errors.schedule && styles.inputError]}
              placeholder="15:00 - 16:30"
              value={formData.schedule}
              onChangeText={(text) => setFormData({...formData, schedule: text})}
            />
            {errors.schedule && <Text style={styles.errorText}>{errors.schedule}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Day*</Text>
            <TextInput
              style={[styles.input, errors.day && styles.inputError]}
              placeholder="Friday"
              value={formData.day}
              onChangeText={(text) => setFormData({...formData, day: text})}
            />
            {errors.day && <Text style={styles.errorText}>{errors.day}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Room*</Text>
            <TextInput
              style={[styles.input, errors.room && styles.inputError]}
              placeholder="Room Number (12)"
              value={formData.room}
              onChangeText={(text) => setFormData({...formData, room: text})}
            />
            {errors.room && <Text style={styles.errorText}>{errors.room}</Text>}
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
                  {course ? 'Update' : 'Create'}
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

export default CourseFormModal;