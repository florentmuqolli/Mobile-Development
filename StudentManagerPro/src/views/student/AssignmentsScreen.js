import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

const assignments = [
  { 
    id: "1", 
    title: "Math Homework 1", 
    dueDate: "Due Jun 30", 
    course: "Mathematics", 
    status: "Pending",
    priority: "High"
  },
  { 
    id: "2", 
    title: "English Essay", 
    dueDate: "Due Jul 1", 
    course: "English", 
    status: "In Progress",
    priority: "Medium"
  },
  { 
    id: "3", 
    title: "Physics Lab Report", 
    dueDate: "Due Jul 3", 
    course: "Physics", 
    status: "Not Started",
    priority: "Low"
  },
];

const AssignmentsScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.assignmentCard}>
      <View style={styles.assignmentHeader}>
        <View style={[styles.courseIcon, {backgroundColor: getCourseColor(item.course)}]}>
          <Text style={styles.courseInitial}>{item.course.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.courseName}>{item.course}</Text>
          <Text style={styles.dueDate}>{item.dueDate}</Text>
        </View>
      </View>
      <Text style={styles.assignmentTitle}>{item.title}</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <View style={styles.priorityBadge}>
          <Text style={styles.priorityText}>{item.priority} Priority</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getCourseColor = (course) => {
    const colors = {
      'Mathematics': '#6C5CE7',
      'English': '#00B894',
      'Physics': '#FD79A8',
    };
    return colors[course] || '#636E72';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#FDCB6E',
      'In Progress': '#74B9FF',
      'Not Started': '#FF7675',
    };
    return colors[status] || '#636E72';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignments</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/icon_filter.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={assignments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  assignmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  courseInitial: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  dueDate: {
    fontSize: 12,
    color: '#636E72',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#DFE6E9',
  },
  priorityText: {
    color: '#636E72',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AssignmentsScreen;