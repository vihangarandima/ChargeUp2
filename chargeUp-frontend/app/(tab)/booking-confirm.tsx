import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Platform, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

/**
 * BOOKING CONFIRMATION SCREEN
 * This screen displays the success state after a user books a charger.
 * It shows the charger type, time/date, and an interactive map for navigation.
 */
export default function BookingConfirmation() {
  const router = useRouter();
  
  // 1. DATA EXTRACTION
  const { stationName, bookingTime } = useLocalSearchParams();

  // 2. COORDINATES
  const destinationCoords = {
    latitude: 6.9147,
    longitude: 79.8543,
    latitudeDelta: 0.005, 
    longitudeDelta: 0.005,
  };

  /**
   * 3. NAVIGATION LOGIC
   */
  const handleNavigate = () => {
    const { latitude, longitude } = destinationCoords;
    const label = stationName || "EV Charging Station";

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`
    });

    Linking.canOpenURL(url!).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
      } else {
        Alert.alert("Navigation Error", "Could not find a map app to open.");
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Confirmed</Text>
          <View style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
          </View>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.glassCard}>
          <Text style={styles.cardSectionTitle}>{stationName || "Charger Type"}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Fast Charger - Single Port</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>30 kW to 75 kW scalable</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Type 2 (Mennekes / IEC 62196-2)</Text>
          </View>
          
          {/* Time and Date Display */}
          <View style={styles.dateTimeRow}>
            <View style={[styles.infoBox, { marginRight: 10 }]}>
              <Text style={styles.infoText}>{bookingTime?.toString().split(',')[1] || "4:00 pm"}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{bookingTime?.toString().split(',')[0] || "12/05/2026"}</Text>
            </View>
          </View>
        </View>

        {/* MAP SECTION */}
        <Text style={styles.directionHeader}>Direction</Text>
        <TouchableOpacity 
          style={styles.mapWrapper} 
          activeOpacity={0.9} 
          onPress={handleNavigate}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={destinationCoords}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={destinationCoords}>
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={32} color="#00D1FF" />
              </View>
            </Marker>
          </MapView>
          
          <View style={styles.mapOverlay}>
            <Ionicons name="navigate-circle" size={20} color="#0B1D21" />
            <Text style={styles.overlayText}>Tap to Navigate</Text>
          </View>
        </TouchableOpacity>

        {/* ACTION BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.qrButton]}
            onPress={() => router.push('/scan-qr')}
          >
            <Ionicons name="qr-code-outline" size={20} color="#0B1D21" style={{marginRight: 8}} />
            <Text style={styles.buttonText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.doneButton]}
            onPress={() => router.replace('/(tab)')}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1D21',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0B1D21',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  glassCard: {
    backgroundColor: 'rgba(28, 46, 51, 0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardSectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  infoRow: {
    backgroundColor: '#2A3C41',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#2A3C41',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center'
  },
  infoText: {
    color: '#BDC3C7',
    fontSize: 14,
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  directionHeader: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 15,
  },
  mapWrapper: {
    height: 220,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 209, 255, 0.3)',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    shadowColor: "#00D1FF",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#00D1FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  overlayText: {
    color: '#0B1D21',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  qrButton: {
    backgroundColor: '#00D1FF',
    marginRight: 10,
  },
  doneButton: {
    backgroundColor: '#00D1FF',
  },
  buttonText: {
    color: '#0B1D21',
    fontSize: 16,
    fontWeight: 'bold',
  },
});