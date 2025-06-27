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
import { LogoutIcon } from '../../assets/Icons';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import useLogout from "../../hooks/Logout";

const TeacherDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('classes');
  const [loading, setLoading] = useState(false);
  const handleLogout = useLogout(setLoading);
  const [stats, setStats] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const logoutTranslateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalStudents: 42,
        activeClasses: 5,
        attendanceRate: '92%'
      });
      setUpcomingClasses([
        { id: '1', name: 'Mathematics 101', time: 'Today, 10:00 AM', room: 'B-204' },
        { id: '2', name: 'Advanced Physics', time: 'Tomorrow, 2:00 PM', room: 'A-103' },
      ]);
      setRecentStudents([
        { id: '1', name: 'Alex Johnson', course: 'Mathematics 101', lastActive: '2 hours ago' },
        { id: '2', name: 'Maria Garcia', course: 'Advanced Physics', lastActive: '1 day ago' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
        >
          {stats && [
            { 
              title: 'Students', 
              value: stats.totalStudents, 
              icon: 'people', 
              color: '#6C5CE7' 
            },
            { 
              title: 'Classes', 
              value: stats.activeClasses, 
              icon: 'class', 
              color: '#00B894' 
            },
            { 
              title: 'Attendance', 
              value: stats.attendanceRate, 
              icon: 'check-circle', 
              color: '#FD79A8' 
            },
          ].map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: stat.color }]}>
              <View style={styles.statIconContainer}>
                <Icon name={stat.icon} size={24} color="#FFF" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
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
  statsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  statCard: {
    width: 140,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
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