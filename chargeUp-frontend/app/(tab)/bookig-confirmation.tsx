import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function BookingConfirmation() {
  const router = useRouter();
  const { stationName, bookingTime, connectorType, lat, lng } = useLocalSearchParams();

  const latitude = lat ? parseFloat(lat as string) : 6.9147;
  const longitude = lng ? parseFloat(lng as string) : 79.8543;

  const destinationCoords = { latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 };

  const timePart = bookingTime?.toString().split(',')[1]?.trim() || "4:00 pm";
  const datePart = bookingTime?.toString().split(',')[0]?.trim() || "12/05/2026";

  const handleNavigate = () => {
    router.push({
      pathname: "/map-station-finder",
      params: {
        mode: 'route',
        destLat: String(latitude),
        destLng: String(longitude),
        stationName: stationName as string,
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.brandTitle}>ChargeUp</Text>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <View style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={22} color="white" />
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>4</Text></View>
          </View>
        </View>

        <Text style={styles.headerTitle}>Booking Confirmed</Text>

        <View style={styles.glassCard}>
          <Text style={styles.cardSectionTitle}>Charger Type</Text>
          <View style={styles.infoRow}><Text style={styles.infoText}>Fast Charger - Single Port</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoText}>30 kW to 75 kW scalable</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoText}>{connectorType || 'Type 2 (Mennekes / IEC 62196-2)'}</Text></View>
          <View style={styles.dateTimeRow}>
            <View style={[styles.dateTimeBox, { marginRight: 10 }]}><Text style={styles.dateTimeText}>{timePart}</Text></View>
            <View style={styles.dateTimeBox}><Text style={styles.dateTimeText}>{datePart}</Text></View>
          </View>
        </View>

        <Text style={styles.directionHeader}>Direction</Text>
        <TouchableOpacity style={styles.mapWrapper} activeOpacity={0.9} onPress={handleNavigate}>
          <MapView
            style={styles.map}
            initialRegion={destinationCoords}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={destinationCoords}>
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={32} color="#E74C3C" />
              </View>
            </Marker>
          </MapView>
          <View style={styles.mapOverlay}>
            <Ionicons name="navigate-circle" size={18} color="#0B1D21" />
            <Text style={styles.overlayText}>Tap to Navigate</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneButton} onPress={() => router.replace('/')}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1D21' },
  scrollContent: { padding: 24, paddingTop: 50, paddingBottom: 40 },
  brandTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 25 },
  notificationContainer: { position: 'relative', backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12 },
  notifBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#444', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#0B1D21' },
  notifBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  glassCard: { backgroundColor: 'rgba(28, 46, 51, 0.7)', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: 'rgba(0, 209, 255, 0.15)' },
  cardSectionTitle: { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 18 },
  infoRow: { backgroundColor: 'rgba(0, 209, 255, 0.08)', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0, 209, 255, 0.15)' },
  infoText: { color: '#BDC3C7', fontSize: 14 },
  dateTimeRow: { flexDirection: 'row', marginTop: 8 },
  dateTimeBox: { flex: 1, backgroundColor: 'rgba(0, 209, 255, 0.08)', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 209, 255, 0.15)' },
  dateTimeText: { color: '#BDC3C7', fontSize: 14 },
  directionHeader: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  mapWrapper: { height: 200, width: '100%', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 209, 255, 0.2)' },
  map: { flex: 1 },
  markerContainer: { shadowColor: "#E74C3C", shadowOpacity: 0.5, shadowRadius: 8 },
  mapOverlay: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#00D1FF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  overlayText: { color: '#0B1D21', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  doneButton: { backgroundColor: '#00D1FF', padding: 18, borderRadius: 18, marginTop: 30, alignItems: 'center' },
  doneButtonText: { color: '#0B1D21', fontSize: 18, fontWeight: 'bold' },
});
