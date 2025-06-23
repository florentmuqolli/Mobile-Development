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
          tabBarShowLabel: false,
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
            
            const scale = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            });

            const translateY = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -15],
            });

            let icon;
            let label;
            let badgeCount = 0;

            switch (route.name) {
              case 'Dashboard':
                icon = focused ? <HomeFilledIcon /> : <HomeIcon />;
                label = 'Home';
                break;
              case 'Classes':
                icon = focused ? <BookFilledIcon /> : <BookIcon />;
                label = 'Classes';
                badgeCount = 2; 
                break;
              case 'Assignments':
                icon = focused ? <AssignmentFilledIcon /> : <AssignmentIcon />;
                label = 'Tasks';
                badgeCount = 5; 
                break;
              case 'Calendar':
                icon = focused ? <CalendarFilledIcon /> : <CalendarIcon />;
                label = 'Calendar';
                break;
              case 'Profile':
                icon = focused ? <ProfileFilledIcon /> : <ProfileIcon />;
                label = 'Profile';
                break;
            }

            return (
              <Animated.View style={[
                styles.tabButton,
                {
                  transform: [{ scale }, { translateY }],
                }
              ]}>
                <View style={styles.iconContainer}>
                  {icon}
                  {badgeCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{badgeCount}</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.tabLabel,
                  focused && styles.tabLabelFocused
                ]}>
                  {label}
                </Text>
              </Animated.View>
            );
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Classes" component={ClassesScreen} />
        <Tab.Screen name="Assignments" component={AssignmentsScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
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
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#636E72',
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: '#FF7675',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6C5CE7',
    marginTop: 4,
  },
});

export default StudentTabNavigator;