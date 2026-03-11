import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. Import the Gradient component
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }

    try {
      const role = await AsyncStorage.getItem("userRole");
      if (role === "client") {
        router.replace("/home");
      } else if (role === "host") {
        router.replace("/(tab)/map-station-finder");
      } else {
        router.replace("/(tab)/charger-booking");
      }
    } catch (error) {
      console.error("Memory error:", error);
      router.replace("/welcome");
    }
  };

  const handleGoogleLogin = () => Alert.alert("Google Login", "Prototype Mode...");
  const handleAppleLogin = () => Alert.alert("Apple Login", "Coming soon!");

  return (
    // 2. Use LinearGradient as the background wrapper
    <LinearGradient
      // Your exact colors from the screenshot
      colors={['#101922', '#15252E', '#193038', '#1D3B42', '#0E4548']}
      // Your exact percentage stops converted to 0-1 scale
      locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.inner}>
          <Text style={styles.brandTitle}>ChargeUp</Text>

          <View style={styles.brandCenter}>
            <Ionicons name="flash" size={80} color="white" />
            <Text style={styles.brandTagline}>Find, book and pay</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#999"
              style={styles.underlineInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                style={[styles.underlineInput, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="white"
                />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.pillButton} onPress={handleLogin}>
            <Text style={styles.pillButtonText}>Login</Text>
          </Pressable>

          <Text style={styles.orText}>or</Text>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.loginWithText}>Login with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <Pressable onPress={handleAppleLogin}>
              <FontAwesome name="apple" size={40} color="white" />
            </Pressable>

            <TouchableOpacity onPress={handleGoogleLogin}>
              <Text style={{ color: "white", fontSize: 16 }}>
                Login with Google
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.noAccountText}>Don't have an Account? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.signupLink}>Signup</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Removed the solid background color here
  container: { flex: 1 },
  inner: { paddingHorizontal: 30, flex: 1, alignItems: "center" },
  brandTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  brandCenter: { alignItems: "center", marginVertical: 40 },
  brandTagline: { color: "white", fontSize: 16, marginTop: 10 },
  inputContainer: { width: "100%", marginBottom: 30 },
  underlineInput: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    color: "white",
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  pillButton: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 60,
  },
  pillButtonText: { color: "white", fontSize: 18 },
  orText: { color: "white", marginVertical: 10 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 15,
  },
  line: { flex: 1, height: 1, backgroundColor: "white", opacity: 0.3 },
  loginWithText: { color: "white", marginHorizontal: 10 },
  socialRow: {
    flexDirection: "row",
    gap: 50,
    marginVertical: 20,
    alignItems: "center",
  },
  signupRow: { flexDirection: "row", marginTop: 20 },
  noAccountText: { color: "white" },
  signupLink: { color: "#83B4BB", fontWeight: "bold" },
});