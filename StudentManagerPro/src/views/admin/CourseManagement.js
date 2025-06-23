import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddCourseScreen = () => {
  const navigation = useNavigation();
  const [courseData, setCourseData] = useState({
    title: '',
    code: '',
    creditHours: '',
    instructor: '',
    schedule: '',
    description: ''
  });

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // In real app: axiosInstance.post('/courses', courseData)
    console.log('Course data:', courseData);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#6C5CE7" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Course</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Title*</Text>
          <TextInput
            style={styles.input}
            placeholder="Introduction to Computer Science"
            value={courseData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Code*</Text>
          <TextInput
            style={styles.input}
            placeholder="CS101"
            value={courseData.code}
            onChangeText={(text) => handleInputChange('code', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Credit Hours*</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            keyboardType="numeric"
            value={courseData.creditHours}
            onChangeText={(text) => handleInputChange('creditHours', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instructor*</Text>
          <TextInput
            style={styles.input}
            placeholder="Dr. Smith"
            value={courseData.instructor}
            onChangeText={(text) => handleInputChange('instructor', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Schedule*</Text>
          <TextInput
            style={styles.input}
            placeholder="Mon/Wed 10:00-11:30"
            value={courseData.schedule}
            onChangeText={(text) => handleInputChange('schedule', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Course objectives and topics..."
            multiline
            value={courseData.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!courseData.title || !courseData.code || !courseData.creditHours || !courseData.instructor || !courseData.schedule}
        >
          <Text style={styles.submitButtonText}>Create Course</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
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
    padding: 15,
    fontSize: 16,
    color: '#2D3436',
  },
  submitButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddCourseScreen;