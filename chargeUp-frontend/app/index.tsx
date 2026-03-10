import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#0D1F23", "#132A2F", "#0D1F23"]}
        style={styles.background}
      />

      <View style={styles.content}>
        {/* Top Header */}
        <Text style={styles.brandText}>ChargeUp</Text>

        {/* Main Heading */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            The Future of <Text style={styles.evText}>EV</Text>
          </Text>
          <Text style={styles.mainTitle}>Charging...</Text>
        </View>

        {/* Subtext */}
        <Text style={styles.subText}>
          Connect with charging stations instantly.{"\n"}
          Manage your fleet{" "}
          <Text style={styles.highlightText}>effortlessly.</Text>
        </Text>

        {/* Illustration Area */}
        <View style={styles.imageWrapper}>
          {/* Replace with your local image asset */}
          <Image
            source={{ uri: "https://placeholder.com/car-illustration" }}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/role-select")}
        >
          <LinearGradient
            colors={["#1A1A1A", "#2D2D2D"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  brandText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1,
  },
  titleContainer: {
    marginTop: 20,
  },
  mainTitle: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 48,
  },
  evText: {
    color: "#00D1FF", // Cyan blue from your image
  },
  subText: {
    color: "#CCC",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  highlightText: {
    color: "#00D1FF",
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carImage: {
    width: width * 0.9,
    height: height * 0.35,
  },
  button: {
    width: "100%",
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#00D1FF", // The glowing cyan border
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
