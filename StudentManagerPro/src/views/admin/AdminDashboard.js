import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import UserTypeSelectionModal from './UserTypeSelection';
import useLogout from "../../hooks/Logout";

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogout = useLogout(setLoading);

  const stats = [
    { id: '1', title: 'Total Students', value: '1,248', change: '+12%', icon: '👨‍🎓' },
    { id: '2', title: 'Active Courses', value: '24', change: '+3', icon: '📚' },
    { id: '3', title: 'Pending Requests', value: '18', alert: true, icon: '⏳' },
    { id: '4', title: 'Revenue', value: '$8,420', change: '+5.2%', icon: '💰' },
  ];

  const recentActivities = [
    { id: '1', user: 'Alex Johnson', action: 'added new course', time: '2 mins ago', icon: '➕' },
    { id: '2', user: 'Maria Garcia', action: 'updated grades', time: '25 mins ago', icon: '📝' },
    { id: '3', user: 'System', action: 'maintenance scheduled', time: '1 hour ago', icon: '⚙️' },
  ];

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
          <Text style={styles.date}>Monday, June 5, 2023</Text>
        </View>
        <TouchableOpacity>
          <Image 
            source={require('../../assets/profile_placeholder.png')} 
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.statsContainer}
      >
        {stats.map(item => (
          <View key={item.id} style={[
            styles.statCard,
            item.alert && styles.alertCard
          ]}>
            <Text style={styles.statIcon}>{item.icon}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
            {item.change && (
              <View style={styles.changeBadge}>
                <Text style={styles.changeText}>{item.change}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'manage' && styles.activeTab]}
          onPress={() => setActiveTab('manage')}
        >
          <Text style={[styles.tabText, activeTab === 'manage' && styles.activeTabText]}>Manage</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>Reports</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityContainer}>
              {recentActivities.map(item => (
                <View key={item.id} style={styles.activityCard}>
                  <Text style={styles.activityIcon}>{item.icon}</Text>
                  <View style={styles.activityText}>
                    <Text style={styles.activityUser}>{item.user}</Text>
                    <Text style={styles.activityAction}>{item.action}</Text>
                  </View>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.gridContainer}>
              <TouchableOpacity 
                style={styles.gridCard}
                onPress={() => setShowUserModal(true)}
              >
                <View style={[styles.gridIcon, { backgroundColor: '#6C5CE7' }]}>
                  <Text style={styles.gridIconText}>👥</Text>
                </View>
                <Text style={styles.gridText}>Manage Users</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.gridCard}
                onPress={() => navigation.navigate('AddCourse')}
              >
                <View style={[styles.gridIcon, { backgroundColor: '#00B894' }]}>
                  <Text style={styles.gridIconText}>➕</Text>
                </View>
                <Text style={styles.gridText}>Add Course</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.gridCard}
                onPress={() => navigation.navigate('Analytics')}
              >
                <View style={[styles.gridIcon, { backgroundColor: '#FD79A8' }]}>
                  <Text style={styles.gridIconText}>📊</Text>
                </View>
                <Text style={styles.gridText}>Analytics</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.gridCard}
                onPress={() => navigation.navigate('Settings')}
              >
                <View style={[styles.gridIcon, { backgroundColor: '#FDCB6E' }]}>
                  <Text style={styles.gridIconText}>⚙️</Text>
                </View>
                <Text style={styles.gridText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === 'manage' && (
          <View style={styles.manageContainer}>
            <Text style={styles.comingSoon}>Manage Features Coming Soon</Text>
          </View>
        )}

        {activeTab === 'reports' && (
          <View style={styles.manageContainer}>
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
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  date: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statCard: {
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF7675',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#636E72',
  },
  changeBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#DFE6E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  changeText: {
    fontSize: 12,
    color: '#2D3436',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  activityContainer: {
    marginBottom: 25,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  activityText: {
    flex: 1,
  },
  activityUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 3,
  },
  activityAction: {
    fontSize: 14,
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
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gridIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIconText: {
    fontSize: 24,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
  },
  manageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  comingSoon: {
    fontSize: 16,
    color: '#636E72',
  },
  logoutButton: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FF7675',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminDashboard;