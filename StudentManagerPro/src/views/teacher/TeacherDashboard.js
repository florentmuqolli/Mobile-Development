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
  FlatList,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { LogoutIcon, RefreshIcon } from '../../assets/Icons';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import axiosInstance from '../../services/axiosInstance';
import useLogout from "../../hooks/Logout";

const { width } = Dimensions.get('window');

const TeacherDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const handleLogout = useLogout(setLoading);
  const [stats, setStats] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const logoutTranslateX = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: '#5E35B1', 
    secondary: '#3949AB', 
    accent: '#7C4DFF', 
    background: '#F5F7FF', 
    card: '#FFFFFF',
    textPrimary: '#2D3748',
    textSecondary: '#718096',
    success: '#48BB78', 
    warning: '#ED8936', 
    danger: '#F56565', 
  };

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
      const [teacherRes, attendanceRes, classRes] = await Promise.all([
        axiosInstance.get('/teachers/teacher-stats'),
        axiosInstance.get('/attendance/summary/teacher'),
        axiosInstance.get('/class/specific-class'),
      ]);

      const teacherData = teacherRes.data;
      const attendanceCourses = attendanceRes.data;
      const specificClass = classRes.data;

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
          color: colors.success,
        },
        {
          id: '2',
          title: 'Active Courses',
          value: teacherData.courses.total.toString(),
          change: `+${teacherData.courses.new}`,
          icon: '📚',
          color: colors.secondary,
        },
        {
          id: '3',
          title: 'Avg Attendance',
          value: `${averageAttendance}%`,
          icon: '📊',
          color: colors.accent,
        },
      ]);

      const upcoming = specificClass.filter((course) => {
        if (!course.day || !course.schedule) return false;

        const courseDay = course.day.trim().toLowerCase(); 
        const [hourStr, minStr = '00'] = course.schedule.split(':'); 
        const courseTime = parseInt(hourStr) * 60 + parseInt(minStr);

        const now = new Date();
        const daysOfWeek = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
        const todayIndex = now.getDay(); 
        const currentDay = daysOfWeek[todayIndex];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const courseIndex = daysOfWeek.indexOf(courseDay);

        if (courseIndex === -1) return false;

        if (courseIndex > todayIndex) {
          return true;
        } else if (courseIndex === todayIndex && courseTime > currentTime) {
          return true;
        }

        return false;
      });

      setUpcomingClasses(upcoming.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        time: course.schedule,
        day: course.day,
        room: course.room,
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
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <LinearGradient
        colors={[colors.background, '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.textPrimary }]}>Welcome Professor</Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
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
                <TouchableOpacity 
                  style={[styles.logoutButton, { backgroundColor: colors.card }]}
                  onPress={handleLogout}
                >
                  <LogoutIcon color={colors.danger} />
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity onPress={toggleLogout}>
                <Image 
                  source={require('../../assets/profile_placeholder.png')} 
                  style={[styles.profileImage, { borderColor: colors.primary }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statusBar}>
            {elapsedTime && (
              <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
                Last updated {elapsedTime}
              </Text>
            )}
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: colors.primary }]}
              onPress={fetchStats}
            >
              <RefreshIcon color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            {stats ? stats.slice(0, 4).map(item => (
              <LinearGradient
                key={item.id}
                colors={[item.color, `${item.color}CC`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gridCard} 
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statTitle}>{item.title}</Text>
                {item.change && (
                  <View style={styles.changeBadge}>
                    <Text style={styles.changeText}>{item.change}</Text>
                  </View>
                )}
              </LinearGradient>
            )) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </View>

          <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
            {['overview', 'manage', 'students'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && [styles.activeTab, { backgroundColor: colors.primary }]
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[
                  styles.tabText,
                  { color: colors.textSecondary },
                  activeTab === tab && styles.activeTabText
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.content}>
            {activeTab === 'overview' && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Upcoming Classes
                  </Text>
                  <TouchableOpacity>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
                  </TouchableOpacity>
                </View>
                
                {upcomingClasses.map((classItem) => (
                  <TouchableOpacity 
                    key={classItem.id} 
                    style={[styles.classCard, { backgroundColor: colors.card }]}
                    onPress={() => navigation.navigate('ClassDetails', { classId: classItem.id })}
                  >
                    <View style={styles.classInfo}>
                      <Text style={[styles.className, { color: colors.textPrimary }]}>
                        {classItem.title}
                      </Text>
                      <Text style={[styles.classDescription, { color: colors.textSecondary }]}>
                        {classItem.description}
                      </Text>
                      <View style={styles.classMeta}>
                        <Icon name="schedule" size={16} color={colors.accent} />
                        <Text style={[styles.classTime, { color: colors.textSecondary }]}>
                          {classItem.time} • {classItem.day}
                        </Text>
                      </View>
                      <View style={styles.classMeta}>
                        <Icon name="place" size={16} color={colors.accent} />
                        <Text style={[styles.classRoom, { color: colors.textSecondary }]}>
                          Room {classItem.room}
                        </Text>
                      </View>
                    </View>
                    <Icon name="chevron-right" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </>
            )}

            {activeTab === 'manage' && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Quick Actions
                </Text>
                <View style={styles.gridContainer}>
                  {[
                    { 
                      icon: '📚', 
                      text: 'My Courses', 
                      color: colors.secondary, 
                      action: () => navigation.navigate('MyClasses') 
                    },
                    { 
                      icon: '📝', 
                      text: 'Assignments', 
                      color: colors.accent, 
                      action: () => navigation.navigate('AssignmentsScreen') 
                    },
                    { 
                      icon: '📊', 
                      text: 'Grades', 
                      color: '#9C27B0', 
                      action: () => navigation.navigate('EnrollmentManagement') 
                    },
                    { 
                      icon: '👥', 
                      text: 'Students', 
                      color: colors.success, 
                      action: () => setActiveTab('students') 
                    },
                  ].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.gridCard, { backgroundColor: colors.card }]}
                      onPress={item.action}
                    >
                      <LinearGradient
                        colors={[item.color, `${item.color}CC`]}
                        style={[styles.gridIcon, { borderRadius: 16 }]}
                      >
                        <Text style={styles.gridIconText}>{item.icon}</Text>
                      </LinearGradient>
                      <Text style={[styles.gridText, { color: colors.textPrimary }]}>
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {activeTab === 'students' && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Recent Students
                  </Text>
                  <TouchableOpacity>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={recentStudents}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={[styles.studentCard, { backgroundColor: colors.card }]}>
                      <LinearGradient
                        colors={[colors.primary, colors.secondary]}
                        style={styles.studentAvatar}
                      >
                        <Text style={styles.avatarText}>
                          {item.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </LinearGradient>
                      <View style={styles.studentInfo}>
                        <Text style={[styles.studentName, { color: colors.textPrimary }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.studentCourse, { color: colors.textSecondary }]}>
                          {item.course}
                        </Text>
                      </View>
                      <Text style={[styles.lastActive, { color: colors.textSecondary }]}>
                        {item.lastActive}
                      </Text>
                    </View>
                  )}
                  keyExtractor={item => item.id}
                />
              </>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  date: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'sans-serif',
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
    backgroundColor: '#fff',
    zIndex: 2, 
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: 'sans-serif',
  },
  refreshButton: {
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
  },
  gridCard: {
    width: '48%', 
    height: 160, 
    borderRadius: 20,
    padding: 24,
    marginBottom: 16, 
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    color: '#FFF',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statTitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    fontWeight: '500',
    fontFamily: 'sans-serif-medium',
  },
  changeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
  activeTabText: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  seeAll: {
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
  classCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'sans-serif-medium',
  },
  classDescription: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'sans-serif',
  },
  classMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  classTime: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'sans-serif',
  },
  classRoom: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'sans-serif',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  gridIcon: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridIconText: {
    fontSize: 28,
  },
  gridText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  studentCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'sans-serif-medium',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'sans-serif-medium',
  },
  studentCourse: {
    fontSize: 14,
    fontFamily: 'sans-serif',
  },
  lastActive: {
    fontSize: 12,
    fontFamily: 'sans-serif',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TeacherDashboard;