import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function LocationPicker() {
  const router = useRouter();
  const mapRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Default to Colombo, Sri Lanka
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // --- GET USER LOCATION (Manual Trigger Only) ---
  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to find your current spot.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setSelectedLocation(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      console.log("Error getting location", error);
    }
  };

  // --- ZOOM IN AND OUT ---
  const handleZoom = (direction) => {
    const zoomMultiplier = direction === "in" ? 0.5 : 2;
    const newRegion = {
      ...selectedLocation,
      latitudeDelta: selectedLocation.latitudeDelta * zoomMultiplier,
      longitudeDelta: selectedLocation.longitudeDelta * zoomMultiplier,
    };
    setSelectedLocation(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
  };

  // --- SEARCH LOCATION ---
  const handleSearch = () => {
    if (!searchQuery) return;
    Alert.alert("Search", `Searching for: ${searchQuery}`);
  };

  const handleMapPress = (event) => {
    setSelectedLocation({
      ...selectedLocation,
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  const handleSelectLocation = () => {
    Alert.alert("Location Set!", "Your charger's location has been fixed.", [
      {
        text: "OK",
        onPress: () => {
          router.replace("/(host)/home");
        }
      }
    ]);
  };