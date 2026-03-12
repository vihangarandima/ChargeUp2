import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PaymentDetailsCard from '@/components/ui/PaymentDetailsCard';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  
  // 1. Capture the amount passed from the Payment WebView logic
  const { amount } = useLocalSearchParams();
  
  // 2. Format the amount for display (defaults to 0.00 if something goes wrong)
  const displayAmount = amount ? parseFloat(amount as string).toFixed(2) : "0.00";

  // ✅ This function correctly handles the navigation back to the Home/Scan screen
  const handleReturnHome = () => {
    console.log("Payment flow complete. Returning to Home...");
    // .replace ensures the user cannot swipe back into the payment success screen
    router.replace('/'); 
  };

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* 1. Brand Header */}
          <View style={styles.brandHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          {/* 2. Top Navigation/Notification Row */}
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={handleReturnHome}>
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={20} color="#BDC3C7" />
              <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
            </TouchableOpacity>
          </View>

          {/* 3. Station Info */}
          <Text style={styles.stationTitle}>EVOCK Charging Station</Text>

          {/* 4. Success Receipt Card 
               Ensure PaymentDetailsCard uses 'amount' and 'onStartCharging' props! 
          */}
          <PaymentDetailsCard 
            amount={displayAmount} 
            onStartCharging={handleReturnHome} 
          />
          
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={80} color="#00D1FF" />
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 15 }}>
               Payment Successful
            </Text>
            <Text style={{ color: '#BDC3C7', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
               Your transaction was completed successfully. Your charger has been deactivated.
            </Text>
          </View>

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
  brandHeader: { 
    marginBottom: 5 
  },
  brandTitle: { 
    color: 'white', 
    fontSize: 28, 
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },
  controlRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 5,
    marginBottom: 25 
  },
  notificationBtn: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 10, 
    borderRadius: 25, 
    position: 'relative' 
  },
  badge: { 
    position: 'absolute', 
    top: -2, 
    right: -2, 
    backgroundColor: '#555', 
    width: 16, 
    height: 16, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#163B46' 
  },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  stationTitle: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 25 
  },
});