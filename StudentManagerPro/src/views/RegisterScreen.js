import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  ScrollView,
  Modal
} from 'react-native';
import Toast from "react-native-toast-message";
import axiosInstance from '../services/axiosInstance'; 
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../hooks/ScreenWrapper';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'student' 
  });
  const [loading, setLoading] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (form.name.length < 3) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please provide your full name (at least 3 characters).",
      });
      return;
    }
    if (!form.email.includes('@')) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please provide a valid email.",
      });
      return;
    }
    if (form.password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/request-register', form);
      console.log("Success");
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Applied Successfully",
      });
      setShowApprovalModal(true);
      startCountdown();
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (countdown === 0 && showApprovalModal) {
      navigation.navigate('Login');
    }
  }, [countdown, showApprovalModal]);


  const handleLoginNow = () => {
    setShowApprovalModal(false);
    setCountdown(0); 
    navigation.navigate('Login');
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo}
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community today</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="John Doe"
                placeholderTextColor="#999"
                value={form.name}
                onChangeText={text => handleChange('name', text)}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={text => handleChange('email', text)}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry
                value={form.password}
                onChangeText={text => handleChange('password', text)}
                style={styles.input}
              />
              <Text style={styles.helperText}>Must be at least 6 characters</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>I am a</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      form.role === 'student' && styles.roleButtonActive
                    ]}
                    onPress={() => handleChange('role', 'student')}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      form.role === 'student' && styles.roleButtonTextActive
                    ]}>
                      Student
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      form.role === 'teacher' && styles.roleButtonActive
                    ]}
                    onPress={() => handleChange('role', 'teacher')}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      form.role === 'teacher' && styles.roleButtonTextActive
                    ]}>
                      Teacher
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            <TouchableOpacity
              onPress={() => {
                if (!loading) handleSubmit();
              }}
              style={[
                styles.registerButton,
                (form.password.length < 6 || form.name.length < 3 || !form.email.includes('@')) && 
                styles.disabledButton
              ]}
              disabled={loading || form.password.length < 6 || form.name.length < 3 || !form.email.includes('@')}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={showApprovalModal}
                onRequestClose={() => setShowApprovalModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>
                        {form.role === 'teacher' ? 'Teacher' : 'Student'} Account Pending Approval
                      </Text>
                      <Text style={styles.modalText}>
                        Your {form.role} account will be ready to use in {countdown} seconds after admin approval.
                      </Text>
                      <View style={styles.modalFooter}>
                        <Text style={styles.modalFooterText}>
                          Go to login now?
                        </Text>
                        <TouchableOpacity 
                          style={styles.modalButton}
                          onPress={handleLoginNow}
                        >
                          <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>

            <Text style={styles.termsText}>
              By registering, you agree to our{' '}
              <Text style={styles.linkText}>Terms</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Image 
                source={require('../assets/google-icon.png')} 
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3436',
  },
  helperText: {
    color: '#636E72',
    fontSize: 12,
    marginTop: 8,
  },
  registerButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    color: '#636E72',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  linkText: {
    color: '#6C5CE7',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DFE6E9',
  },
  dividerText: {
    color: '#636E72',
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#2D3436',
    fontSize: 16,
    fontWeight: '500',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#636E72',
    fontSize: 14,
  },
  loginLink: {
    color: '#6C5CE7',
    fontSize: 14,
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  roleButtonActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  roleButtonText: {
    color: '#636E72',
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: '#FFF',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  modalFooterText: {
    color: '#636E72',
    marginRight: 12,
  },
  modalButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default RegisterScreen;