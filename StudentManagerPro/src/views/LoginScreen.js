import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import axiosInstance from "../services/axiosInstance";
import ScreenWrapper from "../hooks/ScreenWrapper";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [queryEmail, setQueryEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem("accessToken");
      const role = await AsyncStorage.getItem("role");

      if (token && role === "admin") {
        navigation.replace("AdminDashboard");
      } else if (token && role === "teacher") {
        navigation.replace("TeacherHome");
      }
    }
    checkToken();
  }, []);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Email and password are required",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", form, {
        withCredentials: true,
      });

      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      await AsyncStorage.setItem("role", response.data.user.role);

      Toast.show({
        type: "success",
        text1: "Logged in",
      });

      setTimeout(() => {
        setLoading(false);
        if (response.data.user.role === "admin") {
          navigation.replace("AdminDashboard");
        } else if (response.data.user.role === "teacher") {
          navigation.replace("StudentHome");
        } else {
          navigation.replace("StudentHome");
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";

      if (status === 403 && message.includes("pending")) {
        Toast.show({
          type: "info",
          text1: "Account Pending",
          text2: message,
        });
      } else if (status === 403 && message.includes("denied")) {
        Toast.show({
          type: "error",
          text1: "Registration Denied",
          text2: message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: message,
        });
      }
    }
  };

  const checkRequestStatus = async () => {
    if (!queryEmail.includes('@')) {
      setStatusMessage('Please enter a valid email');
    return;
    }

    setChecking(true);
    setStatusMessage('');
    try {
      const res = await axiosInstance.get(`/auth/check-request-status?email=${queryEmail}`);
      const { status } = res.data;
        if (status === 'approved') {
          setStatusMessage('✅ Approved — You can now log in.');
        } else if (status === 'pending') {
          setStatusMessage('⏳ Pending — Please wait for admin approval.');
        } else if (status === 'denied') {
          setStatusMessage('❌ Denied — Your registration was denied.');
        } else {
          setStatusMessage('⚠️ Unknown status.');
        }
    } catch (err) {
        setStatusMessage('No registration requests found with this email.');
      } finally {
          setChecking(false);
        }
  }

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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image 
            source={require('../assets/logo2.png')} 
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.subtitle}>Please sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!form.email || !form.password) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={loading || !form.email || !form.password}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={() => setShowStatusModal(true)}>
            <Text style={styles.socialButtonText}>Requested a role recently?</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showStatusModal}
            onRequestClose={() => setShowStatusModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Check Registration Status</Text>
                <TextInput
                  placeholder="Enter your email"
                  style={styles.modalInput}
                  value={queryEmail}
                  onChangeText={setQueryEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={checkRequestStatus}
                >
                  <Text style={styles.modalButtonText}>Check Status</Text>
                </TouchableOpacity>

                {checking ? (
                  <ActivityIndicator style={{ marginTop: 16 }} color="#6C5CE7" />
                ) : (
                  <Text style={styles.modalMessage}>{statusMessage}</Text>
                )}

                <TouchableOpacity
                  onPress={() => {
                    setShowStatusModal(false);
                    setQueryEmail('');
                    setStatusMessage('');
                  }}
                  style={{ marginTop: 20 }}
                >
                  <Text style={{ color: '#6C5CE7', fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  welcomeText: {
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
    width: '100%',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#6C5CE7',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
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
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D3436',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 8,
    width: '100%',
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  modalMessage: {
    marginTop: 16,
    color: '#636E72',
    textAlign: 'center',
    fontSize: 14,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#636E72',
    fontSize: 14,
  },
  footerLink: {
    color: '#6C5CE7',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;