import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  Modal, // <-- Added Modal
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// List of available charger types
const CHARGER_TYPES = [
  "Standard 3-Pin Plug (13A)",
  "Commando Socket (16A/32A)",
  "Type 1 (J1772) - AC",
  "Type 2 (Mennekes) - AC",
  "CHAdeMO - DC Fast",
  "CCS2 - DC Fast",
  "Tesla Proprietary",
  "Other",
];

export default function HostDetailsScreen() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [chargerType, setChargerType] = useState("");

  // State to control the dropdown modal
  const [isModalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/host/host-charger-details.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header */}
          <View style={styles.topHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          {/* Icon & Title Section */}
          <View style={styles.titleSection}>
            <MaterialCommunityIcons name="ev-station" size={60} color="white" />
            <Text style={styles.pageTitle}>Share & Earn</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Add your details here.</Text>

          {/* Main Form Box */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                selectionColor="white"
              />
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                selectionColor="white"
              />
            </View>

            {/* ID/Passport */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID/Passport number</Text>
              <TextInput
                style={styles.input}
                value={idNumber}
                onChangeText={setIdNumber}
                selectionColor="white"
              />
            </View>

            {/* Telephone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telephone number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                selectionColor="white"
              />
            </View>

            {/* Charging Unit Type (Custom Dropdown UI) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Charging unit type</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.dropdownInput}
                onPress={() => setModalVisible(true)} // <-- Opens the modal
              >
                <Text style={[styles.dropdownPlaceholder, chargerType && { color: "white" }]}>
                  {chargerType ? chargerType : "Ex : Fast charger"}
                </Text>
                <Ionicons
                  name="chevron-down-circle"
                  size={20}
                  color="#E0E0E0"
                />
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.continueButton}
                onPress={() => router.push("/(host)/location-picker")}
              >
                <Text style={styles.continueButtonText}>continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* --- ADDED DROPDOWN MODAL --- */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Charger Type</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {CHARGER_TYPES.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    setChargerType(type);
                    setModalVisible(false); // Close modal after selection
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    chargerType === type && { color: "#7BB1BA", fontWeight: "bold" } // Highlight selected
                  ]}>
                    {type}
                  </Text>
                  {chargerType === type && (
                    <Ionicons name="checkmark-circle" size={20} color="#7BB1BA" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    paddingTop: 15,
    paddingBottom: 40,
  },

  // Header
  topHeader: {
    marginBottom: 20,
  },
  brandTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  // Title Section
  titleSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  pageTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },

  // Subtitle
  subtitle: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },

  // Form Container
  formContainer: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)", // Slight tint to see the box better
  },

  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 15,
    color: "white",
    backgroundColor: "rgba(10, 17, 20, 0.5)",
  },

  // Custom Dropdown
  dropdownInput: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 15,
    backgroundColor: "rgba(10, 17, 20, 0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownPlaceholder: {
    color: "#8A9A9D", // Matches the faded text in your screenshot
    fontSize: 14,
  },

  // Button
  buttonRow: {
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  continueButton: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    backgroundColor: "rgba(10, 17, 20, 0.5)",
  },
  continueButtonText: {
    color: "white",
    fontSize: 14,
  },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end", // Slides up from bottom
  },
  modalContent: {
    backgroundColor: "#11262F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    maxHeight: "60%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  modalOptionText: {
    color: "white",
    fontSize: 16,
  },
  modalCloseBtn: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)"
  },
  modalCloseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});