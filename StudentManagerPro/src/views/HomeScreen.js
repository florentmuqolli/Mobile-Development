import React, { useState } from "react";
import { View, Text, StyleSheet,ActivityIndicator, Button } from 'react-native';
import useLogout from "../hooks/Logout";

const HomeScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const handleLogout = useLogout(setLoading);

    if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dc3545" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 StudentManagerPro</Text>
      <Text style={styles.subtitle}>Welcome to your dashboard</Text>

      <View style={styles.buttonContainer}>
        <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
        <Button title="Logout" color="#d9534f" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30
  },
  buttonContainer: {
    width: '100%',
    gap: 15
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    alignItems: "center",
  },
});
