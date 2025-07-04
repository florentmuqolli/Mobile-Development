import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackArrowIcon } from '../assets/Icons';
import ScreenWrapper from "../hooks/ScreenWrapper";

const ComingSoonScreen = () => {
    const navigation = useNavigation();

  return (
    <ScreenWrapper>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon/>
        </TouchableOpacity>
      <View style={styles.container}>
        <Image 
          source={require('../assets/icon_construction.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Coming Soon!</Text>
        <Text style={styles.subtitle}>We're working hard to bring you this feature</Text>
        <Text style={styles.text}>Stay tuned for updates</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    tintColor: '#6C5CE7', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#636E72',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ComingSoonScreen;