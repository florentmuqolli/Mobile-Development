import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import axiosInstance from '../services/axiosInstance';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [passwordResetModalVisible, setPasswordResetModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter your email' });
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      setLoading(false);
      Toast.show({ type: 'success', text1: response.data.message || 'Reset code sent to your email' });
      setVerificationModalVisible(true);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      Toast.show({ type: 'error', text1: 'Failed to send reset code', text2: message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter the 6-digit code' });
      return;
    }

    setVerificationLoading(true);

    try {
      const response = await axiosInstance.post('/auth/verify-reset-code', {
        email,
        code,
      });

      Toast.show({ type: 'success', text1: response.data.message || 'Code verified successfully' });
      setVerificationModalVisible(false);
      setPasswordResetModalVisible(true);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to verify code';
      Toast.show({ type: 'error', text1: 'Verification failed', text2: message });
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter and confirm your new password' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: 'error', text1: 'Password should be at least 6 characters' });
      return;
    }

    setResetLoading(true);

    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        email,
        code,
        password: newPassword,
      });

      Toast.show({ type: 'success', text1: response.data.message || 'Password updated successfully' });
      setPasswordResetModalVisible(false);
      navigation.navigate('Login');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password';
      Toast.show({ type: 'error', text1: 'Reset failed', text2: message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('Login');
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={() => setVerificationModalVisible(false)}
        >
          <Text style={styles.goBackText}>
            <Text onPress={handleNavigate}>Go Back</Text>
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.instructions}>
          Enter your email address below and we'll send you a 6-digit code to reset your password.
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#A0A0A0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Code</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={verificationModalVisible}
        onRequestClose={() => setVerificationModalVisible(false)}
      >
        <View style={[styles.blurContainer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Your Code</Text>
            <Text style={styles.modalSubtitle}>
              Please enter the 6-digit code sent to your email
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
            
            <TouchableOpacity
              style={[styles.button, verificationLoading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={verificationLoading}
            >
              {verificationLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setVerificationModalVisible(false)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={passwordResetModalVisible}
        onRequestClose={() => setPasswordResetModalVisible(false)}
      >
        <View style={[styles.blurContainer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set New Password</Text>
            <Text style={styles.modalSubtitle}>
              Please enter and confirm your new password
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <TouchableOpacity
              style={[styles.button, resetLoading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={resetLoading}
            >
              {resetLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setPasswordResetModalVisible(false)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
  },
  content: {
    padding: 30,
    margin: 20,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    paddingTop: 25,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#6C5CE7',
  },
  instructions: {
    fontSize: 15,
    color: '#636E72',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#2D3436',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#A29BFE',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#6C5CE7',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryButton: {
    padding: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6C5CE7',
    fontWeight: '600',
    fontSize: 15,
  },
  goBackButton: {
  position: 'absolute',
  top: 10,
  left: 10,
  zIndex: 1,
  flexDirection: 'row',
  alignItems: 'center',
},
goBackText: {
  color: '#6C5CE7',
  fontSize: 16,
  fontWeight: '600',
  marginLeft: 4,
},
});

export default ForgotPasswordScreen;