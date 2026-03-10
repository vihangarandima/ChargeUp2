import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HostDetailsScreen() {
  const router = useRouter();

  // State to hold the form data
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [telephone, setTelephone] = useState("");
  const [chargingType, setChargingType] = useState("");

  const handleContinue = () => {
    console.log("Saving Host Data...");
    // 🚀 Once they fill this out, we send them to the main app dashboard!
    router.replace("/(tab)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top Header */}
          <Text style={styles.brandTitle}>ChargeUp</Text>

          {/* Center Icon & Title */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="ev-station" size={80} color="white" />
            <Text style={styles.shareText}>Share & Earn</Text>
          </View>

          <Text style={styles.instructionText}>Add your details here.</Text>

          {/* The Big Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>ID/Passport number</Text>
            <TextInput
              style={styles.input}
              value={idNumber}
              onChangeText={setIdNumber}
            />

            <Text style={styles.label}>Telephone number</Text>
            <TextInput
              style={styles.input}
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Charging unit type</Text>
            <View style={styles.pickerInput}>
              <TextInput
                style={{ flex: 1, color: "white" }}
                placeholder="Ex : Fast charger"
                placeholderTextColor="#999"
                value={chargingType}
                onChangeText={setChargingType}
              />
              <Ionicons name="chevron-down-circle" size={20} color="white" />
            </View>

            {/* Continue Button */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5B6A73", // Matching your dark greyish-blue background
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  brandTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  shareText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  instructionText: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
  },
  formCard: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "transparent",
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
    color: "white",
  },
  pickerInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
  },
  buttonRow: {
    alignItems: "flex-end", // Pushes the button to the right side
    marginTop: 30,
  },
  continueBtn: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
  continueText: {
    color: "white",
    fontSize: 16,
  },
});
