import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

export default function StationDetails() {
  const { stationName, lat, lng, chargerType } = useLocalSearchParams();
  const router = useRouter();

  const latitude = lat ? parseFloat(lat as string) : 6.9067;
  const longitude = lng ? parseFloat(lng as string) : 79.8707;

  // 🌟 DYNAMIC CHARGER TYPE APPLIED HERE (Fallback to Type 2 if missing)
  const connectors = [
    { id: '1', type: chargerType || 'Type 2 (Mennekes / IEC 62196-2)', status: 'available' },
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

      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartBtn}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Details */}
      <View style={styles.bottomSheet}>
        <BlurView intensity={80} tint="dark" style={styles.blurContent}>
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.mainTitle}>{stationName || "EVOCK Charging Station"}</Text>

            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#00D1FF" style={{ width: 25 }} />
                <Text style={styles.infoText}>123 Green Way, Colombo 03</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="navigate-outline" size={20} color="#00D1FF" style={{ width: 25 }} />
                <Text style={styles.infoText}>2.4 km away from your location</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Available Connectors</Text>

            {connectors.map((item) => (
              <View key={item.id} style={styles.connectorCard}>
                <View style={styles.connectorLeft}>
                  <Ionicons name="flash" size={24} color="#00D1FF" />
                  <View style={{ marginLeft: 15 }}>
                    <Text style={styles.connectorType}>{item.type}</Text>
                    <Text style={styles.connectorPower}>Max 50 kW</Text>
                  </View>
                </View>

                <View style={[styles.statusBadge, item.status === 'unavailable' && styles.statusUnavailable]}>
                  <Text style={[styles.statusText, item.status === 'unavailable' && { color: '#E74C3C' }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.routeBtn}
              onPress={() => router.push({
                pathname: "/map",
                params: {
                  mode: 'route',
                  destLat: String(latitude),
                  destLng: String(longitude),
                  stationName: stationName as string,
                }
              })}
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text style={styles.routeBtnText}>Route</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bookBtn}
              onPress={() => router.push({
                pathname: "/charger-booking",
                params: {
                  stationName: stationName as string,
                  lat: String(latitude),
                  lng: String(longitude),
                }
              })}
            >
              <Text style={styles.bookBtnText}>Book Charger</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    flex: 1,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  connectorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  connectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectorType: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  connectorPower: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.5)',
  },
  statusUnavailable: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderColor: 'rgba(231, 76, 60, 0.5)',
  },
  statusText: {
    color: '#2ECC71',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  routeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: '#00D1FF',
    height: 50,
    borderRadius: 25,
    gap: 8,
  },
  routeBtnText: {
    color: '#00D1FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00D1FF',
    height: 50,
    borderRadius: 25,
  },
  bookBtnText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});