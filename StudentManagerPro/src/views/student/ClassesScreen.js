import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import ScreenWrapper from "../../hooks/ScreenWrapper";

const ClassesScreen = () => {
  const [myClasses, setMyClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [studentId, setStudentId] = useState(null);

  const fetchStudentId = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      setStudentId(res.data.studentId);  
    } catch (err) {
      console.error('Error fetching student info:', err);
    }
  };


  const fetchMyClasses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/students/specific-class');
      setMyClasses(res.data);
      setEnrolledIds(res.data.map(cls => cls.id));
    } catch (err) {
      console.error('Error fetching my classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClasses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/class');
      setAllClasses(res.data);
    } catch (err) {
      console.error('Error fetching all classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId) => {
    if (!studentId) {
      console.error('Student ID not loaded yet.');
      return;
    }

    try {
      await axiosInstance.post(`/enrollment`, {
        student_id: studentId,
        class_id: classId
      });

      setEnrolledIds([...enrolledIds, classId]);

      const enrolledClass = allClasses.find(cls => cls.id === classId);
      if (enrolledClass && !myClasses.some(cls => cls.id === classId)) {
        setMyClasses([...myClasses, enrolledClass]);
      }
    } catch (err) {
      console.error('Error enrolling in class:', err);
    }
  };


  useEffect(() => {
    fetchMyClasses();
    fetchStudentId();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.classCard}>
      <View style={[styles.classColor, { backgroundColor: item.color }]} />
      <View style={styles.classInfo}>
        <Text style={styles.className}>{item.title}</Text>
        <Text style={styles.classTeacher}>{item.teacher_name}</Text>
        <View style={styles.classDetails}>
          <View style={styles.detailItem}>
            <Image source={require('../../assets/icon_time.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.schedule}</Text>
          </View>
          <View style={styles.detailItem}>
            <Image source={require('../../assets/icon_calendar.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.day}</Text>
          </View>
          <View style={styles.detailItem}>
            <Image source={require('../../assets/icon_location.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.room}</Text>
          </View>
        </View>
        {showAllClasses && (
          <TouchableOpacity
            style={[
              styles.enrollButton,
              enrolledIds.includes(item.id) && styles.enrolledButton
            ]}
            disabled={enrolledIds.includes(item.id)}
            onPress={() => handleEnroll(item.id)}
          >
            <Text style={[
              styles.enrollButtonText,
              enrolledIds.includes(item.id) && styles.enrolledButtonText
            ]}>
              {enrolledIds.includes(item.id) ? "Enrolled" : "Enroll"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const currentData = showAllClasses ? allClasses : myClasses;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{showAllClasses ? "All Classes" : "My Classes"}</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, !showAllClasses && styles.activeToggle]}
              onPress={() => setShowAllClasses(false)}
            >
              <Text style={[styles.toggleText, !showAllClasses && styles.activeToggleText]}>My Classes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, showAllClasses && styles.activeToggle]}
              onPress={() => {
                setShowAllClasses(true);
                if (allClasses.length === 0) fetchAllClasses();
              }}
            >
              <Text style={[styles.toggleText, showAllClasses && styles.activeToggleText]}>All Classes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={currentData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text>No classes available.</Text>}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#DFE6E9',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#6C5CE7',
  },
  toggleText: {
    color: '#2D3436',
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#FFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classColor: {
    width: 5,
    height: '100%',
    borderRadius: 5,
    marginRight: 15,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  classTeacher: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 10,
  },
  classDetails: {
    marginTop: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#636E72',
  },
  detailText: {
    fontSize: 12,
    color: '#636E72',
  },
  enrollButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#00B894',
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  enrolledButton: {
    backgroundColor: '#BDC3C7',
  },
  enrolledButtonText: {
    color: '#2D3436',
  },
});

export default ClassesScreen;
