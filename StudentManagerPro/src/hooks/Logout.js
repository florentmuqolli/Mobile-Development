import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../services/axiosInstance";
import Toast from "react-native-toast-message";

const useLogout = (setLoading) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout", null, {
        withCredentials: true,
      });

      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("role");

      Toast.show({
        type: "success",
        text1: "Logged out",
      });

      setTimeout(() => {
        setLoading(false);
        navigation.replace("Login");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: error.response?.data?.message || "Try again later",
      });
      setLoading(false);
    }
  };

  return handleLogout;
};

export default useLogout;
