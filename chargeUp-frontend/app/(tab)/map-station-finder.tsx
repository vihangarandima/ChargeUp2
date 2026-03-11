import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();

  const stations = [
    { id: '1', name: 'Ekanayake - Boralagamuwa', lat: 6.8401, lng: 79.9112, type: 'Fast' },
    { id: '2', name: 'EVOCK Colombo 07', lat: 6.9067, lng: 79.8707, type: 'Super' },
    { id: '3', name: 'Liberty Plaza Charging', lat: 6.9115, lng: 79.8495, type: 'Rapid' },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.8401,
          longitude: 79.9112,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {stations.map(station => (
          <Marker
            key={station.id}
            coordinate={{ latitude: station.lat, longitude: station.lng }}
            title={station.name}
          >
            <View style={styles.stationMarker}>
              <Ionicons name="flash" size={14} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.cardWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {stations.map((station) => (
            <TouchableOpacity
              key={station.id}
              style={styles.stationCard}
              onPress={() => router.push({
                pathname: "/station-details",
                params: {
                  stationName: station.name,
                  lat: String(station.lat),
                  lng: String(station.lng),
                }
              })}
            >
              <Text style={styles.cardTitle}>{station.name}</Text>
              <Text style={styles.cardType}>{station.type} Charger</Text>
              <View style={styles.cardFooter}>
                <Ionicons name="flash" size={14} color="#00D1FF" />
                <Text style={styles.cardDistance}>Tap for details</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  map: { width: '100%', height: '100%' },
  stationMarker: {
    backgroundColor: '#E74C3C',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardWrapper: { position: 'absolute', bottom: 100, paddingLeft: 20 },
  stationCard: {
    backgroundColor: '#1C2E33',
    width: width * 0.7,
    marginRight: 15,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cardType: { color: '#00D1FF', fontSize: 12, marginTop: 5 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  cardDistance: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginLeft: 5 },
});
