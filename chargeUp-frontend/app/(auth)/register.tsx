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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// --- FIREBASE IMPORTS ---
import { auth, db } from "../Config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// --- REUSABLE INPUT COMPONENT ---
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  isPassword,
  fieldKey,
  focusedField,
  setFocusedField,
}: any) => {
  const isFocused = focusedField === fieldKey;
  const hasValue = value && value.length > 0;

  // Local state for toggling password visibility per field
  const [localShowPassword, setLocalShowPassword] = useState(false);

  return (
    <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
      <View style={styles.inputIconBox}>
        <Ionicons
          name={icon}
          size={17}
          color={isFocused ? "#5ECFDA" : "rgba(255,255,255,0.3)"}
        />
      </View>

      <View style={styles.inputBody}>
        {/* pointerEvents="none" allows touches to pass through the label to the input */}
        {(isFocused || hasValue) && (
          <Text
            pointerEvents="none"
            style={[styles.floatLabel, isFocused && styles.floatLabelActive]}
          >
            {placeholder}
          </Text>
        )}
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={!isFocused && !hasValue ? placeholder : ""}
          placeholderTextColor="rgba(255,255,255,0.28)"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || "none"}
          secureTextEntry={isPassword && !localShowPassword}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
          selectionColor="#5ECFDA"
        />
      </View>

      {isPassword && (
        <Pressable
          onPress={() => setLocalShowPassword(!localShowPassword)}
          style={styles.eyeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={localShowPassword ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={isFocused ? "#5ECFDA" : "rgba(255,255,255,0.3)"}
          />
        </Pressable>
      )}
    </View>
  );
};

// --- MAIN SCREEN ---
export default function RegisterScreen() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconAnim = useRef(new Animated.Value(0.6)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.spring(iconAnim, {
        toValue: 1,
        tension: 90,
        friction: 7,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.96,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRegister = async () => {
    animateBtn();

    if (!name || !email || !password) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    try {
      // 1. Get the role you saved earlier (Host or Client)
      const role = (await AsyncStorage.getItem("userRole")) || "client";

      // 2. Send the data to your Node.js/Express server
      const response = await fetch(
        "http://10.129.159.178:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        },
      );

      const data = await response.json();

      // 3. Check if the server accepted the request
      if (response.ok) {
        // Save user details locally
        if (data.token) await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userName", name);

        Alert.alert("Welcome!", "Account created successfully.");

        // 4. Navigate based on the role
        router.replace(
          role === "host" ? "/host-charger-details" : "/vehicle-details",
        );
      } else {
        // Show the specific error message from your backend
        Alert.alert(
          "Signup Failed",
          data.message || "Could not create account.",
        );
      }
    } catch (error) {
      // This catches network issues (like if the IP address changed)
      Alert.alert(
        "Connection Error",
        "Could not reach the server. Make sure your backend is running.",
      );
      console.error(error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const role = (await AsyncStorage.getItem("userRole")) || "client";

      // ⚡ SYNC WITH BACKEND: Tell your Node server a Google user joined
      await fetch("http://10.184.109.178:5000/api/auth/google-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          role,
        }),
      });

      await AsyncStorage.setItem("userName", user.displayName || "");
      router.replace(
        role === "host" ? "/host-charger-details" : "/vehicle-details",
      );
    } catch (error: any) {
      Alert.alert("Google Error", "Check your Firebase configuration.");
    }
  };

  return (
    <LinearGradient
      colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* TOP BAR */}
              <View style={styles.topBar}>
                <View style={styles.logoChip}>
                  <Ionicons name="flash" size={14} color="#0E1F26" />
                </View>
                <Text style={styles.brandName}>ChargeUp</Text>
                <View style={styles.badgePill}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>EV Network</Text>
                </View>
              </View>

              {/* HERO */}
              <View style={styles.hero}>
                <Animated.View
                  style={[
                    styles.iconOuter,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <LinearGradient
                    colors={["rgba(94,207,218,0.18)", "rgba(94,207,218,0.04)"]}
                    style={styles.iconGradient}
                  >
                    <Animated.View
                      style={[
                        styles.iconInner,
                        { transform: [{ scale: iconAnim }] },
                      ]}
                    >
                      <Ionicons name="flash" size={38} color="white" />
                    </Animated.View>
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.heroTitle}>Get Started</Text>
                <Text style={styles.heroSub}>
                  Create your free ChargeUp account
                </Text>
              </View>

              {/* CARD */}
              <View style={styles.card}>
                <View style={styles.form}>
                  <InputField
                    icon="person-outline"
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    fieldKey="name"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <InputField
                    icon="mail-outline"
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    fieldKey="email"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <InputField
                    icon="lock-closed-outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    isPassword
                    fieldKey="password"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                </View>

                {/* SIGNUP BUTTON */}
                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                  <Pressable onPress={handleRegister} style={styles.ctaBtn}>
                    <LinearGradient
                      colors={["#3ABFCC", "#1E9BAA"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.ctaGradient}
                    >
                      <Text style={styles.ctaText}>Create Account</Text>
                      <View style={styles.ctaArrow}>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color="#0E4548"
                        />
                      </View>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>

                {/* DIVIDER */}
                <View style={styles.divider}>
                  <View style={styles.divLine} />
                  <Text style={styles.divLabel}>or continue with</Text>
                  <View style={styles.divLine} />
                </View>

                {/* SOCIAL */}
                <View style={styles.socialRow}>
                  <Pressable style={styles.socialBtn}>
                    <FontAwesome5 name="apple" size={20} color="white" />
                    <Text style={styles.socialText}>Apple</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.socialBtn, styles.googleBtn]}
                    onPress={handleGoogleSignup}
                  >
                    <FontAwesome5 name="google" size={17} color="#EA4335" />
                    <Text style={[styles.socialText, { color: "#EA4335" }]}>
                      Google
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* FOOTER */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.loginLink}> Sign In →</Text>
                </Pressable>
              </View>

              <View style={styles.legalBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={14}
                  color="#5ECFDA"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.legalText}>
                  By signing up you agree to our{" "}
                  <Text style={styles.legalLink}>Terms</Text> and{" "}
                  <Text style={styles.legalLink}>Privacy Policy</Text>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  blob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(94,207,218,0.06)",
    top: -100,
    right: -80,
  },
  blob2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(94,207,218,0.03)",
    bottom: 100,
    left: -70,
  },
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  logoChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  brandName: { color: "white", fontSize: 20, fontWeight: "700", flex: 1 },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.1)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5ECFDA",
  },
  badgeText: { color: "#5ECFDA", fontSize: 11, fontWeight: "600" },
  hero: { alignItems: "center", marginBottom: 25 },
  iconOuter: { width: 92, height: 92, borderRadius: 46 },
  iconGradient: {
    flex: 1,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(94,207,218,0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(94,207,218,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 5,
  },
  heroSub: { color: "rgba(255,255,255,0.38)", fontSize: 13 },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    marginBottom: 20,
  },
  form: { gap: 12, marginBottom: 20 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputWrapFocused: {
    backgroundColor: "rgba(94,207,218,0.08)",
    borderColor: "rgba(94,207,218,0.4)",
  },
  inputIconBox: { width: 24 },
  inputBody: { flex: 1, minHeight: 45, justifyContent: "center" },
  floatLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  floatLabelActive: { color: "#5ECFDA" },
  textInput: { color: "white", fontSize: 16, paddingVertical: 5 },
  eyeBtn: { padding: 5 },
  ctaBtn: { borderRadius: 16, overflow: "hidden", marginBottom: 20 },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "700" },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  divLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  divLabel: { color: "rgba(255,255,255,0.3)", fontSize: 12 },
  socialRow: { flexDirection: "row", gap: 12 },
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
    borderColor: "rgba(255,255,255,0.1)",
  },
  googleBtn: {
    backgroundColor: "rgba(234,67,53,0.06)",
    borderColor: "rgba(234,67,53,0.2)",
  },
  socialText: { color: "white", fontSize: 14, fontWeight: "600" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginText: { color: "rgba(255,255,255,0.45)" },
  loginLink: { color: "#5ECFDA", fontWeight: "700" },
  legalBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.05)",
    borderRadius: 12,
    padding: 12,
  },
  legalText: {
    flex: 1,
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    lineHeight: 16,
  },
  legalLink: {
    color: "#5ECFDA",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
