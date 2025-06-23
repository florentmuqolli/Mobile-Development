import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, Text } from 'react-native';
import DashboardScreen from '../views/student/DashboardScreen';
import ClassesScreen from '../views/student/ClassesScreen';
import AssignmentsScreen from '../views/student/AssignmentsScreen';
import CalendarScreen from '../views/student/CalendarScreen';
import ProfileScreen from '../views/student/ProfileScreen';
import { 
  HomeIcon, 
  HomeFilledIcon,
  BookIcon,
  BookFilledIcon,
  AssignmentIcon,
  AssignmentFilledIcon,
  CalendarIcon,
  CalendarFilledIcon,
  ProfileIcon,
  ProfileFilledIcon
} from '../assets/Icons';

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ focused }) => {
            const animatedValue = new Animated.Value(0);
            
            if (focused) {
              Animated.spring(animatedValue, {
                toValue: 1,
                useNativeDriver: true,
              }).start();
            } else {
              animatedValue.setValue(0);
            }
            
            const translateY = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -10],
            });

            let icon;
            let badgeCount = 0;

            switch (route.name) {
              case 'Dashboard':
                icon = focused ? <HomeFilledIcon /> : <HomeIcon />;
                badgeCount = 0;
                break;
              case 'Classes':
                icon = focused ? <BookFilledIcon /> : <BookIcon />;
                badgeCount = 2;
                break;
              case 'Assignments':
                icon = focused ? <AssignmentFilledIcon /> : <AssignmentIcon />;
                badgeCount = 5;
                break;
              case 'Calendar':
                icon = focused ? <CalendarFilledIcon /> : <CalendarIcon />;
                badgeCount = 0;
                break;
              case 'Profile':
                icon = focused ? <ProfileFilledIcon /> : <ProfileIcon />;
                badgeCount = 0;
                break;
            }

            return (
              <Animated.View style={[
                styles.tabButton,
                {
                  transform: [{ translateY }],
                }
              ]}>
                <View style={styles.iconContainer}>
                  {icon}
                  {badgeCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            );
          },
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen 
          name="Classes" 
          component={ClassesScreen} 
          options={{ tabBarLabel: 'Classes' }}
        />
        <Tab.Screen 
          name="Assignments" 
          component={AssignmentsScreen} 
          options={{ tabBarLabel: 'Tasks' }}
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ tabBarLabel: 'Calendar' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderTopWidth: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop: 8, 
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8, 
    color: '#636E72',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: '#FF7675',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default StudentTabNavigator;