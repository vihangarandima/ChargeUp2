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
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// 🔴 Google Sign-In Imports
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

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
    // 🔴 1. Configure Google Sign-In when the screen loads
    GoogleSignin.configure({
      webClientId:
        "71813664146-q1slepsb41dr9f0da3715i6phhj7p11i.apps.googleusercontent.com",
    });

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

  // ── Handle Email/Password Login ──
  const handleLogin = async () => {
    animateBtn();
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter your email and password.");
      return;
    }

    try {
<<<<<<< Updated upstream
      // 1. Send the email and password to my Node.js backend
      // Make sure this IP address matches my computer's current Wi-Fi IP!
      const response = await fetch("http://10.184.109.178:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("📦 WHAT IS IN THE LOGIN BOX?:", data);

      // 2. If the backend approves the login (Status 200 OK)
      if (response.ok) {
        // 3. Store the authentication token securely
        // 3. Store the user's ID securely
        if (data.user && data.user.id) {
          await AsyncStorage.setItem("userId", data.user.id);
        }

        if (data.user && data.user.name) {
          await AsyncStorage.setItem("userName", data.user.name);
        }

        // 4. Get the role (either from the backend response or local memory)
        const role =
          data.user?.role || (await AsyncStorage.getItem("userRole"));

        // 5. Navigate to the correct screen based on their role
        if (role === "client") {
          router.replace("/home");
        } else if (role === "host") {
          router.replace("/(host)/host-home");
        } else {
          router.replace("/(client)/charger-booking");
        }
      } else {
        // If the password is wrong or user doesn't exist
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert(
        "Connection Error",
        "Could not reach the server. Make sure your Node.js backend is running and the IP address is correct!",
=======
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
>>>>>>> Stashed changes
      );
      const user = userCredential.user;

      await AsyncStorage.setItem("userToken", user.uid);
      await AsyncStorage.setItem("userName", user.email || "User");

      router.replace("/home");
    } catch (error: any) {
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

  // 🔴 2. Handle Google Login ──
  const handleGoogleLogin = async () => {
    try {
      // Check if Android device has Google Play Services
      await GoogleSignin.hasPlayServices();

      // Open Google login prompt
      const userInfo = await GoogleSignin.signIn();

      // Grab the token Google gives us
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      if (!idToken) {
        throw new Error("No ID token found!");
      }

      // Create a Firebase credential using that token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign into Firebase with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      console.log("Google Logged In User:", user.email);

      // Save session info
      await AsyncStorage.setItem("userToken", user.uid);
      // We can use displayName since Google provides their actual name!
      await AsyncStorage.setItem(
        "userName",
        user.displayName || user.email || "User",
      );

      // Navigate home
      router.replace("/home");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled Google login.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Google login already in progress...");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          "Error",
          "Google Play Services are not available on this device.",
        );
      } else {
        Alert.alert("Google Login Error", error.message);
        console.log("Google Auth Error: ", error);
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
                    keyboardType="email-address"
                    autoCapitalize="none"
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

                  {/* 🔴 3. Attached handleGoogleLogin here! */}
                  <Pressable
                    onPress={handleGoogleLogin}
                    style={[styles.socialBtn, styles.googleBtn]}
                  >
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

// ── STYLES ──
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

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

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
  },

  socialText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },

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
