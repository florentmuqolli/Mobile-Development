import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import axiosInstance from "../../services/axiosInstance";
import useLogout from "../../hooks/Logout";
import ScreenWrapper from "../../hooks/ScreenWrapper";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const handleLogout = useLogout(setLoading);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#636E72' }}>User not found.</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={require('../../assets/profile_placeholder.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Student ID</Text>
            <Text style={styles.infoValue}>{user.studentId}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Status</Text>
            <Text style={styles.infoValue}>{user.studentStatus}</Text>
          </View>
        </View>

        <View style={styles.menu}>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ComingSoon')}>
            <Image source={require('../../assets/icon_settings.png')} style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
            <Image source={require('../../assets/icon_arrow_right.png')} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ComingSoon')}>
            <Image source={require('../../assets/icon_help.png')} style={styles.menuIcon} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Image source={require('../../assets/icon_arrow_right.png')} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ComingSoon')}>
            <Image source={require('../../assets/icon_about.png')} style={styles.menuIcon} />
            <Text style={styles.menuText}>About</Text>
            <Image source={require('../../assets/icon_arrow_right.png')} style={styles.arrowIcon} />
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#6C5CE7',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#636E72',
  },
  profileInfo: {
    marginBottom: 30,
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  menu: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: '#636E72',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#636E72',
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

export default ProfileScreen;
