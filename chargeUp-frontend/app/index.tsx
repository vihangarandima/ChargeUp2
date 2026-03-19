import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StatusBar,
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
      <StatusBar barStyle="light-content" />

      {/* FIXED PATH: Changed /assest/ to ../assets/ */}
      <ImageBackground
        source={require("../assets/images/car_charging.jpg")}
        style={styles.background}
        imageStyle={{ opacity: 0.45 }} /* Added 45% opacity to the image itself */
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Top Header */}
          <Text style={styles.brandText}>ChargeUp</Text>

          {/* Main Heading Group */}
          <View style={styles.centerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>The Feature of</Text>
              <Text style={styles.evText}>EV</Text>
              <Text style={styles.mainTitle}>Charging...</Text>
            </View>

            {/* Subtext */}
            <Text style={styles.subText}>
              Connect with charging stations instantly.{"\n"}
              Manage your fleet effortlessly.
            </Text>

            {/* Get Started Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/role-select")}
              activeOpacity={0.7}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Get Started</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    // You can adjust or remove this overlay color now that the image itself is darker
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 80,
  },
  brandText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: 'flex-start'
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  mainTitle: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "600", // Changed to Semi-bold
    textAlign: "center",
  },
  evText: {
    color: "#FFF",
    fontSize: 65,
    fontWeight: "600", // Changed to Semi-bold
    textAlign: "center",
    marginVertical: -10,
  },
  subText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400", // Changed to Regular
    marginBottom: 40,
  },
  button: {
    width: width * 0.75,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.7)",
    overflow: "hidden",
  },
  buttonInner: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "400",
  },
});