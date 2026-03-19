import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PaymentDetailsCard from '@/components/ui/PaymentDetailsCard';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  
  const { amount } = useLocalSearchParams();
  const displayAmount = amount ? (amount as string) : "0.00";

  // FIXED LOGIC: Redirects to the home page
  const handleGoHome = () => {
    // We use .replace so the user can't "go back" to the success screen
    router.replace('/'); 
  };

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          <View style={styles.brandHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          <View style={styles.controlRow}>
            {/* Back button also goes home for safety */}
            <TouchableOpacity onPress={handleGoHome}>
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={20} color="#BDC3C7" />
              <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
            </TouchableOpacity>
          </View>

          <Text style={styles.stationTitle}>EVOCK Charging Station</Text>

          {/* Pass the redirect function and a clearer label */}
          <PaymentDetailsCard 
            amount={displayAmount} 
            onStartCharging={handleGoHome} 
            buttonLabel="Charging Successful" 
          />
          
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 25, 
    paddingTop: 30 
  },
  brandHeader: { marginBottom: 5 },
  brandTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5 },
  controlRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 5,
    marginBottom: 25 
  },
  notificationBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 25, position: 'relative' },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#555', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#163B46' },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  stationTitle: { color: 'white', fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 25 },
});