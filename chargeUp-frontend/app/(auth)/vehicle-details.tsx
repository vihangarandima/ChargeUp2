import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function VehicleDetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <Text style={styles.headerTitle}>ChargeUp</Text>

        {/* Hero Branding */}
        <View style={styles.brandHero}>
          <Ionicons name="flash" size={80} color="white" />
          <Text style={styles.tagline}>Find, book and pay</Text>
        </View>

        <Text style={styles.instructionText}>
          Add your vehicle details here.
        </Text>

        {/* Form Container */}
        <View style={styles.formCard}>
          {/* Brand Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Choose your Brand</Text>
            <View style={styles.dropdownField}>
              <TextInput
                placeholder="Ex : BYD"
                placeholderTextColor="#999"
                style={styles.inputText}
              />
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="white"
              />
            </View>
          </View>

          {/* Model Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>model</Text>
            <View style={styles.dropdownField}>
              <TextInput
                placeholder="Ex : seal"
                placeholderTextColor="#999"
                style={styles.inputText}
              />
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="white"
              />
            </View>
          </View>

          {/* Charging Port Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Charging port</Text>
            <View style={styles.dropdownField}>
              <TextInput
                placeholder="Ex : Type 2"
                placeholderTextColor="#999"
                style={styles.inputText}
              />
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="white"
              />
            </View>
          </View>

          {/* Manufacture Year */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Manufacture year</Text>
            <View style={styles.inputField}>
              <TextInput
                placeholder="Ex : 2025"
                placeholderTextColor="#999"
                style={styles.inputText}
              />
            </View>
          </View>

          {/* Battery Capacity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Battery capacity</Text>
            <View style={styles.inputField}>
              <TextInput
                placeholder="Ex : 45kWh"
                placeholderTextColor="#999"
                style={styles.inputText}
              />
            </View>
          </View>

          {/* Continue Button */}
          <Pressable
            style={styles.continueBtn}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.continueText}>continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1F23", // Dark theme background
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  headerTitle: {
    alignSelf: "flex-start",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  brandHero: {
    alignItems: "center",
    marginBottom: 30,
  },
  tagline: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  instructionText: {
    color: "white",
    fontSize: 15,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  formCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Semi-transparent card
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  dropdownField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    justifyContent: "center",
  },
  inputText: {
    flex: 1,
    color: "white",
    fontSize: 14,
  },
  continueBtn: {
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  continueText: {
    color: "white",
    fontSize: 16,
  },
});
