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