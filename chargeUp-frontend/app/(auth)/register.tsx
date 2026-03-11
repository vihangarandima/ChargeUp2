import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
<<<<<<< Updated upstream
=======
import { SafeAreaView } from "react-native-safe-area-context";
// Import LinearGradient for the background pattern
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
>>>>>>> Stashed changes

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Info", "Please fill in all fields to sign up.");
      return;
    }

<<<<<<< Updated upstream
    // ⚠️ CRITICAL: Replace '192.168.1.55' with YOUR computer's actual IPv4 address!
    // (Backend fetch code temporarily removed for Version 1 UI prototype)

    // Prototype Mode: Fake a successful server response!
    Alert.alert("Prototype Mode", "Account creation simulated! 🚀");

    // Success! The database saved the user.
    // NOW we push them to the next screen!
    router.push("/(auth)/vehicle-details");
    
    // Database rejected it (maybe email already exists)
    // (Handled by backend later)
=======
    Alert.alert("Welcome!", "Account created successfully.");

    try {
      const role = await AsyncStorage.getItem("userRole");
      if (role === "host") {
        router.replace("/host-charger-details");
      } else {
        router.replace("/vehicle-details");
      }
    } catch (error) {
      console.error("Memory error:", error);
      router.replace("/vehicle-details");
    }
>>>>>>> Stashed changes
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Added LinearGradient with exact hex codes and stops from your screenshots */}
      <LinearGradient
        colors={['#101922', '#15252E', '#193038', '#1D3B42', '#0E4548']}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]} // Stops from the UI tool
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>ChargeUp</Text>

          <View style={styles.brandHero}>
            <Ionicons name="car-sport" size={80} color="white" />
            <View style={styles.lightningBadge}>
               <Ionicons name="flash" size={24} color="#101922" />
            </View>
            <Text style={styles.tagline}>Find, book and pay</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.inputUnderline}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.inputUnderline}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                style={[styles.inputUnderline, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
              />
              <Ionicons
                name="eye-off-outline"
                size={20}
                color="white"
                style={styles.eyeIcon}
              />
            </View>
          </View>

          <Pressable
            style={styles.signupBtn}
            onPress={handleRegister}
          >
            <Text style={styles.signupBtnText}>Signup</Text>
          </Pressable>

          <Text style={styles.orText}>or</Text>

          <View style={styles.socialDivider}>
            <View style={styles.line} />
            <Text style={styles.socialLabel}>Signup with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <FontAwesome name="apple" size={40} color="white" />
            <FontAwesome name="google" size={38} color="#EA4335" />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an Account? </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>

          <Text style={styles.legalNotice}>
            By continuing, you agree to our{" "}
            <Text style={styles.legalLink}>Terms and conditions</Text> and{" "}
            <Text style={styles.legalLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  headerTitle: {
    alignSelf: "flex-start",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  brandHero: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  lightningBadge: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 2,
    top: 45, // Positioned over the car icon
  },
  tagline: {
    color: "white",
    fontSize: 18,
    marginTop: 15,
  },
  form: {
    width: "100%",
    marginBottom: 30,
  },
  inputUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.8)",
    color: "white",
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 25,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    bottom: 35,
  },
  signupBtn: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    height: 48,
    width: width * 0.45, // Slimmer pill shape matching design
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  signupBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  orText: {
    color: "white",
    marginBottom: 10,
  },
  socialDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  socialLabel: {
    color: "white",
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 45,
    alignItems: "center",
    marginBottom: 35,
  },
  footerRow: {
    flexDirection: "row",
    marginBottom: 30,
  },
  footerText: {
    color: "white",
    fontSize: 15,
  },
  loginLink: {
    color: "#4DA6FF", // Blue link color
    fontSize: 15,
    fontWeight: "bold",
  },
  legalNotice: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
  },
  legalLink: {
    color: '#76C7C0', // Teal link color
    textDecorationLine: "underline",
  },
});