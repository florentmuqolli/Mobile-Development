import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';

const AssignmentStatsModal = ({ visible, onClose, assignment }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.statsModalContainer}>
          <Text style={styles.modalTitle}>
            {assignment?.title} - Submissions
          </Text>
          
          <View style={styles.statsHeader}>
            <Text style={styles.statsHeaderText}>Student ID</Text>
            <Text style={styles.statsHeaderText}>Submitted at</Text>
            <Text style={styles.statsHeaderText}>Submitted file</Text>
          </View>
          
          <FlatList
            data={assignment?.submissions || []}
            renderItem={({ item }) => (
              <View style={styles.submissionRow}>
                <Text style={styles.submissionText}>{item.student_id}</Text>
                <Text style={styles.submissionText}>{item.submitted_at}</Text>
                <Text style={styles.submissionText}>{item.grade}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.noSubmissionsText}>No submissions yet</Text>
            }
          />
          
          <View style={styles.statsSummary}>
            <Text style={styles.summaryText}>
              Submitted: {/*{assignment?.submissions.length || 0}*/}
            </Text>
            <Text style={styles.summaryText}>
              Pending: {/*{20 - (assignment?.submissions.length || 0)}*/}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.closeStatsButton}
            onPress={onClose}
          >
            <Text style={styles.closeStatsText}>Close</Text>
          </TouchableOpacity>
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

export default AssignmentStatsModal;