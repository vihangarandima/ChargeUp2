import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const { mode, destLat, destLng, stationName } = useLocalSearchParams();

  const isRouteMode = mode === 'route';

  const stations = [
    { id: '1', name: 'Ekanayake - Boralagamuwa', lat: 6.8401, lng: 79.9112, type: 'Fast' },
    { id: '2', name: 'EVOCK Colombo 07', lat: 6.9067, lng: 79.8707, type: 'Super' },
    { id: '3', name: 'Liberty Plaza Charging', lat: 6.9115, lng: 79.8495, type: 'Rapid' },
  ];

  if (isRouteMode) {
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
          <TouchableOpacity onPress={() => router.back()} style={styles.routeBackBtn}>
            <Ionicons name="chevron-back" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.routeHeaderTitle}>Route Preview</Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={styles.directionBar}>
          <Ionicons name="arrow-up" size={24} color="#333" />
          <Text style={styles.directionText}>Head toward {stationName || 'Charging Station'}</Text>
        </View>
        <MapView
          style={styles.routeMap}
          initialRegion={{ latitude: midLat, longitude: midLng, latitudeDelta: 0.015, longitudeDelta: 0.015 }}
        >
          <Marker coordinate={{ latitude: userLat, longitude: userLng }}>
            <View style={styles.userMarker}><View style={styles.userMarkerInner} /></View>
          </Marker>
          <Marker coordinate={{ latitude: destLatNum, longitude: destLngNum }}>
            <View style={styles.destMarker}><Ionicons name="location" size={32} color="#E74C3C" /></View>
          </Marker>
          <Polyline coordinates={routeCoords} strokeColor="#4A5ACB" strokeWidth={6} lineDashPattern={[0]} />
        </MapView>
        <View style={styles.routeBottomBar}>
          <View style={styles.routeInfoCard}>
            <Ionicons name="navigate" size={20} color="#00D1FF" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.routeInfoTitle}>{stationName || 'Charging Station'}</Text>
              <Text style={styles.routeInfoSub}>Tap for turn-by-turn directions</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.routeStartBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-forward" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
  routeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 55, paddingBottom: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  routeBackBtn: { padding: 4 },
  routeHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  directionBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  directionText: { fontSize: 15, color: '#333', marginLeft: 12 },
  routeMap: { flex: 1 },
  userMarker: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(66, 133, 244, 0.2)', justifyContent: 'center', alignItems: 'center' },
  userMarkerInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4285F4', borderWidth: 2, borderColor: 'white' },
  destMarker: { shadowColor: '#E74C3C', shadowOpacity: 0.4, shadowRadius: 6 },
  routeBottomBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  routeInfoCard: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  routeInfoTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
  routeInfoSub: { fontSize: 12, color: '#888', marginTop: 2 },
  routeStartBtn: { backgroundColor: '#00D1FF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
