import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // <-- Added import for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HostHomeScreen() {
  const router = useRouter(); // <-- Initialize the router

  // 🌟 NEW: 1. Create a safe state for the name. It starts blank so it doesn't crash!
  const [userName, setUserName] = useState("");
  const [chargerType, setChargerType] = useState("No Charger Added");
  const [chargerImage, setChargerImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/8643/8643034.png",
  );

  // 🌟 NEW: Our dictionary that matches the name to the picture!
  const getChargerImage = (type: string) => {
    switch (type) {
      case "Tesla Wall Connector": // Must match what is in your database!
        return "https://cdn-icons-png.flaticon.com/512/5968/5968925.png";
      case "Type 2":
        return "https://cdn-icons-png.flaticon.com/512/8643/8643034.png";
      case "CCS":
        return "https://cdn-icons-png.flaticon.com/512/2933/2933994.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/8643/8643034.png"; // Backup image
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step A: Grab the Host's name from local memory
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        }

        // Step B: Ask the backend for the newest charger
        // IMPORTANT: Make sure this IP address matches your computer's current IP!
        const response = await fetch(
          "http://10.128.54.178:5000/api/chargers/latest",
        );

        if (response.ok) {
          const data = await response.json();

          // Step C: If a charger exists, put the details in our boxes
          if (data && data.chargerType) {
            setChargerType(data.chargerType);
            setChargerImage(getChargerImage(data.chargerType));
          }
        }
      } catch (error) {
        console.log("Error loading data:", error);
      }
    };

    fetchData();
  }, []); // The empty brackets mean "only do this once when opening the screen"

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Background Image with 35% opacity */}
      <ImageBackground
        source={require("../../assets/images/car_charging.jpg")}
        style={StyleSheet.absoluteFillObject}
        imageStyle={{ opacity: 0.35 }}
      >
        {/* Dark Gradient Overlay to ensure text readability */}
        <LinearGradient
          colors={[
            "rgba(10, 17, 20, 0.9)",
            "rgba(15, 35, 45, 0.7)",
            "rgba(10, 17, 20, 0.9)",
          ]}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* --- HEADER --- */}
            <Text style={styles.brandText}>ChargeUp</Text>

            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greetingText}>Hello, {userName}</Text>
                <Text style={styles.subtitleText}>Lend Your charger</Text>
              </View>

              <View style={styles.headerIcons}>
                <Pressable style={styles.iconCircle}>
                  <Ionicons name="search" size={20} color="white" />
                </Pressable>

                <Pressable style={styles.iconCircle}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="white"
                  />
                  {/* Notification Badge */}
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>4</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* --- MAIN CHARGER CARD --- */}
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.02)"]}
              style={styles.heroCard}
            >
              {/*NEW: Your brand new text sitting inside the card! */}
              <Text style={styles.cardChargerType}>{chargerType}</Text>
              {/* Plug Icon Top Right */}
              <MaterialCommunityIcons
                name="power-plug"
                size={28}
                color="white"
                style={styles.plugIcon}
              />

              {/* Placeholder for your 3D Charger image.
                Replace the uri with require('../../assets/images/charger_model.png') if you have it locally downloaded
              */}
              <Image
                source={{ uri: chargerImage }}
                style={styles.chargerImage}
                resizeMode="contain"
              />
            </LinearGradient>

            {/* --- MANAGE YOUR CHARGER SECTION --- */}
            <Text style={styles.sectionTitle}>Manage Your Charger</Text>

            {/* Added onPress navigation here */}
            <Pressable
              style={styles.listItem}
              onPress={() => router.push("/(host)/manage-charger")}
            >
              <Text style={styles.listItemText}>
                {userName
                  ? `${userName}'s Charging Station`
                  : "Your Charging Station"}
              </Text>
            </Pressable>

            <Pressable style={styles.listItem}>
              <Ionicons
                name="add"
                size={24}
                color="white"
                style={styles.addIcon}
              />
              <Text style={styles.listItemText}>Add Another Charger</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1114", // Fallback color
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    // Add bottom padding so the list items aren't hidden behind the absolute tab bar
    paddingBottom: 110,
  },

  // Header Styles
  brandText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greetingText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitleText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#4A5A60",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0A1114",
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },

  // Hero Card Styles
  heroCard: {
    width: "100%",
    height: 300,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
    position: "relative",
  },
  plugIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  chargerImage: {
    width: "60%",
    height: "70%",
  },

  // Manage List Styles
  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "300",
    marginBottom: 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  listItemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
  addIcon: {
    marginRight: 15,
  },

  cardChargerType: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    position: "absolute",
    top: 20,
    left: 20,
  },
});
