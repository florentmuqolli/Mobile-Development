import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const toastConfig = {
  success: (props) => {
    const { text1, text2 } = props;
    return (
      <View style={[styles.toastContainer, styles.successToast]}>
        {text1 ? <Text style={styles.toastText1}>{text1}</Text> : null}
        {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
      </View>
    );
  },
  error: (props) => {
    const { text1, text2 } = props;
    return (
      <View style={[styles.toastContainer, styles.errorToast]}>
        {text1 ? <Text style={styles.toastText1}>{text1}</Text> : null}
        {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
      </View>
    );
  },
  info: (props) => {
    const { text1, text2 } = props;
    return (
      <View style={[styles.toastContainer, styles.infoToast]}>
        {text1 ? <Text style={styles.toastText1}>{text1}</Text> : null}
        {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
      </View>
    );
  },
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 10,
  },
  successToast: {
    backgroundColor: '#00B894',
    borderLeftWidth: 5,
    borderLeftColor: '#55EFC4',
  },
  errorToast: {
    backgroundColor: '#FF7675',
    borderLeftWidth: 5,
    borderLeftColor: '#FD79A8',
  },
  infoToast: {
    backgroundColor: '#6C5CE7',
    borderLeftWidth: 5,
    borderLeftColor: '#A29BFE',
  },
  toastText1: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  toastText2: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});
