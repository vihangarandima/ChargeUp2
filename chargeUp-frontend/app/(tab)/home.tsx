import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const router = useRouter();

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }} // Space for floating tab bar
    >
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hello, Manul</Text>
          <Text style={styles.headerSub}>Ready to charge your EV?</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={20} color="white" />
            <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Main Vehicle Card with Battery Progress */}
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleLabel}>
            <Ionicons name="flash" size={16} color="#00D1FF" />
            <Text style={styles.vehicleLabelText}>BYD Seal</Text>
          </View>
          <Text style={styles.batteryPercentage}>85%</Text>
        </View>

        <Image 
          source={{ uri: 'https://www.byd.com/content/dam/byd-site/overseas/products/seal/seal-white.png' }} 
          style={styles.vehicleImage}
          resizeMode="contain"
        />

        {/* Custom Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '85%' }]} />
        </View>
        <Text style={styles.rangeText}>Remaining Range: 420 km</Text>
      </View>

      {/* 3. Quick Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push("/map-station-finder")}
      >
        <Text style={styles.searchText}>Quick Search for Chargers</Text>
      </TouchableOpacity>

      {/* 4. Nearby Stations Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Stations</Text>
        <TouchableOpacity onPress={() => router.push("/map-station-finder")}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      
      {/* Station Card 1 */}
      <TouchableOpacity
        style={styles.stationCard}
        onPress={() => router.push({
          pathname: "/station-details",
          params: { stationName: 'Charge Point Station', lat: '6.9067', lng: '79.8707' }
        })}
      >
        <View style={styles.stationInfo}>
          <View>
            <Text style={styles.stationName}>Charge Point Station</Text>
            <View style={styles.stationDetails}>
              <Ionicons name="location" size={14} color="#00D1FF" />
              <Text style={styles.detailText}> 1.2 km away</Text>
              <Ionicons name="time-outline" size={14} color="#00D1FF" style={{marginLeft: 10}} />
              <Text style={styles.detailText}> 5 mins</Text>
            </View>
            <Text style={styles.ratingText}>⭐ 4.8 (28 reviews)</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Available</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Station Card 2 */}
      <TouchableOpacity
        style={styles.stationCard}
        onPress={() => router.push({
          pathname: "/station-details",
          params: { stationName: 'EVOCK Colombo 07', lat: '6.9067', lng: '79.8707' }
        })}
      >
        <View style={styles.stationInfo}>
          <View>
            <Text style={styles.stationName}>EVOCK Colombo 07</Text>
            <View style={styles.stationDetails}>
              <Ionicons name="location" size={14} color="#00D1FF" />
              <Text style={styles.detailText}> 3.5 km away</Text>
              <Ionicons name="time-outline" size={14} color="#00D1FF" style={{marginLeft: 10}} />
              <Text style={styles.detailText}> 12 mins</Text>
            </View>
            <Text style={styles.ratingText}>⭐ 4.6 (42 reviews)</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Available</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1F23', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 50, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  headerSub: { color: '#CCC', fontSize: 14 },
  headerIcons: { flexDirection: 'row', gap: 10 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#1C2E33', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#FF3B30', borderRadius: 8, paddingHorizontal: 4 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  
  // Vehicle Card Styles
  vehicleCard: { backgroundColor: '#132A2F', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 30, padding: 20, shadowColor: '#00D1FF', shadowOpacity: 0.2, shadowRadius: 10 },
  vehicleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vehicleLabel: { flexDirection: 'row', alignItems: 'center' },
  vehicleLabelText: { color: 'white', fontSize: 18, fontWeight: '600', marginLeft: 8 },
  batteryPercentage: { color: '#00D1FF', fontSize: 20, fontWeight: 'bold' },
  vehicleImage: { width: '100%', height: 140, marginVertical: 10 },
  progressContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, width: '100%', marginTop: 10 },
  progressBar: { height: '100%', backgroundColor: '#00D1FF', borderRadius: 3 },
  rangeText: { color: '#CCC', fontSize: 12, marginTop: 10, textAlign: 'center' },

  searchBar: { height: 55, borderRadius: 15, borderWidth: 2, borderColor: '#FF0000', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  searchText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 },
  sectionTitle: { color: 'white', fontSize: 22, fontWeight: '600' },
  seeAll: { color: '#00D1FF', fontSize: 14 },
  
  stationCard: { backgroundColor: '#132A2F', borderRadius: 20, padding: 20, marginTop: 15, borderBottomWidth: 4, borderBottomColor: '#00D1FF' },
  stationInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  stationName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  stationDetails: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  detailText: { color: '#CCC', fontSize: 12 },
  ratingText: { color: '#CCC', fontSize: 12, marginTop: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(46, 204, 113, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ECC71', marginRight: 5 },
  statusText: { color: '#2ECC71', fontSize: 12, fontWeight: 'bold' }
});