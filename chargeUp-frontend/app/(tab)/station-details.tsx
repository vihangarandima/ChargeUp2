import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export default function StationDetails() {
  const { stationName } = useLocalSearchParams(); // Catch the name from Map
  const router = useRouter();

  const connectors = [
    { id: "1", type: "Type 2 (Mennekes / IEC 62196-2)", status: "available" },
    { id: "2", type: "CHAdeMO", status: "unavailable" },
    { id: "3", type: "CCS (Combined Charging System)", status: "unavailable" },
  ];

  return (
    <View style={styles.container}>
      {/* Background/Blur Container */}
      <BlurView intensity={90} tint="dark" style={styles.bottomSheet}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-down" size={30} color="white" />
          </TouchableOpacity>
          {/* DYNAMIC TITLE based on your selection */}
          <Text style={styles.mainTitle}>
            {stationName || "Charging Station"}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {connectors.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              // Pass the name again to the final Charger Info page
              onPress={() =>
                router.push({
                  pathname: "/charger-booking",
                  params: { stationName: stationName },
                })
              }
            >
              <Text style={styles.cardType}>{item.type}</Text>
              <View style={styles.footer}>
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor:
                        item.status === "available" ? "#2ECC71" : "#E74C3C",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color:
                          item.status === "available" ? "#2ECC71" : "#E74C3C",
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <View style={styles.infoButton}>
                  <Text style={styles.infoText}>Info</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1D21" },
  bottomSheet: {
    flex: 1,
    marginTop: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  header: { alignItems: "center", marginBottom: 25 },
  mainTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(28, 46, 51, 0.8)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
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
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  infoButton: {
    backgroundColor: "#3A4B4E",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
  },
  infoText: { color: "white", fontSize: 12 },
});
