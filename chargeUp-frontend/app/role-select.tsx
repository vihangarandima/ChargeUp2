import React from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient"; // <-- Imported LinearGradient

export default function RoleSelectScreen() {
  const router = useRouter();

  // 2. CREATE A FUNCTION FOR EV OWNERS (CLIENTS)
  const handleSelectOwner = async () => {
    console.log("👆 BUTTON TAPPED: Saving 'client' to memory...");
    await AsyncStorage.setItem("userRole", "client");
    router.push("/(auth)/register");
  };

  // 3. CREATE A FUNCTION FOR LENDERS (HOSTS)
  const handleSelectLender = async () => {
    console.log("👆 BUTTON TAPPED: Saving 'host' to memory...");
    await AsyncStorage.setItem("userRole", "host");
    router.push("/(auth)/register");
  };

  return (
    // Replaced the background color with the exact gradient from your image
    <LinearGradient
      colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
      locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.brandHeader}>ChargeUp</Text>

        <View style={styles.content}>
          <Text style={styles.welcomeTitle}>Welcome to ChargeUp</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>

          {/* EV Owner Option */}
          <Pressable style={styles.roleCard} onPress={handleSelectOwner}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="car-electric"
                size={30}
                color="white"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.roleTitle}>EV Owner</Text>
              <Text style={styles.roleDesc}>
                Find, book and pay for charging.
              </Text>
            </View>
            <Entypo name="chevron-right" size={24} color="#888" />
          </Pressable>

          {/* Lender Option */}
          <Pressable style={styles.roleCard} onPress={handleSelectLender}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="ev-station" size={30} color="white" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.roleTitle}>Lender</Text>
              <Text style={styles.roleDesc}>Share your charger and earn.</Text>
            </View>
            <Entypo name="chevron-right" size={24} color="#888" />
          </Pressable>
        </View>

        <Text style={styles.legalFooter}>
          By continuing, you are agree to our{" "}
          <Text style={styles.underline}>Terms and conditions</Text> and{" "}
          <Text style={styles.underline}>Privacy Policy</Text>.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 25
  },
  brandHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  content: { flex: 1, justifyContent: "center" },
  welcomeTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // <-- Made slightly transparent to let gradient bleed through nicely
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: { flex: 1, marginLeft: 15 },
  roleTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  roleDesc: { color: "#AAA", fontSize: 12 },
  legalFooter: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
  underline: { textDecorationLine: "underline" },
});