import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Animated,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LogoutIcon, RefreshIcon } from '../../assets/Icons';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import axiosInstance from '../../services/axiosInstance';
import useLogout from "../../hooks/Logout";

const TeacherDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('classes');
  const [loading, setLoading] = useState(false);
  const handleLogout = useLogout(setLoading);
  const [stats, setStats] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const logoutTranslateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
      if (!lastUpdated) return;
  
      const interval = setInterval(() => {
        const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
        if (secondsAgo < 60) {
          setElapsedTime(`${secondsAgo}s ago`);
        } else {
          const minutes = Math.floor(secondsAgo / 60);
          setElapsedTime(`${minutes}m ago`);
        }
      }, 1000); 
  
      return () => clearInterval(interval); 
    }, [lastUpdated]);

  const toggleLogout = () => {
    if (showLogout) {
      Animated.timing(logoutTranslateX, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowLogout(false));
    } else {
      setShowLogout(true);
      Animated.timing(logoutTranslateX, {
        toValue: -60, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [teacherRes, attendanceRes] = await Promise.all([
        axiosInstance.get('/teachers/teacher-stats'),
        axiosInstance.get('/attendance/summary/teacher'),
      ]);

      const teacherData = teacherRes.data;
      const attendanceCourses = attendanceRes.data;

      const averageAttendance =
        attendanceCourses.length > 0
          ? Math.round(attendanceCourses.reduce((acc, curr) => acc + curr.average_attendance_rate, 0) / attendanceCourses.length)
          : 0;

      setStats([
        {
          id: '1',
          title: 'Total Students',
          value: teacherData.students.total.toString(),
          change: `+${teacherData.students.new}`,
          icon: '👨‍🎓',
          color: '#6C5CE7',
        },
        {
          id: '2',
          title: 'Active Courses',
          value: teacherData.courses.total.toString(),
          change: `+${teacherData.courses.new}`,
          icon: '📚',
          color: '#00B894',
        },
        {
          id: '3',
          title: 'Avg Attendance',
          value: `${averageAttendance}%`,
          icon: '📊',
          color: '#0984E3',
        },
      ]);

      setUpcomingClasses(attendanceCourses.map(course => ({
        id: course.class_id,
        name: course.class_name,
        time: 'Custom Time',
        room: 'Room N/A',
        attendanceRate: course.average_attendance_rate,
      })));

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch teacher stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchStats();
  setRecentStudents([
    { id: '1', name: 'Alex Johnson', course: 'Mathematics 101', lastActive: '2 hours ago' },
    { id: '2', name: 'Maria Garcia', course: 'Advanced Physics', lastActive: '1 day ago' },
  ]);
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
          <View>
            <Text style={styles.greeting}>Welcome Professor</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric',
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Animated.View
              pointerEvents={showLogout ? 'auto' : 'none'}
              style={[
                styles.logoutContainer,
                {
                  transform: [{ translateX: logoutTranslateX }],
                  opacity: showLogout ? 1 : 0,
                  zIndex: 0,
                },
               ]}
            >
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogoutIcon />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={toggleLogout}>
              <Image 
                source={require('../../assets/profile_placeholder.png')} 
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusBar}>
          {elapsedTime && (
            <Text style={styles.lastUpdated}>Last updated {elapsedTime}</Text>
          )}
          <TouchableOpacity style={styles.refreshButton} onPress={() => {
            fetchStats();
            //fetchRecentActivities();
          }}>
            <RefreshIcon />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScrollContainer}
        >
        {stats ? stats.map(item => (
          <View key={item.id} style={[
            styles.statCard,
            { backgroundColor: item.color + '20' },
            item.alert && styles.alertCard
          ]}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
            {item.change && (
              <View style={[
                styles.changeBadge,
                { backgroundColor: item.color + '40' } 
              ]}>
                <Text style={styles.changeText}>{item.change}</Text>
              </View>
            )}
          </View>
        )) : (
          <ActivityIndicator size="small" color="#6C5CE7" />
        )}
      </ScrollView>

        <View style={styles.tabContainer}>
          {['classes', 'students', 'resources'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.content}>
          {activeTab === 'classes' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Classes</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {upcomingClasses.map((classItem) => (
                <TouchableOpacity 
                  key={classItem.id} 
                  style={styles.classCard}
                  onPress={() => navigation.navigate('ClassDetails', { classId: classItem.id })}
                >
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{classItem.name}</Text>
                    <View style={styles.classMeta}>
                      <Icon name="schedule" size={16} color="#636E72" />
                      <Text style={styles.classTime}>{classItem.time}</Text>
                    </View>
                    <View style={styles.classMeta}>
                      <Icon name="place" size={16} color="#636E72" />
                      <Text style={styles.classRoom}>{classItem.room}</Text>
                      <View style={styles.attendanceRow}>
                        <Icon name="bar-chart" size={16} color="#636E72" />
                        <Text style={styles.attendanceText}>
                          Attendance Rate: {classItem.attendanceRate}%
                        </Text>
                      </View>

                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color="#B2BEC3" />
                </TouchableOpacity>
              ))}

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <View style={[styles.actionIcon, { backgroundColor: '#6C5CE7' }]}>
                    <Icon name="add" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.actionText}>New Lesson</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <View style={[styles.actionIcon, { backgroundColor: '#00B894' }]}>
                    <Icon name="assignment" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.actionText}>Create Assignment</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {activeTab === 'students' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Students</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={recentStudents}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.studentCard}>
                    <View style={styles.studentAvatar}>
                      <Text style={styles.avatarText}>
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{item.name}</Text>
                      <Text style={styles.studentCourse}>{item.course}</Text>
                    </View>
                    <Text style={styles.lastActive}>{item.lastActive}</Text>
                  </View>
                )}
                keyExtractor={item => item.id}
              />
            </>
          )}

          {activeTab === 'resources' && (
            <View style={styles.comingSoonContainer}>
              <Icon name="folder" size={48} color="#DFE6E9" />
              <Text style={styles.comingSoon}>Resources Hub Coming Soon</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
  },
  date: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 4,
    right: 3,
    zIndex: 1,
  },
  logoutButton: {
    backgroundColor: '#FFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#6C5CE7',
    backgroundColor: '#fff',
    zIndex: 2, 
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    marginBottom: 16,
  },
  lastUpdated: {
    color: '#636E72',
    fontSize: 12,
  },
  refreshButton: {
    backgroundColor: '#6C5CE7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statsScrollContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  statCard: {
    width: 150,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    backgroundColor: '#6C5CE7',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
    color: '#FFF',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    fontWeight: '500',
  },
  changeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF7675',
  },
  changeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636E72',
  },
  activeTabText: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  seeAll: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  classMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  classTime: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 8,
  },
  classRoom: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 8,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  attendanceText: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 8,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '600',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  studentCourse: {
    fontSize: 14,
    color: '#636E72',
  },
  lastActive: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  comingSoon: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});

export default TeacherDashboard;