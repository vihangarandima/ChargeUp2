import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Platform,
  Keyboard,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

// Math Formula to calculate distance between two GPS points in Kilometers
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MapScreen() {
  const router = useRouter();
  const { mode, destLat, destLng, stationName } = useLocalSearchParams();

  const isRouteMode = mode === "route";

  // 🌟 mapRef controls the map camera (zooming/centering)
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [stations, setStations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStationsAndLocation = async () => {
      try {
        // 🚨 REPLACE 192.168.X.X WITH YOUR EXACT WI-FI IP ADDRESS
        const response = await fetch("http://10.159.92.178 :5000/api/chargers");
        const data = await response.json();
        const dbStations: any[] = data.chargers || data;

        // 2. Get User GPS
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission denied");
          setStations(dbStations);
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const currentLat = location.coords.latitude;
        const currentLng = location.coords.longitude;
        setUserLocation({ latitude: currentLat, longitude: currentLng });

        // 3. Calculate distance, filter 15km, and sort by closest!
        const stationsWithDistance = dbStations.map((station: any) => {
          const distance = calculateDistance(
            currentLat,
            currentLng,
            station.location.latitude,
            station.location.longitude,
          );
          return { ...station, distance };
        });

        const nearbyStations = stationsWithDistance
          .filter((station: any) => station.distance <= 15) // 15 KM Radius Limit
          .sort((a: any, b: any) => a.distance - b.distance); // Show closest first

        setStations(nearbyStations);
      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationsAndLocation();
  }, []);

  // 🌟 NEW: Show a loading spinner while waiting for GPS and Database
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#00D1FF" />
        <Text style={{ marginTop: 10 }}>Finding nearby chargers...</Text>
      </View>
    );
  }

  if (isRouteMode) {
    // Standard Route Mode Code
    const destLatNum = parseFloat(destLat as string) || 6.9147;
    const destLngNum = parseFloat(destLng as string) || 79.8543;
    const userLat = destLatNum - 0.005;
    const userLng = destLngNum;
    const routeCoords = [
      { latitude: userLat, longitude: userLng },
      { latitude: userLat + 0.001, longitude: userLng },
      { latitude: userLat + 0.002, longitude: userLng + 0.0005 },
      { latitude: userLat + 0.003, longitude: userLng + 0.0005 },
      { latitude: destLatNum, longitude: destLngNum },
    ];
    const midLat = (userLat + destLatNum) / 2;
    const midLng = (userLng + destLngNum) / 2;

    return (
      <View style={styles.container}>
        <View style={styles.routeHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.routeBackBtn}
          >
            <Ionicons name="chevron-back" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.routeHeaderTitle}>Route Preview</Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={styles.directionBar}>
          <Ionicons name="arrow-up" size={24} color="#333" />
          <Text style={styles.directionText}>
            Head toward {stationName || "Charging Station"}
          </Text>
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
        >
          <Marker coordinate={{ latitude: userLat, longitude: userLng }}>
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
          <Marker coordinate={{ latitude: destLatNum, longitude: destLngNum }}>
            <View style={styles.destMarker}>
              <Ionicons name="location" size={32} color="#E74C3C" />
            </View>
          </Marker>
          <Polyline
            coordinates={routeCoords}
            strokeColor="#4A5ACB"
            strokeWidth={6}
            lineDashPattern={[0]}
          />
        </MapView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        onPress={() => Keyboard.dismiss()} // 🌟 Tapping map closes the keyboard
        onPanDrag={() => Keyboard.dismiss()} // 🌟 Dragging map closes the keyboard
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 6.9271,
          longitude: userLocation ? userLocation.longitude : 79.8612,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {stations.map((station) => (
          <Marker
            key={station._id}
            coordinate={{
              latitude: station.location.latitude,
              longitude: station.location.longitude,
            }}
            title={station.fullName}
            description={`${station.distance.toFixed(1)} km away`}
          >
            <View style={styles.stationMarker}>
              <Ionicons name="flash" size={14} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 🌟 Bottom Station Cards */}
      <View style={styles.cardWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {stations.map((station) => (
            <TouchableOpacity
              key={station._id}
              style={styles.stationCard}
              onPress={() =>
                router.push({
                  pathname: "/station-details",
                  params: {
                    lat: String(station.location.latitude),
                    lng: String(station.location.longitude),
                    distance: String(station.distance.toFixed(1)),
                  },
                })
              }
            >
              <Text style={styles.cardTitle}>{station.fullName}</Text>
              <Text style={styles.cardType}>
                {station.chargerType || "Standard"} Charger
              </Text>
              <View style={styles.cardFooter}>
                <Ionicons name="location" size={14} color="#00D1FF" />
                <Text style={styles.cardDistance}>
                  {station.distance.toFixed(1)} km away
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  map: { width: "100%", height: "100%" },
  stationMarker: {
    backgroundColor: "#E74C3C",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardWrapper: { position: "absolute", bottom: 100, paddingLeft: 20 },
  stationCard: {
    backgroundColor: "#1C2E33",
    width: width * 0.7,
    marginRight: 15,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  cardType: { color: "#00D1FF", fontSize: 12, marginTop: 5 },
  cardFooter: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  cardDistance: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginLeft: 5 },

  // Route Styles
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  routeBackBtn: { padding: 4 },
  routeHeaderTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  directionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  directionText: { fontSize: 15, color: "#333", marginLeft: 12 },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(66, 133, 244, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4285F4",
    borderWidth: 2,
    borderColor: "white",
  },
  destMarker: { shadowColor: "#E74C3C", shadowOpacity: 0.4, shadowRadius: 6 },
  routeBottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  routeInfoCard: { flex: 1, flexDirection: "row", alignItems: "center" },
  routeInfoTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  routeInfoSub: { fontSize: 12, color: "#888", marginTop: 2 },
  routeStartBtn: {
    backgroundColor: "#00D1FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
