import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';

const ScreenWrapper = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#F8F9FA" 
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: StatusBar.currentHeight,
  },
});

export default ScreenWrapper;