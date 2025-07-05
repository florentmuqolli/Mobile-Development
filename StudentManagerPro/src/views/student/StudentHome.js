import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { RefreshIcon } from '../../assets/Icons';
import ScreenWrapper from '../../hooks/ScreenWrapper';

const DashboardScreen = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [showLogout, setShowLogout] = useState(false);

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

    const fetchName = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setLoading(false);
        setName(res.data.name);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to load name:', error);
      }
    };

    useEffect(() => {
        fetchName();
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {name}</Text>
          <Text style={styles.subtitle}>Let's start learning</Text>
        </View>
        <Image 
          source={require('../../assets/profile_placeholder.png')} 
          style={styles.profileImage}
        />
      </View>

      <View style={styles.statusBar}>
        {elapsedTime && (
          <Text style={styles.lastUpdated}>Last updated {elapsedTime}</Text>
        )}
        <TouchableOpacity style={styles.refreshButton} 
          onPress={() => {
            fetchName();
          }}>
          <RefreshIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Classes</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={[styles.classCard, {backgroundColor: '#6C5CE7'}]}>
          <Text style={styles.classTime}>10:00 - 11:30</Text>
          <Text style={styles.className}>Mathematics</Text>
          <Text style={styles.classRoom}>Room 203</Text>
        </View>
        <View style={[styles.classCard, {backgroundColor: '#00B894'}]}>
          <Text style={styles.classTime}>13:00 - 14:30</Text>
          <Text style={styles.className}>Physics</Text>
          <Text style={styles.classRoom}>Room 105</Text>
        </View>
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.assignmentCard}>
        <View style={styles.assignmentInfo}>
          <View style={[styles.assignmentIcon, {backgroundColor: '#FD79A8'}]}>
            <Text style={styles.iconText}>M</Text>
          </View>
          <View>
            <Text style={styles.assignmentTitle}>Math Homework #2</Text>
            <Text style={styles.assignmentDue}>Due Tomorrow</Text>
          </View>
        </View>
        <View style={styles.assignmentStatus}>
          <Text style={styles.statusText}>Pending</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Image source={require('../../assets/icon_calendar.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>Grades</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Image source={require('../../assets/icon_assignments.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>Assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Image source={require('../../assets/icon_grades.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>Grades</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
  },
  seeAll: {
    color: '#6C5CE7',
    fontSize: 14,
  },
  horizontalScroll: {
    marginBottom: 25,
  },
  classCard: {
    width: 160,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 5,
  },
  className: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classRoom: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  assignmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assignmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  assignmentDue: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 3,
  },
  assignmentStatus: {
    backgroundColor: '#FFEAA7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    color: '#FDCB6E',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#2D3436',
    fontWeight: '500',
  },
});

export default DashboardScreen;