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
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function LocationPicker() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);

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
        Alert.alert(
          "Permission Denied",
          "Allow location access to find your current spot.",
        );
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
  const handleZoom = (direction: string) => {
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

  // --- HANDLE SELECT LOCATION (POPUP & ROUTING) ---
  // --- HANDLE SELECT LOCATION (POPUP & ROUTING) ---
  const handleSelectLocation = async () => {
    // 1. Bundle everything together for the backend!
    const finalChargerData = {
      fullName: params.fullName,
      address: params.address,
      idNumber: params.idNumber,
      phone: params.phone,
      chargerType: params.chargerType,
      location: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
    };

    // 2. Log it so you can see it working!
    console.log("🚀 READY FOR BACKEND:", finalChargerData);

    try {
      // 2. The API Call! (Replace YOUR_IP_ADDRESS with your computer's actual Wi-Fi IP and 5000 with your server port)
      const response = await fetch("http://10.241.115.178:5000/api/chargers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalChargerData),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. If the server says "Success!", show the popup and navigate
        Alert.alert(
          "Location Saved!",
          "Your charger's location has been successfully set in the database.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/(host)/host-home");
              },
            },
          ],
        );
      } else {
        // Handle backend errors (like missing data)
        Alert.alert(
          "Error Saving Charger",
          data.message || "Something went wrong.",
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert(
        "Network Error",
        "Could not connect to the server. Check your connection.",
      );
    }
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
          <Ionicons
            name="search"
            size={20}
            color="#8A9A9D"
            style={styles.searchIcon}
          />
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
          <Pressable
            style={styles.controlButton}
            onPress={() => handleZoom("in")}
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.controlButton}
            onPress={() => handleZoom("out")}
          >
            <Ionicons name="remove" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Bottom Action Area */}
      <View style={styles.bottomPanel}>
        <Text style={styles.instructionText}>
          Drag the pin or tap the map to set the exact location of your charger.
        </Text>

        <Pressable
          style={styles.selectLocationButton}
          onPress={handleSelectLocation}
        >
          <Text style={styles.selectLocationText}>Select Location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1114",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 17, 20, 0.85)",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  mapControls: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "rgba(10, 17, 20, 0.85)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  controlButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: "100%",
  },

  // --- CUSTOM MARKER STYLES ---
  customMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
  },
  markerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#7BB1BA",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#7BB1BA",
    transform: [{ rotate: "180deg" }],
    marginTop: -2,
  },

  // --- BOTTOM PANEL STYLES ---
  bottomPanel: {
    backgroundColor: "#0A1114",
    padding: 25,
    paddingBottom: Platform.OS === "ios" ? 100 : 90,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  instructionText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  selectLocationButton: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    paddingVertical: 14,
    backgroundColor: "rgba(10, 17, 20, 0.8)",
    alignItems: "center",
    width: "100%",
  },
  selectLocationText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
