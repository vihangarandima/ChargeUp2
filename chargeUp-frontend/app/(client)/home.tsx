import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

// 🌟 MATH FORMULA: Calculates distance between two GPS coordinates in Kilometers
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

export default function Dashboard() {
  const router = useRouter();

  const [userName, setUserName] = useState("");

  // 🌟 NEW STATE: Vehicle Details from AsyncStorage
  const [vehicleName, setVehicleName] = useState("Loading Vehicle...");
  const [vehicleCapacity, setVehicleCapacity] = useState("--");

  // 🌟 DYNAMIC STATE: Holds the real stations from your MongoDB Backend
  const [nearbyStations, setNearbyStations] = useState<any[]>([]);
  const [loadingStations, setLoadingStations] = useState(true);

  useEffect(() => {
    // 1. Load User Name
    AsyncStorage.getItem("userName").then((name) => {
      if (name) setUserName(name);
    });

    // 2. Load Vehicle Details
    const loadVehicleDetails = async () => {
      try {
        const brand = await AsyncStorage.getItem("vehicleBrand");
        const model = await AsyncStorage.getItem("vehicleModel");
        const capacity = await AsyncStorage.getItem("vehicleCapacity");

        if (brand && model) {
          setVehicleName(`${brand} ${model}`); // Ex: "BYD Atto 3"
        } else {
          setVehicleName("BYD Seal"); // Fallback if nothing was saved
        }

        if (capacity && capacity !== "Standard") {
          // If they typed "45", add "kWh". If they typed "45kWh", use it.
          const formattedCapacity = capacity.toLowerCase().includes("kw") ? capacity : `${capacity}kWh`;
          setVehicleCapacity(formattedCapacity);
        } else {
          setVehicleCapacity("85%"); // Fallback default
        }
      } catch (error) {
        console.error("Failed to load vehicle details", error);
      }
    };

    loadVehicleDetails();

    // 3. Fetch Backend Stations & Calculate Radius
    const fetchNearbyStations = async () => {
      try {
        // A. Ask user for GPS Permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission denied for location");
          setLoadingStations(false);
          return;
        }

        // B. Get User's Exact Location
        let location = await Location.getCurrentPositionAsync({});
        const currentLat = location.coords.latitude;
        const currentLng = location.coords.longitude;

        // C. Fetch all stations from your Backend Controller
        // NOTE: Ensure this IP matches your actual backend server IP!
        const response = await fetch("http://10.146.186.178:5000/api/chargers");
        const data = await response.json();

        // Ensure we are working with an array
        const dbStations: any[] = Array.isArray(data)
          ? data
          : data.chargers || [];

        // D. Calculate exact distance for every station in the database
        const stationsWithDistance = dbStations.map((station: any) => {
          const distance = calculateDistance(
            currentLat,
            currentLng,
            station.location.latitude,
            station.location.longitude,
          );
          return { ...station, distance };
        });

        // E. Filter stations within 15km, sort by closest, and keep the top 3
        const filteredStations = stationsWithDistance
          .filter((station: any) => station.distance <= 15)
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, 3);

        setNearbyStations(filteredStations);
      } catch (error) {
        console.error("❌ Error fetching stations from Backend:", error);
      } finally {
        setLoadingStations(false);
      }
    };

    fetchNearbyStations();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/car_charging.jpg")}
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── 1. HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              Hello, {userName || "there"}{" "}
            </Text>
            <Text style={styles.headerSub}>Ready to charge your EV?</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="notifications-outline" size={20} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>4</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 2. VEHICLE CARD ── */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <View style={styles.vehicleLabel}>
              <Ionicons name="flash" size={16} color="#00D1FF" />
              {/* 🌟 DYNAMIC VEHICLE NAME */}
              <Text style={styles.vehicleLabelText}>{vehicleName}</Text>
            </View>
            {/* 🌟 DYNAMIC BATTERY CAPACITY */}
            <Text style={styles.batteryPercentage}>{vehicleCapacity}</Text>
          </View>
          <Image
            source={{
              uri: "https://www.byd.com/content/dam/byd-site/overseas/products/seal/seal-white.png",
            }}
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>

        {/* ── 3. QUICK SEARCH ── */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/map-station-finder")}
        >
          <Text style={styles.searchText}>Quick Search for Chargers</Text>
        </TouchableOpacity>

        {/* ── 4. SECTION HEADER ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Stations</Text>
          <TouchableOpacity onPress={() => router.push("/map-station-finder")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* 🌟 5. DYNAMIC BACKEND STATION CARDS ── */}
        {loadingStations ? (
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#00D1FF" />
            <Text style={{ color: "#00D1FF", marginTop: 10 }}>
              Finding real chargers from Vault...
            </Text>
          </View>
        ) : nearbyStations.length > 0 ? (
          nearbyStations.map((station, index) => {
            // Rough time estimate to drive there (~40km/h average city speed)
            const timeMins = Math.max(
              1,
              Math.round((station.distance / 40) * 60),
            );

            return (
              <View key={station._id || index} style={styles.stationCard}>
                <View style={styles.stationInfo}>
                  <Text style={styles.stationName} numberOfLines={1}>
                    {station.fullName}
                  </Text>

                  {/* Assuming newly created stations are Available by default */}
                  <View style={styles.statusBadge}>
                    <View style={styles.dot} />
                    <Text style={styles.statusText}>Available</Text>
                  </View>
                </View>

                <View style={styles.stationDetails}>
                  <Ionicons name="location" size={14} color="#00D1FF" />
                  <Text style={styles.detailText}>
                    {" "}
                    {station.distance ? station.distance.toFixed(1) : "0"} km
                    away
                  </Text>

                  <Ionicons
                    name="car-outline"
                    size={14}
                    color="#00D1FF"
                    style={{ marginLeft: 15 }}
                  />
                  <Text style={styles.detailText}> ~{timeMins} mins</Text>

                  <Ionicons
                    name="flash-outline"
                    size={14}
                    color="#00D1FF"
                    style={{ marginLeft: 15 }}
                  />
                  <Text style={styles.detailText}>
                    {" "}
                    {station.chargerType || "Type 2"}
                  </Text>
                </View>

                {/* Fallback to fake rating since backend doesn't support reviews yet */}
                <Text style={styles.ratingText}>⭐ 4.8 (New Station)</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.viewDetailsBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/station-details",
                        params: {
                          stationName: station.fullName,
                          lat: String(station.location?.latitude),
                          lng: String(station.location?.longitude),
                        },
                      })
                    }
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={[styles.stationCard, { alignItems: "center" }]}>
            <Text style={styles.stationName}>
              No chargers found within 15km.
            </Text>
            <Text style={styles.detailText}>
              Tap Quick Search to check the map.
            </Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── LAYOUT ──────────────────────────────────
  background: {
    flex: 1,
    backgroundColor: "#0D1F23",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ── HEADER ──────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSub: {
    color: "#CCC",
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#1C2E33",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  // ── VEHICLE CARD ────────────────────────────
  vehicleCard: {
    backgroundColor: "rgba(10, 30, 45, 0.95)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(0, 180, 220, 0.5)",
    marginTop: 30,
    padding: 20,
    shadowColor: "#00D1FF",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleLabelText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  batteryPercentage: {
    color: "#00D1FF",
    fontSize: 20,
    fontWeight: "bold",
  },
  vehicleImage: {
    width: "100%",
    height: 140,
    marginVertical: 10,
  },

  // ── QUICK SEARCH ────────────────────────────
  searchBar: {
    height: 55,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FF0000",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  searchText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // ── SECTION HEADER ──────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  seeAll: {
    color: "#00D1FF",
    fontSize: 14,
  },

  // ── STATION CARD ────────────────────────────
  stationCard: {
    backgroundColor: "rgba(10, 30, 45, 0.95)",
    borderRadius: 20,
    padding: 18,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: "rgba(0, 180, 220, 0.5)",
    shadowColor: "#00D1FF",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  stationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  stationName: {
    color: "#E8F4F8",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  stationDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailText: {
    color: "#90B4BE",
    fontSize: 13,
  },
  ratingText: {
    color: "#90B4BE",
    fontSize: 12,
    marginTop: 6,
  },

  // ── STATUS : Available ───────────────────────
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(32, 178, 120, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(32, 178, 120, 0.4)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#20B278",
    marginRight: 5,
  },
  statusText: {
    color: "#4ECFA0",
    fontSize: 12,
    fontWeight: "600",
  },

  // ── STATUS : Busy ────────────────────────────
  statusBadgeBusy: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(220, 70, 70, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(220, 70, 70, 0.4)",
  },
  dotBusy: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#DC4646",
    marginRight: 5,
  },
  statusTextBusy: {
    color: "#F07070",
    fontSize: 12,
    fontWeight: "600",
  },

  // ── ACTION BUTTONS ───────────────────────────
  cardActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  viewDetailsBtn: {
    flex: 1,
    height: 42,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#00D1FF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  viewDetailsText: {
    color: "#00D1FF",
    fontSize: 14,
    fontWeight: "600",
  },
  bookBtn: {
    flex: 1,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
  },
  bookBtnDisabled: {
    backgroundColor: "rgba(100, 100, 100, 0.5)",
  },
  bookText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});