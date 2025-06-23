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
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';
import Toast from "react-native-toast-message";
import axiosInstance from '../services/axiosInstance'; 
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../hooks/ScreenWrapper';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

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
      await axiosInstance.post('/auth/register', form, { withCredentials: true });

      Toast.show({
        type: "success",
        text1: "Registered successfully!",
        text2: "You can now sign in with your credentials.",
      });
      
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
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

            <TouchableOpacity
              style={[
                styles.registerButton,
                (form.password.length < 6 || form.name.length < 3 || !form.email.includes('@')) && 
                styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={loading || form.password.length < 6 || form.name.length < 3 || !form.email.includes('@')}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

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
});

export default RegisterScreen;