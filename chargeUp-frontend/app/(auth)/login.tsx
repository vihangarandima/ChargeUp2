import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
<<<<<<< Updated upstream
import { Ionicons, FontAwesome } from "@expo/vector-icons";


=======
import { Ionicons, AntDesign } from "@expo/vector-icons";
// Ensure this is installed via: npx expo install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> Stashed changes

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
<<<<<<< Updated upstream
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }

    // UI Prototype Mode: Bypassing the backend logic completely
    Alert.alert("Prototype Mode", "Login simulated successfully!");

    // 🚀 THE FIX: Corrected your navigation routes here!
    // Assuming host-details is in your app folder
    // Sending directly to your tabs folder
    
    // Defaulting to tabs for the prototype - change to "/charger-information" if needed!
    router.replace("/(tabs)" as any); 
=======
    // Navigate to vehicle-details.tsx
    router.push("/vehicle-details");
>>>>>>> Stashed changes
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Gradient using exact palette stops */}
      <LinearGradient
        colors={['#101922', '#15252E', '#193038', '#1D3B42', '#0E4548']}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.logoText}>ChargeUp</Text>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-sport" size={80} color="white" />
            <View style={styles.lightningBadge}>
              <Ionicons name="flash" size={24} color="#101922" />
            </View>
          </View>
          <Text style={styles.heroSubText}>Find, book and pay</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.input}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Login Button directing to vehicle-details.tsx */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity><AntDesign name="apple1" size={32} color="white" /></TouchableOpacity>
            <TouchableOpacity><AntDesign name="google" size={32} color="#EA4335" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.signupRow}>
            <Text style={styles.footerText}>Don't have an Account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.signupLink}>Singup</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.termsText}>
            By continuing, you are agree to our <Text style={styles.link}>Terms and conditions</Text> and <Text style={styles.link}>Privacy Policy.</Text>
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  container: { flex: 1, backgroundColor: "#0B1D21" },
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
=======
  container: { flex: 1 },
  innerContainer: { flex: 1, paddingHorizontal: 30 },
  header: { marginTop: 20 },
  logoText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  heroSection: { alignItems: 'center', marginTop: 40 },
  iconContainer: { width: 120, height: 80, justifyContent: 'center', alignItems: 'center' },
  lightningBadge: { position: 'absolute', backgroundColor: 'white', borderRadius: 15, padding: 2, bottom: 25 },
  heroSubText: { color: 'white', fontSize: 18, marginTop: 15 },
  formSection: { marginTop: 60 },
  inputWrapper: { borderBottomWidth: 1, borderBottomColor: 'white', marginBottom: 30, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, color: 'white', paddingVertical: 10, fontSize: 16 },
  loginButton: { borderWidth: 1, borderColor: 'white', borderRadius: 25, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: '500' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  line: { height: 1, backgroundColor: 'rgba(255,255,255,0.5)', flex: 1 },
  orText: { color: 'white', paddingHorizontal: 10 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
  footer: { marginTop: 'auto', marginBottom: 20, alignItems: 'center' },
  signupRow: { flexDirection: 'row', marginBottom: 20 },
  footerText: { color: 'white' },
  signupLink: { color: '#4DA6FF', fontWeight: 'bold' },
  termsText: { color: 'white', fontSize: 11, textAlign: 'center' },
  link: { color: '#76C7C0', textDecorationLine: 'underline' }
>>>>>>> Stashed changes
});