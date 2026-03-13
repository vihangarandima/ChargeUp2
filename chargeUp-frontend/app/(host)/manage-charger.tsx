import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HostChargerDetailsScreen() {
  // State to manage the active status of the charger
  const [chargerStatus, setChargerStatus] = useState('available');

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Background Image with 35% opacity */}
        <ImageBackground
          source={require('../../assets/images/car_charging.jpg')}
          style={StyleSheet.absoluteFillObject}
          imageStyle={{ opacity: 0.35 }}
        >
          {/* Dark Gradient Overlay for readability */}
          <LinearGradient
            colors={['rgba(10, 17, 20, 0.9)', 'rgba(15, 35, 45, 0.7)', 'rgba(10, 17, 20, 0.9)']}
            style={StyleSheet.absoluteFillObject}
          />

          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Top Brand Header */}
              <Text style={styles.brandText}>ChargeUp</Text>

              {/* Charger Image Container */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8643/8643034.png' }} // Replace with your local charger image if preferred
                  style={styles.chargerImage}
                  resizeMode="contain"
                />
              </View>

              {/* Main Details Card */}
              <View style={styles.detailsCard}>

                {/* --- CHARGER TYPE SECTION --- */}
                <Text style={styles.sectionTitle}>Charger Type</Text>
                <View style={styles.divider} />

                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>Fast Charger - Single Port</Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>30 kW to 75 kW scalable</Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>CHAdeMO or CCS</Text>
                </View>

                {/* --- STATUS SECTION --- */}
                <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Status</Text>
                <Text style={styles.subtitleText}>Upgrade your Status</Text>
              <View style={styles.statusRow}>
                {/* In-Use Button */}
                <Pressable
                  style={[
                    styles.statusButton,
                    chargerStatus === 'in-use' && styles.statusButtonActive
                  ]}
                  onPress={() => setChargerStatus('in-use')}
                >
                  <Text style={styles.statusTextWhite}>in-use</Text>
                </Pressable>

                {/* Available Button */}
                <Pressable
                  style={[
                    styles.statusButton,
                    chargerStatus === 'available' && styles.statusButtonActive
                  ]}
                  onPress={() => setChargerStatus('available')}
                >
                  <Text style={styles.statusTextGreen}>available</Text>
                </Pressable>

                {/* Unavailable Button */}
                <Pressable
                  style={[
                    styles.statusButton,
                    chargerStatus === 'unavailable' && styles.statusButtonActive
                  ]}
                  onPress={() => setChargerStatus('unavailable')}
                >
                  <Text style={styles.statusTextRed}>unavailable</Text>
                </Pressable>
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1114',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 110, // Clears the custom bottom tab bar
  },
  brandText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // Charger Image
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: 20,
  },
  chargerImage: {
    width: '60%',
    height: '100%',
  },

  // Details Card
  detailsCard: {
    backgroundColor: 'rgba(25, 45, 55, 0.4)', // Translucent card background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    marginBottom: 15,
  },

  // Info Boxes
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
  },

  // Status Section
  subtitleText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  statusButtonActive: {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Highlight active state
  },
  statusTextWhite: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  statusTextGreen: {
    color: '#4CAF50', // Green matching your design
    fontSize: 13,
    fontWeight: '500',
  },
  statusTextRed: {
    color: '#F44336', // Red matching your design
    fontSize: 13,
    fontWeight: '500',
  },
});