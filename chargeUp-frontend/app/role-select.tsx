import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function RoleSelectScreen() {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideTitle = useRef(new Animated.Value(35)).current;
  const slideCard1 = useRef(new Animated.Value(50)).current;
  const slideCard2 = useRef(new Animated.Value(50)).current;
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideTitle, { toValue: 0, tension: 50, useNativeDriver: true }),
      Animated.spring(slideCard1, { toValue: 0, tension: 40, useNativeDriver: true }),
      Animated.spring(slideCard2, { toValue: 0, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSelectRole = async (role: "client" | "host") => {
    const anim = role === "client" ? scale1 : scale2;
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true }),
    ]).start(async () => {
      await AsyncStorage.setItem("userRole", role);
      router.push("/(auth)/register");
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={["#101922", "#15252E", "#1D3B42"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
          
          <View style={styles.header}>
            <Animated.View style={{ transform: [{ translateY: slideTitle }] }}>
              <Text style={styles.eyebrow}>GET STARTED</Text>
              <Text style={styles.title}>Choose Your Role</Text>
              <View style={styles.underline} />
            </Animated.View>
          </View>

          <View style={styles.cardsContainer}>
            {/* Driver Card */}
            <Animated.View style={{ transform: [{ translateY: slideCard1 }, { scale: scale1 }] }}>
              <Pressable style={styles.card} onPress={() => handleSelectRole("client")}>
                <LinearGradient colors={["rgba(94,207,218,0.15)", "rgba(94,207,218,0.05)"]} style={styles.cardGradient}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="car-sport" size={32} color="#5ECFDA" />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.roleTitle}>Driver</Text>
                    <Text style={styles.roleDesc}>I want to find and book charging stations.</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#5ECFDA" />
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Lender Card */}
            <Animated.View style={{ transform: [{ translateY: slideCard2 }, { scale: scale2 }] }}>
              <Pressable style={[styles.card, styles.cardGold]} onPress={() => handleSelectRole("host")}>
                <LinearGradient colors={["rgba(255,200,80,0.15)", "rgba(255,200,80,0.05)"]} style={styles.cardGradient}>
                  <View style={[styles.iconCircle, styles.iconCircleGold]}>
                    <MaterialCommunityIcons name="ev-station" size={32} color="#FFC850" />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.roleTitle}>Lender</Text>
                    <Text style={styles.roleDesc}>I want to share my charger and earn money.</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#FFC850" />
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>

        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  mainContent: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  eyebrow: { color: "#5ECFDA", fontSize: 12, fontWeight: "800", letterSpacing: 1.5, marginBottom: 8 },
  title: { color: "white", fontSize: 32, fontWeight: "900" },
  underline: { width: 50, height: 4, backgroundColor: "#5ECFDA", marginTop: 12, borderRadius: 2 },
  cardsContainer: { gap: 20 },
  card: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: "rgba(94,207,218,0.3)", backgroundColor: "rgba(255,255,255,0.03)" },
  cardGold: { borderColor: "rgba(255,200,80,0.3)" },
  cardGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(94,207,218,0.1)", alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  iconCircleGold: { backgroundColor: "rgba(255,200,80,0.1)" },
  cardText: { flex: 1 },
  roleTitle: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 4 },
  roleDesc: { color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 20 },
});