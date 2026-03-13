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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Set Charger Location</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={selectedLocation}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Custom Draggable Marker matching your design */}
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            draggable
            onDragEnd={(e) => {
              setSelectedLocation({
                ...selectedLocation,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          >
            <View style={styles.customMarkerContainer}>
              <View style={styles.markerCircle}>
                <View style={styles.markerDot} />
              </View>
              <View style={styles.markerPointer} />
            </View>
          </Marker>
        </MapView>

        {/* Floating Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8A9A9D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city or address..."
            placeholderTextColor="#8A9A9D"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {/* Floating Map Controls */}
        <View style={styles.mapControls}>
          <Pressable style={styles.controlButton} onPress={getUserLocation}>
            <MaterialIcons name="my-location" size={22} color="white" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.controlButton} onPress={() => handleZoom("in")}>
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.controlButton} onPress={() => handleZoom("out")}>
            <Ionicons name="remove" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Bottom Action Area */}
      <View style={styles.bottomPanel}>
        <Text style={styles.instructionText}>
          Drag the pin or tap the map to set the exact location of your charger.
        </Text>

        <Pressable style={styles.selectLocationButton} onPress={handleSelectLocation}>
          <Text style={styles.selectLocationText}>Select Location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}