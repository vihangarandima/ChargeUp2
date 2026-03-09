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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function RegisterScreen() {
  const router = useRouter();

  // 1. Here are the missing "memory boxes"!
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. The function that talks to your backend
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Info", "Please fill in all fields to sign up.");
      return;
    }

    // ⚠️ CRITICAL: Replace '192.168.1.55' with YOUR computer's actual IPv4 address!
    // (Backend fetch code temporarily removed for Version 1 UI prototype)

    // Prototype Mode: Fake a successful server response!
    Alert.alert("Prototype Mode", "Account creation simulated! 🚀");

    // Success! The database saved the user.
    // NOW we push them to the next screen!
    router.push("/(auth)/vehicle-details");
    
    // Database rejected it (maybe email already exists)
    // (Handled by backend later)
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Brand Header */}
        <Text style={styles.headerTitle}>ChargeUp</Text>

        {/* Hero Branding */}
        <View style={styles.brandHero}>
          <Ionicons name="flash" size={80} color="white" />
          <Text style={styles.tagline}>Find, book and pay</Text>
        </View>

        {/* Signup Form */}
        <View style={styles.form}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#889"
            style={styles.inputUnderline} // Added this so it matches your other boxes!
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#889"
            style={styles.inputUnderline}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#889"
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

        {/* Main Action Button */}
        <Pressable
          style={styles.signupBtn}
          onPress={handleRegister} // Changed this to run our server check first!
        >
          <Text style={styles.signupBtnText}>Signup</Text>
        </Pressable>

        <Text style={styles.orText}>or</Text>

        {/* Social Options */}
        <View style={styles.socialDivider}>
          <View style={styles.line} />
          <Text style={styles.socialLabel}>Signup with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <FontAwesome name="apple" size={45} color="white" />
          <FontAwesome name="google" size={42} color="#EA4335" />
        </View>

        {/* Footer Toggle */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an Account? </Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </View>

        {/* Legal Disclaimer */}
        <Text style={styles.legalNotice}>
          By continuing, you agree to our{" "}
          <Text style={styles.legalLink}>Terms and conditions</Text> and{" "}
          <Text style={styles.legalLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1F23",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: "center",
  },
  headerTitle: {
    alignSelf: "flex-start",
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  brandHero: {
    alignItems: "center",
    marginBottom: 50,
  },
  tagline: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  form: {
    width: "100%",
    marginBottom: 40,
  },
  inputUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
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
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginBottom: 15,
  },
  signupBtnText: {
    color: "white",
    fontSize: 18,
  },
  orText: {
    color: "white",
    marginBottom: 15,
  },
  socialDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
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
    gap: 40,
    alignItems: "center",
    marginBottom: 40,
  },
  footerRow: {
    flexDirection: "row",
    marginBottom: 30,
  },
  footerText: {
    color: "white",
    fontSize: 14,
  },
  loginLink: {
    color: "#7BB1BA",
    fontSize: 14,
    fontWeight: "bold",
  },
  legalNotice: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
  },
  legalLink: {
    textDecorationLine: "underline",
  },
});