import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackArrowIcon } from '../../assets/Icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import AssignmentFormModal from './utils/AssignmentFormModal';
import AssignmentStatsModal from './utils/AssignmentStatsModal';
import axiosInstance from '../../services/axiosInstance';

const TeacherAssignmentsScreen = () => {
  const navigation = useNavigation();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/assignment');
      setLoading(false);
      setAssignments(res.data); 
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewStats = async (assignment) => {
    setLoading(true);
    try {
        const res = await axiosInstance.get(`/assignment/${assignment.id}/activity`);
        setLoading(false);
        setSelectedAssignment({ ...assignment, submissions: res.data });
        setShowStatsModal(true);
    } catch (err) {
        setLoading(false);
        console.error('Failed to load submissions:', err);
    }
  };

  const toggleVisibility = (id) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? {...assignment, visible: !assignment.visible} : assignment
    ));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

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
          <Text style={styles.headerTitle}>My Assignments</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setSelectedAssignment(null);
              setModalVisible(true);
            }}
          >
            <Icon name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.assignmentsContainer}>
          {assignments.length === 0 ? (
            <View style={styles.emptyState}>
              <Image 
                source={require('../../assets/folder.png')} 
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>No assignments yet</Text>
              <Text style={styles.emptySubtext}>Create your first assignment</Text>
            </View>
          ) : (
            assignments.map(assignment => (
              <View key={assignment.id} style={styles.assignmentCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  <View style={styles.visibilityBadge}>
                    <Text style={styles.visibilityText}>
                      {assignment.visible ? 'Visible' : 'Hidden'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.deadlineRow}>
                  <Icon name="schedule" size={16} color="#6C5CE7" />
                  <Text style={styles.deadlineText}>
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </Text>
                </View>
                
                <Text style={styles.detailsText}>{assignment.description}</Text>
                
                <View style={styles.cardFooter}>
                  <TouchableOpacity 
                    style={styles.smallButton}
                    onPress={() => viewStats(assignment)}
                  >
                    <Icon name="analytics" size={16} color="#6C5CE7" />
                    <Text style={styles.smallButtonText}>Stats</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.iconButton, styles.visibilityButton]}
                      onPress={() => toggleVisibility(assignment.id)}
                    >
                      <Icon 
                        name={assignment.visible ? 'visibility' : 'visibility-off'} 
                        size={20} 
                        color="#FFF" 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} 
                    onPress={() => {
                      setSelectedAssignment(assignment);
                      setModalVisible(true);
                    }}>
                      <Icon name="edit" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <AssignmentFormModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          assignment={selectedAssignment}
          refreshAssignments={fetchAssignments}
        />

        <AssignmentStatsModal
          visible={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          assignment={selectedAssignment}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
  },
  addButton: {
    backgroundColor: '#6C5CE7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  assignmentsContainer: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#636E72',
  },
  assignmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    flex: 1,
  },
  visibilityBadge: {
    backgroundColor: '#E3F9E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  visibilityText: {
    color: '#00B894',
    fontSize: 12,
    fontWeight: '600',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deadlineText: {
    color: '#6C5CE7',
    fontSize: 14,
    marginLeft: 8,
  },
  detailsText: {
    color: '#636E72',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 12,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
  },
  smallButtonText: {
    color: '#6C5CE7',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  visibilityButton: {
    backgroundColor: '#00B894',
  },
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
  statsModalContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#2D3436',
  },
  detailsInput: {
    height: 100,
    textAlignVertical: 'top',
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
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  statsHeaderText: {
    fontWeight: '600',
    color: '#636E72',
    flex: 1,
    textAlign: 'center',
  },
  submissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  submissionText: {
    flex: 1,
    textAlign: 'center',
    color: '#2D3436',
  },
  noSubmissionsText: {
    textAlign: 'center',
    color: '#636E72',
    marginTop: 20,
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  summaryText: {
    fontWeight: '600',
    color: '#2D3436',
  },
  closeStatsButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeStatsText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default TeacherAssignmentsScreen;