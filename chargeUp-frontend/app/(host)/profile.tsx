import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/(client)'); 
        },
      },
    ]);
  };

  const menuItems = [
    { label: 'My Profile', onPress: () => {} },
    { label: 'My Vehicle', onPress: () => {} },
    { label: 'Lending details', onPress: () => {} },
    { label: 'History', onPress: () => {} },
    { label: 'Log Out', onPress: handleLogout },
  ];

  return (
    <View style={styles.container}>
      {/* Dark background matching your theme */}
      <View style={styles.backgroundFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header */}
          <View style={styles.topHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          {/* Page Title */}
          <Text style={styles.pageTitle}>My Profile</Text>

          {/* Profile Details Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={50} color="#000" />
              </View>
              {/* Camera Icon Badge */}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color="white" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Leo Sutton</Text>
              <Text style={styles.profileEmail}>leoSutton@gmail.com</Text>
              <Text style={styles.profilePhone}>077 123 5678</Text>
            </View>
          </View>

          {/* Menu Items (Glassy Pill Buttons) */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuButtonWrapper}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#2A3F4C', '#13222A']} // 3D gradient look
                  style={styles.menuPill}
                >
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color="rgba(255,255,255,0.4)" 
                    style={styles.chevron} 
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#0A1114', // Very dark base
  },
  backgroundFill: {
    flex: 1,
    width: '100%',
  },
  safeArea: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingTop: 15, 
    paddingBottom: 120 
  },
  
  // Header
  topHeader: {
    marginBottom: 5,
  },
  brandTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pageTitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },

  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 25,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#050B0D',
  },
  profileInfo: { 
    justifyContent: 'center' 
  },
  profileName: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '500', 
    marginBottom: 6 
  },
  profileEmail: { 
    color: '#D1D5DB', 
    fontSize: 12, 
    marginBottom: 6,
    textDecorationLine: 'underline', 
  },
  profilePhone: { 
    color: '#D1D5DB', 
    fontSize: 12, 
  },

  // Menu Pills
  menuContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  menuButtonWrapper: {
    marginBottom: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  menuPill: {
    borderRadius: 25,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuLabel: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: '400' 
  },
  chevron: {
    position: 'absolute',
    right: 20, 
  },
});