import React from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // <-- Added import for navigation

export default function HostHomeScreen() {
  const router = useRouter(); // <-- Initialize the router

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Image with 35% opacity */}
      <ImageBackground
        source={require('../../assets/images/car_charging.jpg')}
        style={StyleSheet.absoluteFillObject}
        imageStyle={{ opacity: 0.35 }}
      >
        {/* Dark Gradient Overlay to ensure text readability */}
        <LinearGradient
          colors={['rgba(10, 17, 20, 0.9)', 'rgba(15, 35, 45, 0.7)', 'rgba(10, 17, 20, 0.9)']}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* --- HEADER --- */}
            <Text style={styles.brandText}>ChargeUp</Text>

            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greetingText}>Hello, Ashan</Text>
                <Text style={styles.subtitleText}>Lend Your charger</Text>
              </View>

              <View style={styles.headerIcons}>
                <Pressable style={styles.iconCircle}>
                  <Ionicons name="search" size={20} color="white" />
                </Pressable>

                <Pressable style={styles.iconCircle}>
                  <Ionicons name="notifications-outline" size={20} color="white" />
                  {/* Notification Badge */}
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>4</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* --- MAIN CHARGER CARD --- */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.heroCard}
            >
              {/* Plug Icon Top Right */}
              <MaterialCommunityIcons
                name="power-plug"
                size={28}
                color="white"
                style={styles.plugIcon}
              />

              {/* Placeholder for your 3D Charger image.
                Replace the uri with require('../../assets/images/charger_model.png') if you have it locally downloaded
              */}
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8643/8643034.png' }}
                style={styles.chargerImage}
                resizeMode="contain"
              />
            </LinearGradient>

            {/* --- MANAGE YOUR CHARGER SECTION --- */}
            <Text style={styles.sectionTitle}>Manage Your Charger</Text>

            {/* Added onPress navigation here */}
            <Pressable
              style={styles.listItem}
              onPress={() => router.push('/(host)/manage-charger')}
            >
              <Text style={styles.listItemText}>EVOCK Charging Station</Text>
            </Pressable>

            <Pressable style={styles.listItem}>
              <Ionicons name="add" size={24} color="white" style={styles.addIcon} />
              <Text style={styles.listItemText}>Add a new Charging Station</Text>
            </Pressable>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1114', // Fallback color
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    // Add bottom padding so the list items aren't hidden behind the absolute tab bar
    paddingBottom: 110,
  },

  // Header Styles
  brandText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greetingText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#4A5A60',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0A1114',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Hero Card Styles
  heroCard: {
    width: '100%',
    height: 300,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    position: 'relative',
  },
  plugIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  chargerImage: {
    width: '60%',
    height: '70%',
  },

  // Manage List Styles
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  listItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  addIcon: {
    marginRight: 15,
  },
});