import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/LoginScreen';
import RegisterScreen from '../views/RegisterScreen';
import StudentTabNavigator from './StudentTabNavigator';
import AdminDashboard from '../views/admin/AdminDashboard';
import StudentManagementScreen from '../views/admin/StudentManagement';
import TeacherManagementScreen from '../views/admin/TeacherManagement';
import EnrollmentManagementScreen from '../views/admin/EnrollmentManagement';
import AddCourseScreen from '../views/admin/CourseManagement';
import ForgotPasswordScreen from '../hooks/ForgotPassword';
import AdminPendingRequestsScreen from '../views/admin/utils/PendingRequestsScreen';
import TeacherDashboard from '../views/teacher/TeacherDashboard';
import HomeScreen from '../views/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentDashboard" component={StudentTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="StudentManagement" component={StudentManagementScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherManagement" component={TeacherManagementScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CourseManagement" component={AddCourseScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EnrollmentManagement" component={EnrollmentManagementScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PendingRequests" component={AdminPendingRequestsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
