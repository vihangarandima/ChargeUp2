import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

// 🔧 Change this to your computer's current Wi-Fi IP address
const API_BASE = "http://10.126.159.178:5000";

export default function StationDetails() {
  const { chargerId, stationName, lat, lng } = useLocalSearchParams();
  const router = useRouter();

  const latitude = lat ? parseFloat(lat as string) : 6.9067;
  const longitude = lng ? parseFloat(lng as string) : 79.8707;

  // 🌟 State for the real charger fetched from the backend
  const [charger, setCharger] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  // ── FETCH the real charger by its MongoDB _id ────────────────────────────────
  useEffect(() => {
    const fetchCharger = async () => {
      if (!chargerId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/api/chargers/${chargerId}`);
        if (response.ok) {
          const data = await response.json();
          setCharger(data);
        }
      } catch (error) {
        console.log("Error fetching charger:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharger();
  }, [chargerId]);

  // ── STATUS colour helper ─────────────────────────────────────────────────────
  const statusColor = (status: string) => {
    if (status === "available") return "#2ECC71";
    if (status === "in-use") return "#F39C12";
    return "#E74C3C"; // unavailable
  };

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        <Marker coordinate={{ latitude, longitude }}>
          <View style={styles.markerDot}>
            <Ionicons name="flash" size={16} color="white" />
          </View>
        </Marker>
      </MapView>

      {/* ChargeUp Header over map */}
      <View style={styles.topHeader}>
        <Text style={styles.brandTitle}>ChargeUp</Text>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <BlurView intensity={80} tint="dark" style={styles.blurContent}>
          <View style={styles.handle} />

          {/* Station name — uses real fullName once loaded */}
          <Text style={styles.mainTitle}>
            {charger?.fullName || stationName || "Charging Station"}
          </Text>

          {isLoading ? (
            // ── LOADING STATE ─────────────────────────────────────────────────
            <ActivityIndicator color="#00D1FF" style={{ marginTop: 30 }} />
          ) : (
            // ── REAL DATA ─────────────────────────────────────────────────────
            <ScrollView
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {charger ? (
                <>
                  {/* ── CHARGER TYPE CARD — tappable to book ── */}
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                      router.push({
                        pathname: "/charger-booking",
                        params: {
                          stationName: charger.fullName,
                          connectorType: charger.chargerType,
                          lat: String(latitude),
                          lng: String(longitude),
                        },
                      })
                    }
                  >
                    <Text style={styles.cardType}>{charger.chargerType}</Text>

                    <View style={styles.footer}>
                      {/* Availability badge — driven by real status from the database */}
                      <View
                        style={[
                          styles.badge,
                          {
                            borderColor: statusColor(
                              charger.status || "available",
                            ),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color: statusColor(charger.status || "available"),
                            },
                          ]}
                        >
                          {charger.status || "available"}
                        </Text>
                      </View>

                      <View style={styles.infoButton}>
                        <Text style={styles.infoText}>Info</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* ── ADDRESS CARD ── */}
                  <View
                    style={[
                      styles.card,
                      { flexDirection: "row", alignItems: "center" },
                    ]}
                  >
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#00D1FF"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={[styles.cardType, { marginBottom: 0 }]}>
                      {charger.address}
                    </Text>
                  </View>

                  {/* ── HOST CARD ── */}
                  <View
                    style={[
                      styles.card,
                      { flexDirection: "row", alignItems: "center" },
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color="#00D1FF"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={[styles.cardType, { marginBottom: 0 }]}>
                      Host: {charger.fullName}
                    </Text>
                  </View>
                </>
              ) : (
                // ── NO DATA FALLBACK ──────────────────────────────────────────
                <View style={styles.card}>
                  <Text style={styles.cardType}>
                    Could not load charger details.
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1D21" },
  map: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  topHeader: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  brandTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  blurContent: {
    flex: 1,
    padding: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 15,
  },
  mainTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  markerDot: {
    backgroundColor: "#E74C3C",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  card: {
    backgroundColor: "rgba(28, 46, 51, 0.85)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardType: { color: "white", fontSize: 15, marginBottom: 15 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  infoButton: {
    backgroundColor: "rgba(58, 75, 78, 0.8)",
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  infoText: { color: "white", fontSize: 12 },
});
