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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// 🔥 Firebase Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Ensure this path points to your actual config file

/**
 * 💡 InputField Component
 * We keep this OUTSIDE the main LoginScreen component.
 * If it was inside, React would re-create this component every time the user types,
 * which causes the keyboard to constantly flicker and close automatically!
 */
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  isPassword,
  isFocused,
  onFocus,
  onBlur,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = value.length > 0;

  return (
    <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
      <View style={styles.inputIconBox}>
        <Ionicons
          name={icon}
          size={17}
          color={isFocused ? "#5ECFDA" : "rgba(255,255,255,0.3)"}
        />
      </View>

      {/* Input Area */}
      <View style={styles.inputBody}>
        {(isFocused || hasValue) && (
          <Text
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
          secureTextEntry={isPassword && !showPassword}
          onFocus={onFocus}
          onBlur={onBlur}
          selectionColor="#5ECFDA"
        />
      </View>

      {/* Show/Hide Password Toggle button */}
      {isPassword && (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeBtn}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={isFocused ? "#5ECFDA" : "rgba(255,255,255,0.3)"}
          />
        </Pressable>
      )}
    </View>
  );
};

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconAnim = useRef(new Animated.Value(0.6)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Run these UI entrance animations all at once when the screen loads
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
          toValue: 1.07,
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

  // ── Handle Firebase Login ──
  const handleLogin = async () => {
    animateBtn(); // Trigger the button bounce

    // 1. Basic Validation
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter your email and password.");
      return;
    }

    try {
      // 1. Send the email and password to my Node.js backend
      // Make sure this IP address matches my computer's current Wi-Fi IP!
      const response = await fetch("http://10.184.109.178:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user?.id) await AsyncStorage.setItem("userId", data.user.id);
        if (data.token) await AsyncStorage.setItem("userToken", data.token);
        if (data.user?.name)
          await AsyncStorage.setItem("userName", data.user.name);

        // Use backend role if present, otherwise check AsyncStorage
        const role =
          data.user?.role || (await AsyncStorage.getItem("userRole"));

        if (role === "client") {
          router.replace("/home");
        } else if (role === "host") {
          router.replace("/(host)/host-home");
        } else {
          router.replace("/home");
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert(
        "Connection Error",
        "Could not reach the server. Make sure your Node.js backend is running and the IP address is correct!",
      );
      const user = userCredential.user;

      console.log("Logged in user:", user.email);

      // 3. Save Session Data Locally
      // This helps us know the user is logged in next time they open the app
      await AsyncStorage.setItem("userToken", user.uid);
      // Fallback to "User" just in case Firebase doesn't return an email string
      await AsyncStorage.setItem("userName", user.email || "User");

      // 4. Navigate to Home
      // NOTE: Because Firebase Auth doesn't store 'roles', we are sending everyone to /home for now.
      router.replace("/home");
    } catch (error: any) {
      // 5. Error Handling
      console.log(error.code, error.message);

      // Map Firebase specific error codes to user-friendly messages
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert("Login Failed", "Invalid email or password.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
      locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* ── Background Elements ── */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.topAccent} />

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
              <View style={styles.topBar}>
                <View style={styles.logoChip}>
                  <Ionicons name="flash" size={14} color="#0E1F26" />
                </View>
                <Text style={styles.brandName}>ChargeUp</Text>
                {/* Fixed: Replaced <div> with <View> */}
                <View style={styles.badgePill}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>EV Network</Text>
                </View>
              </View>

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
                <Text style={styles.heroTitle}>Welcome Back</Text>
                <Text style={styles.heroSub}>
                  Sign in to your ChargeUp account
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.form}>
                  <InputField
                    icon="mail-outline"
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    isFocused={focusedField === "email"}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <InputField
                    icon="lock-closed-outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    isPassword
                    isFocused={focusedField === "password"}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                <Pressable style={styles.forgotRow}>
                  <Text style={styles.forgotText}>Forgot your password?</Text>
                  <Text style={styles.forgotLink}> Reset it →</Text>
                </Pressable>

                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                  <Pressable onPress={handleLogin} style={styles.ctaBtn}>
                    <LinearGradient
                      colors={["#3ABFCC", "#1E9BAA"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.ctaGradient}
                    >
                      <Text style={styles.ctaText}>Sign In</Text>
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

                <View style={styles.divider}>
                  <View style={styles.divLine} />
                  <Text style={styles.divLabel}>or continue with</Text>
                  <View style={styles.divLine} />
                </View>

                <View style={styles.socialRow}>
                  <Pressable style={styles.socialBtn}>
                    <FontAwesome5 name="apple" size={20} color="white" />
                    <Text style={styles.socialText}>Apple</Text>
                  </Pressable>
                  <Pressable style={[styles.socialBtn, styles.googleBtn]}>
                    <FontAwesome5 name="google" size={17} color="#EA4335" />
                    <Text style={[styles.socialText, { color: "#EA4335" }]}>
                      Google
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>2,400+</Text>
                  <Text style={styles.statLabel}>Chargers</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50k+</Text>
                  <Text style={styles.statLabel}>Users</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.9★</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>

              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <Pressable onPress={() => router.push("/(auth)/register")}>
                  <Text style={styles.signupLink}> Sign Up →</Text>
                </Pressable>
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
  scroll: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 32 },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#5ECFDA",
    opacity: 0.65,
  },
  blob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(94,207,218,0.055)",
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 28,
  },
  logoChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  brandName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    flex: 1,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.1)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.22)",
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
  badgeText: {
    color: "#5ECFDA",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  hero: { alignItems: "center", marginBottom: 24 },
  iconOuter: { width: 92, height: 92, borderRadius: 46, marginBottom: 16 },
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
    letterSpacing: -0.8,
    marginBottom: 5,
  },
  heroSub: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    marginBottom: 16,
  },
  form: { gap: 10, marginBottom: 10 },
  inputWrap: {
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
  inputWrapFocused: {
    backgroundColor: "rgba(94,207,218,0.07)",
    borderColor: "rgba(94,207,218,0.4)",
  },
  inputIconBox: { width: 20, alignItems: "center" },
  inputBody: { flex: 1, justifyContent: "center" },
  floatLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  floatLabelActive: { color: "#5ECFDA" },
  textInput: { color: "white", fontSize: 15, paddingVertical: 0 },
  eyeBtn: { padding: 4 },
  forgotRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 4,
  },
  forgotText: { color: "rgba(255,255,255,0.35)", fontSize: 12 },
  forgotLink: { color: "#5ECFDA", fontSize: 12, fontWeight: "600" },
  ctaBtn: { borderRadius: 15, overflow: "hidden", marginBottom: 18 },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 15,
  },

  ctaText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 8,
  },

  ctaArrow: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 4,
  },

  // Social Login Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },

  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  divLabel: {
    marginHorizontal: 10,
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },

  // Social Buttons
  socialRow: { flexDirection: "row", gap: 12 },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    flex: 1,
  },

  googleBtn: {
    borderColor: "#EA4335",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  googleBtn: {
    backgroundColor: "rgba(234,67,53,0.05)",
    borderColor: "rgba(234,67,53,0.18)",
  },
  socialText: { color: "white", fontSize: 14, fontWeight: "600" },

  // Stats row styling
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  statNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  statLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  // Signup link styling
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },

  signupText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },

  signupLink: {
    color: "#5ECFDA",
    fontSize: 13,
    fontWeight: "600",
  },
});
