import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function HostChargerDetails() {
  const router = useRouter();

  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [telephone, setTelephone] = useState("");
  const [chargerType, setChargerType] = useState("");

  const handleContinue = () => {
    // Basic validation to ensure they filled it out before moving on
    if (!fullName || !address || !idNumber || !telephone || !chargerType) {
      Alert.alert("Missing Info", "Please fill in all details.");
      return;
    }

    // For now, let's just show a success message!
    // Later, you will plug your backend fetch() back in here.
    Alert.alert("Success!", "Host details saved.");
    // Navigate to your next dashboard or home screen
    // router.push("/home");
  };

  return (
    <LinearGradient
      colors={["#0C161D", "#0E1C24", "#11262F", "#13343A", "#0C3C40"]}
      locations={[0.0, 0.25, 0.5, 0.75, 1.0]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        {/* We use ScrollView so the screen doesn't break on smaller phones when the keyboard opens */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <Text style={styles.headerTitle}>ChargeUp</Text>

          {/* Hero Icon */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              {/* This icon perfectly matches the fuel-pump-with-lightning in your design */}
              <MaterialCommunityIcons name="ev-station" size={90} color="white" />
            </View>
            <Text style={styles.heroText}>Share & Earn</Text>
          </View>

          {/* Form Title */}
          <Text style={styles.formSubtitle}>Add your details here.</Text>

          {/* The Outlined Form Box */}
          <View style={styles.formContainer}>

            {/* Input: Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                selectionColor="white"
              />
            </View>

            {/* Input: Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                selectionColor="white"
              />
            </View>

            {/* Input: ID/Passport */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID/Passport number</Text>
              <TextInput
                style={styles.input}
                value={idNumber}
                onChangeText={setIdNumber}
                selectionColor="white"
              />
            </View>

            {/* Input: Telephone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telephone number</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={telephone}
                onChangeText={setTelephone}
                selectionColor="white"
              />
            </View>

            {/* Input: Charger Type (Mocking a Dropdown) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Charging unit type</Text>
              <View style={styles.dropdownInputContainer}>
                <TextInput
                  style={styles.dropdownInput}
                  placeholder="Ex : Fast charger"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={chargerType}
                  onChangeText={setChargerType}
                  selectionColor="white"
                />
                <Ionicons name="chevron-down-circle" size={20} color="white" style={styles.dropdownIcon} />
              </View>
              
            </View>
            {/* Continue Button Aligned to Right */}
            <View style={styles.buttonRow}>
              <Pressable style={styles.continueBtn} onPress={handleContinue}>
                <Text style={styles.continueBtnText}>continue</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}