import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps"; // Only works on Native
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function MapScreen() {
  const router = useRouter();

  const stations = [
    {
      id: "1",
      name: "Ekanayake - Boralagamuwa",
      lat: 6.8401,
      lng: 79.9112,
      type: "Fast",
    },
    {
      id: "2",
      name: "EVOCK Colombo 07",
      lat: 6.9067,
      lng: 79.8707,
      type: "Super",
    },
    {
      id: "3",
      name: "Liberty Plaza Charging",
      lat: 6.9115,
      lng: 79.8495,
      type: "Rapid",
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.8401,
          longitude: 79.9112,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{ latitude: station.lat, longitude: station.lng }}
            title={station.name}
          />
        ))}
      </MapView>

      <View style={styles.cardWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {stations.map((station) => (
            <TouchableOpacity
              key={station.id}
              style={styles.stationCard}
              // Redirects to details and passes the name
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/station-details",
                  params: { stationName: station.name },
                })
              }
            >
              <Text style={styles.cardTitle}>{station.name}</Text>
              <Text style={styles.cardType}>{station.type} Charger</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
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
});
