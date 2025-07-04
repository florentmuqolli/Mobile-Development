import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, BackArrowIcon} from '../../assets/Icons';

const MyClasses = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
        const res = await axiosInstance.get('/class/specific-class');
        const coursesWithCounts = await Promise.all(
        res.data.map(async (course) => {
            try {
            const countRes = await axiosInstance.get(`/enrollment/total`);
            return {
                ...course,
                totalStudents: countRes.data.totalStudents,
            };
            } catch (err) {
            console.error(`Error fetching student count for class ${course.id}:`, err);
            return { ...course, totalStudents: 0 };
            }
        })
        );
        setCourses(coursesWithCounts);
    } catch (err) {
        console.error('Error fetching courses:', err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Text style={styles.title}>My Courses</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.actionBar}>
          <View style={styles.searchContainer}>
            <SearchIcon/>
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <ScrollView style={styles.cardContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 40 }} />
          ) : (
            filteredCourses.map((course) => (
              <View key={course.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>Title: {course.title}</Text>
                  <Text style={styles.cardName}>ID: {course.id}</Text>
                  <View style={[
                    styles.statusBadge,
                    course.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
                  ]}>
                    <Text style={styles.statusText}>{course.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardEmail}>Description: {course.description}</Text>
                <Text style={styles.cardEmail}>Schedule: {course.schedule}</Text>
                <Text style={styles.cardEmail}>Day: {course.day}</Text>
                <Text style={styles.cardEmail}>Room: {course.room}</Text>
                <Text style={styles.cardEmail}>Total Students: {course.totalStudents}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
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

export default MyClasses;