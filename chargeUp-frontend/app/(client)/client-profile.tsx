import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("...");
  const [userPhone, setUserPhone] = useState("...");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setUserName(storedName);

        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(
          "http://10.184.109.178:5000/api/auth/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.name || data.userName) setUserName(data.name || data.userName);
          if (data.email) setUserEmail(data.email);
          if (data.phone) setUserPhone(data.phone);
        }
      } catch (error) {
        console.error("Network error fetching profile:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const menuItems = [
    { label: "My Profile", onPress: () => {} },
    { label: "My Vehicle", onPress: () => {} },
    { label: "Lending details", onPress: () => {} },
    { label: "History", onPress: () => {} },
    { label: "Log Out", onPress: handleLogout },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/client profile.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header stays at the very top */}
          <View style={styles.topHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          {/* Profile and Menu pushed down slightly */}
          <View style={styles.mainPushDownContainer}>
            <Text style={styles.pageTitle}>My Profile</Text>

            <View style={styles.profileSection}>
              {/* FIXED: Changed div to View */}
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={50} color="#000" />
                </View>
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera" size={14} color="white" />
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userName}</Text>
                <Text style={styles.profileEmail}>{userEmail}</Text>
                {userPhone !== "..." && (
                  <Text style={styles.profilePhone}>{userPhone}</Text>
                )}
              </View>
            </View>

            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuButtonWrapper}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={["#2A3F4C", "#13222A"]}
                    style={styles.menuPill}
                  >
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="rgba(255,255,255,0.4)"
                      style={styles.chevron}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1114",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },
  topHeader: {
    marginTop: 20,
    marginBottom: 0,
  },
  brandTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  mainPushDownContainer: {
    marginTop: 40,
  },
  pageTitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 35,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 25,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#050B0D",
  },
  profileInfo: {
    justifyContent: "center",
  },
  profileName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  profileEmail: {
    color: "#D1D5DB",
    fontSize: 12,
    marginBottom: 6,
    textDecorationLine: "underline",
  },
  profilePhone: {
    color: "#D1D5DB",
    fontSize: 12,
  },
  menuContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  menuButtonWrapper: {
    marginBottom: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  menuPill: {
    borderRadius: 25,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  menuLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  chevron: {
    position: "absolute",
    right: 20,
  },
});