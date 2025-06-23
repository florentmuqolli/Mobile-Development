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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import axiosInstance from "../services/axiosInstance"; 

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem("accessToken");
      const role = await AsyncStorage.getItem("role");

      if (token && role === "admin") {
        navigation.replace("Dashboard");
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
          navigation.replace("Dashboard");
        } else if (response.data.user.role === "teacher") {
          navigation.replace("TeacherHome");
        } else {
          navigation.replace("Home");
        }
      }, 1000);
    } catch (error) {
        setLoading(false);
        const message =
          error.response?.data?.message || 
          error.message ||  "Something went wrong";

        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: message,
        });
      }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dc3545" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading || !form.email || !form.password}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}> Sign up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#212529",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#dc3545",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#343a40",
    color: "white",
    padding: 12,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#dc3545",
    padding: 14,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  linkButton: {
    alignSelf: "center",
    marginVertical: 10,
  },
  linkText: {
    color: "#ccc",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#ccc",
  },
  footerLink: {
    color: "#dc3545",
    fontWeight: "700",
  },
  backButton: {
    marginTop: 30,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#ccc",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
