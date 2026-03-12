import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, StatusBar } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LocationPicker() {
  const router = useRouter();

  // Default to a central location in Sri Lanka (Colombo area)
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const handleMapPress = (event) => {
    // Update the marker when the user taps the map
    setSelectedLocation({
      ...selectedLocation,
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  const handleConfirmLocation = () => {
    // Here you would eventually save this location to your database
    console.log("Location confirmed:", selectedLocation);

    // Send the user to their new dashboard!
    router.push("/(host)/home"); // Or whatever your host dashboard file is named
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Set Charger Location</Text>
      </View>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={selectedLocation}
          onPress={handleMapPress}
          // Optional: A custom dark map style array would go here
        >
          {/* Draggable Marker */}
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
          />
        </MapView>
      </View>

      {/* Bottom Action Area */}
      <View style={styles.bottomPanel}>
        <Text style={styles.instructionText}>
          Drag the pin or tap the map to set the exact location of your charger.
        </Text>
        <Pressable style={styles.confirmButton} onPress={handleConfirmLocation}>
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C161D", // Dark theme background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  bottomPanel: {
    backgroundColor: "#11262F",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, // Overlaps the map slightly
  },
  instructionText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },