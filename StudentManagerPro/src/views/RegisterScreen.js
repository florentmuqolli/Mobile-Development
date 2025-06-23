import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from "react-native-toast-message";
import axiosInstance from '../services/axiosInstance'; 
import { useNavigation } from '@react-navigation/native';

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
        text1: "Registered",
       }); 
       setTimeout(() => {
        navigation.navigate('Login');
      }, 1000);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#141414' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Join Our Community</Text>
          <Text style={styles.subHeader}>Create your account</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#aaa"
              value={form.name}
              onChangeText={text => handleChange('name', text)}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="your@email.com"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={text => handleChange('email', text)}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={form.password}
              onChangeText={text => handleChange('password', text)}
              style={styles.input}
            />
            <Text style={styles.helperText}>At least 6 characters</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By registering, you agree to our Terms and Privacy Policy
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>
              Already have an account? <Text style={{ color: '#dc3545' }}>Sign in</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#dc3545',
    marginBottom: 5,
  },
  subHeader: {
    color: '#ccc',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#ddd',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  helperText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 3,
  },
  button: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  terms: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
  signInLink: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default RegisterScreen;
