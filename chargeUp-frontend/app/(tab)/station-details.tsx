import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

export default function StationDetails() {
  const { stationName, lat, lng } = useLocalSearchParams();
  const router = useRouter();

  const latitude = lat ? parseFloat(lat as string) : 6.9067;
  const longitude = lng ? parseFloat(lng as string) : 79.8707;

  const connectors = [
    { id: '1', type: 'Type 2 (Mennekes / IEC 62196-2)', status: 'available' },
    { id: '2', type: 'CHAdeMO', status: 'unavailable' },
    { id: '3', type: 'CCS (Combined Charging System)', status: 'unavailable' },
  ];

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
          <Text style={styles.mainTitle}>{stationName || "Charging Station"}</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {connectors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/charger-booking",
                    params: { stationName: stationName },
                  })
                }
              >
                <Text style={styles.cardType}>{item.type}</Text>
                <View style={styles.footer}>
                  <View style={[styles.badge, { borderColor: item.status === 'available' ? '#2ECC71' : '#E74C3C' }]}>
                    <Text style={[styles.badgeText, { color: item.status === 'available' ? '#2ECC71' : '#E74C3C' }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1D21' },
  map: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  brandTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  blurContent: {
    flex: 1,
    padding: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  mainTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  markerDot: {
    backgroundColor: '#E74C3C',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  card: {
    backgroundColor: 'rgba(28, 46, 51, 0.85)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardType: { color: 'white', fontSize: 15, marginBottom: 15 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  infoButton: {
    backgroundColor: 'rgba(58, 75, 78, 0.8)',
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  infoText: { color: 'white', fontSize: 12 },
});
