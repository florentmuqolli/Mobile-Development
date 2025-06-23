import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/styles/toastConfig';
import { StatusBar } from 'react-native';

const App = () => {
  const statusBarHeight = StatusBar.currentHeight ?? 0;
  return (
    <>
      <AppNavigator />
      <Toast 
        config={toastConfig}
        position="top"
        topOffset={statusBarHeight  + 10}
        visibilityTime={3000}
        autoHide={true}
      />
    </>
  );
};

export default App;
