import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    // 🚀 Sends the user straight to the Login/Register flow!
    router.push("/(auth)/login");
  };

  return (
    // ImageBackground acts like a View, but puts an image behind everything inside it
    <ImageBackground
      // I put a placeholder EV image here so it works immediately when you paste it.
      // Later, you can swap this to: require('../../assets/images/your-bg-image.jpg')
      source={{
        uri: "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1000&auto=format&fit=crop",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Adding a dark overlay so the white text is easy to read against any background */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />

          {/* Top Logo */}
          <View style={styles.header}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          {/* Center Text content */}
          <View style={styles.centerContent}>
            <Text style={styles.mainHeading}>The Future of</Text>
            <Text style={styles.subHeading}>EV Charging...</Text>

            <Text style={styles.description}>
              Connect with charging stations instantly.{"\n"}
              Manage your fleet effortlessly.
            </Text>
          </View>

          {/* Bottom Button */}
          <View style={styles.bottomContent}>
            <Pressable style={styles.getStartedBtn} onPress={handleGetStarted}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    // This creates a dark, semi-transparent tint over the image
    backgroundColor: "rgba(11, 29, 33, 0.7)",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  brandTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center", // Pushes the text perfectly into the middle of the screen
    alignItems: "center",
    paddingHorizontal: 30,
  },
  mainHeading: {
    color: "white",
    fontSize: 42,
    fontWeight: "300", // A lighter font weight to match your design
    textAlign: "center",
  },
  subHeading: {
    color: "white",
    fontSize: 42,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24, // Adds a little breathing room between the two lines of text
  },
  bottomContent: {
    paddingHorizontal: 30,
    paddingBottom: 50, // Keeps the button pushed off the very bottom of the screen
    alignItems: "center",
  },
  getStartedBtn: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Gives it that cool "frosted glass" look
    width: "80%",
    alignItems: "center",
  },
  getStartedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
