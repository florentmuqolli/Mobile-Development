import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, EditIcon, DeleteIcon, BackArrowIcon, AddIcon } from '../../assets/Icons';
import  StudentFormModal  from './utils/StudentFormModal';

const StudentManagementScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/students'); 
      setLoading(false);
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteStudent = async (id) => {
    try {
      await axiosInstance.delete(`/students/${id}`);
      setStudents(students.filter(student => student.id !== id));
    } catch (err) {
      console.error('Error deleting student:', err);
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
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon/>
          </TouchableOpacity>
          <Text style={styles.title}>Student Management</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.actionBar}>
          <View style={styles.searchContainer}>
            <SearchIcon/>
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setSelectedStudent(null);
              setModalVisible(true);
            }}
          >
            <AddIcon/>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.cardContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 40 }} />
          ) : (
            filteredStudents.map((student) => (
              <View key={student.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>{student.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    student.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
                  ]}>
                    <Text style={styles.statusText}>{student.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardEmail}>{student.email}</Text>
                <Text style={styles.cardEmail}>{student.password}</Text>
                <Text style={styles.cardEmail}>{student.phone}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={() => {
                      setSelectedStudent(student);
                      setModalVisible(true);
                    }}
                  >
                    <EditIcon size={16} />
                    <Text style={styles.cardButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cardButton, { backgroundColor: '#FFEBEE' }]}
                    onPress={() => deleteStudent(student.id)}
                  >
                    <DeleteIcon size={16} color="#FF5252" />
                    <Text style={[styles.cardButtonText, { color: '#FF5252' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      <StudentFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        student={selectedStudent}
        refreshStudents={fetchStudents}
      />
    </ScreenWrapper>
    
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  actionBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: '#2D3436',
    fontSize: 14,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  cardContainer: {
    flex: 1,
    padding: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    flex: 1,
  },
  cardEmail: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE7F6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  cardButtonText: {
    fontSize: 14,
    color: '#6C5CE7',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activeBadge: {
    backgroundColor: '#E3F9E5',
  },
  inactiveBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StudentManagementScreen;