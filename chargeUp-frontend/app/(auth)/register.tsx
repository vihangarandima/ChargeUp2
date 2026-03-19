import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handleRegister = async () => {
    animateBtn();
    if (!name || !email || !password) {
      Alert.alert("Missing Info", "Please fill in all fields to sign up.");
      return;
    }
    try {
      const role = (await AsyncStorage.getItem("userRole")) || "client";
      const response = await fetch(
        "http://10.184.109.178:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        if (data.token) await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userName", name);
        Alert.alert("Welcome!", "Account created successfully.");
        if (role === "host") {
          router.replace("/host-charger-details");
        } else {
          router.replace("/vehicle-details");
        }
      } else {
        Alert.alert(
          "Signup Failed",
          data.message || "Could not create account.",
        );
      }
    } catch (error) {
      Alert.alert("Connection Error", "Could not reach the server.");
    }
  };

  const InputField = ({
    placeholder,
    value,
    onChangeText,
    keyboardType,
    autoCapitalize,
    isPassword,
    fieldKey,
  }: any) => {
    const isFocused = focusedField === fieldKey;
    return (
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <View style={styles.inputInner}>
          <Text style={[styles.inputLabel, (isFocused || value) && styles.inputLabelActive]}>
            {placeholder}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={value}
              onChangeText={onChangeText}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize || "sentences"}
              secureTextEntry={isPassword && !showPassword}
              placeholderTextColor="transparent"
              onFocus={() => setFocusedField(fieldKey)}
              onBlur={() => setFocusedField(null)}
              selectionColor="#5ECFDA"
            />
            {isPassword && (
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={isFocused ? "#5ECFDA" : "rgba(255,255,255,0.4)"}
                />
              </Pressable>
            )}
          </View>
        </View>
        {/* Animated bottom border */}
        <View style={styles.inputBorderBase} />
        {isFocused && <View style={styles.inputBorderActive} />}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
      locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Decorative background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.logoMark}>
              <Ionicons name="flash" size={16} color="#101922" />
            </View>
            <Text style={styles.headerTitle}>ChargeUp</Text>
          </View>

          {/* Hero Section */}
          <Animated.View style={[styles.heroSection, { transform: [{ scale: logoScale }] }]}>
            <LinearGradient
              colors={["rgba(94,207,218,0.15)", "rgba(94,207,218,0.03)"]}
              style={styles.iconGlow}
            >
              <View style={styles.iconRing}>
                <Ionicons name="flash" size={52} color="white" />
              </View>
            </LinearGradient>
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSub}>Find, book and pay for EV charging</Text>
          </Animated.View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              fieldKey="name"
            />
            <InputField
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              fieldKey="email"
            />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              fieldKey="password"
            />
          </View>

          {/* Signup Button */}
          <Animated.View style={{ transform: [{ scale: btnScale }], width: "100%" }}>
            <Pressable onPress={handleRegister} style={styles.signupBtn}>
              <LinearGradient
                colors={["rgba(94,207,218,0.22)", "rgba(94,207,218,0.08)"]}
                style={styles.signupBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.signupBtnText}>Create Account</Text>
                <View style={styles.btnArrow}>
                  <Ionicons name="arrow-forward" size={18} color="#101922" />
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <Pressable style={styles.socialBtn}>
              <FontAwesome name="apple" size={22} color="white" />
              <Text style={styles.socialBtnText}>Apple</Text>
            </Pressable>
            <Pressable style={[styles.socialBtn, styles.socialBtnGoogle]}>
              <FontAwesome name="google" size={20} color="#EA4335" />
              <Text style={[styles.socialBtnText, { color: "#EA4335" }]}>Google</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginLink}>Sign In →</Text>
            </Pressable>
          </View>

          {/* Legal */}
          <Text style={styles.legalNotice}>
            By continuing, you agree to our{" "}
            <Text style={styles.legalLink}>Terms</Text> and{" "}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  // Decorative background orbs
  bgCircle1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(94,207,218,0.04)",
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(94,207,218,0.03)",
    bottom: 120,
    left: -60,
  },
  bgCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.02)",
    top: 200,
    right: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 22,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 32,
    gap: 10,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginBottom: 36,
  },
  iconGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: "rgba(94,207,218,0.35)",
    backgroundColor: "rgba(94,207,218,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    letterSpacing: 0.2,
  },

  // Form inputs
  form: { width: "100%", marginBottom: 28, gap: 4 },
  inputContainer: {
    width: "100%",
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    position: "relative",
    overflow: "hidden",
  },
  inputContainerFocused: {
    backgroundColor: "rgba(94,207,218,0.06)",
    borderColor: "rgba(94,207,218,0.3)",
  },
  inputInner: {},
  inputLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  inputLabelActive: {
    color: "#5ECFDA",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 0,
    letterSpacing: 0.3,
  },
  eyeBtn: {
    padding: 4,
  },
  inputBorderBase: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  inputBorderActive: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 1.5,
    backgroundColor: "#5ECFDA",
  },

  // Signup button
  signupBtn: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.4)",
  },
  signupBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 12,
  },
  floatLabelActive: { color: "#5ECFDA" },
  textInput: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  btnArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  dividerText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // Social buttons
  socialRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  socialBtnGoogle: {
    backgroundColor: "rgba(234,67,53,0.06)",
    borderColor: "rgba(234,67,53,0.2)",
  },
  socialBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },

  // Footer
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
  },
  loginLink: {
    color: "#5ECFDA",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Legal
  legalNotice: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 20,
  },
  legalLink: {
    color: "rgba(255,255,255,0.5)",
    textDecorationLine: "underline",
  },
});