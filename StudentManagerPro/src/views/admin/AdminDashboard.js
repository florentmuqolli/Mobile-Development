import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../services/axiosInstance';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import UserTypeSelectionModal from './utils/UserTypeSelection';
import useLogout from "../../hooks/Logout";
import { RefreshIcon, LogoutIcon } from '../../assets/Icons';


const AdminDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogout = useLogout(setLoading);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const logoutTranslateY = useRef(new Animated.Value(0)).current;


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
      Animated.timing(logoutTranslateY, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowLogout(false));
    } else {
      setShowLogout(true);
      Animated.timing(logoutTranslateY, {
        toValue: -60, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const fetchRecentActivities = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/recent-activities');
      console.log('Activities response:', res.data);
      setActivities(res.data); 
      setLoading(false);
    } catch (error) {
      console.error('Failed to load recent activities:', error);
      setLoading(false);
    }
  };


  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/dashboard-stats');
      const data = res.data;
      setStats([
        {
          id: '1',
          title: 'Total Students',
          value: data.students.total.toString(),
          change: `+${data.students.new}`,
          icon: '👨‍🎓',
        },
        {
          id: '2',
          title: 'Active Courses',
          value: data.courses.total.toString(),
          change: `+${data.courses.new}`,
          icon: '📚',
        },
        {
          id: '3',
          title: 'Total Professors',
          value: data.professors.total.toString(),
          change: `+${data.professors.new}`,
          icon: '👨‍🏫',
          alert: data.professors.new === 0,
        },
      ]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(); 
    fetchRecentActivities();
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
            <Text style={styles.greeting}>Welcome Admin</Text>
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
                transform: [{ translateY: logoutTranslateY }],
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
            fetchRecentActivities();
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
          {['overview', 'manage', 'reports'].map((tab) => (
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
          {activeTab === 'overview' && (
            <>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityContainer}>
                {activities.map(item => (
                  <View key={item.id} style={styles.activityCard}>
                    <View style={styles.activityIconContainer}>
                      <Text style={styles.activityIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.activityText}>
                      <Text style={styles.activityUser}>{item.user}</Text>
                      <Text style={styles.activityAction}>{item.action}</Text>
                    </View>
                    <Text style={styles.activityTime}>
                      {new Date(item.created_at).toLocaleTimeString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {activeTab === 'manage' && (
            <>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.gridContainer}>
                  {[
                    { icon: '👥', text: 'Manage Users', color: '#6C5CE7', action: () => setShowUserModal(true) },
                    { icon: '➕', text: 'Add Course', color: '#00B894', action: () => navigation.navigate('CourseManagement') },
                    { icon: '📊', text: 'Analytics', color: '#FD79A8', action: () => navigation.navigate('Analytics') },
                    { icon: '⚙️', text: 'Settings', color: '#FDCB6E', action: () => navigation.navigate('Settings') },
                  ].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.gridCard}
                      onPress={item.action}
                    >
                      <View style={[styles.gridIcon, { backgroundColor: item.color }]}>
                        <Text style={styles.gridIconText}>{item.icon}</Text>
                      </View>
                      <Text style={styles.gridText}>{item.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
          )}

          {activeTab === 'reports' && (
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoon}>Reporting Tools Coming Soon</Text>
            </View>
          )}
        </ScrollView>

        <UserTypeSelectionModal 
          visible={showUserModal}
          onClose={() => setShowUserModal(false)}
          navigation={navigation}
        />
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
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
  logoutContainer: {
    position: 'absolute',
    bottom: 2,
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
    zIndex: 2, 
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 16,
  },
  activityContainer: {
    marginBottom: 28,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityIcon: {
    fontSize: 18,
  },
  activityText: {
    flex: 1,
  },
  activityUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  activityAction: {
    fontSize: 13,
    color: '#636E72',
  },
  activityTime: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  gridIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridIconText: {
    fontSize: 28,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
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
});

export default AdminDashboard;