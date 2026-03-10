import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaymentPage() {
  const router = useRouter();
  
  // --- DATABASE LOGIC ---
  const { amount, sessionId } = useLocalSearchParams(); 
  const API_BASE_URL = 'http://192.168.8.158:5000/api/sessions'; 
  
  const [isProcessing, setIsProcessing] = useState(false);
  const displayAmount = amount ? parseFloat(amount as string).toFixed(2) : "0.00";

  const handleSimulatedPayment = async () => {
    setIsProcessing(true); 
    try {
      const response = await fetch(`${API_BASE_URL}/complete/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalAmount: displayAmount })
      });

      if (response.ok) {
        setIsProcessing(false);
        Alert.alert(
          "Payment Successful", 
          `Transaction of Rs. ${displayAmount} was completed!`
        );
        router.replace('/(client)/(tabs)');
      } else {
        throw new Error("Failed to update session status");
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Error", "Could not reach the server to finalize payment.");
    }
  };

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* 1. Top Brand Header - Bigger & Lowered */}
          <View style={styles.brandHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          {/* 2. Control Row */}
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={20} color="#BDC3C7" />
              <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
            </TouchableOpacity>
          </View>

          {/* 3. Station Title */}
          <Text style={styles.stationTitle}>EVOCK Charging Station</Text>

          {/* 4. Payment Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Choose payment method</Text>

            <TouchableOpacity style={styles.paymentMethodRow}>
              <View style={styles.rowLeft}>
                <View style={styles.visaBox}><Text style={styles.visaText}>VISA</Text></View>
                <Text style={styles.methodText}>HNB Debit Card -5525</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentMethodRow}>
              <View style={styles.rowLeft}>
                <View style={styles.visaBox}><Text style={styles.visaText}>VISA</Text></View>
                <Text style={styles.methodText}>DFCC Debit Card -7225</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentMethodRow}>
              <View style={styles.rowLeft}>
                <Ionicons name="add" size={20} color="white" style={{marginRight: 10}} />
                <Text style={styles.methodText}>Add a New Card</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="white" />
            </TouchableOpacity>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amountValue}>Rs. {displayAmount}</Text>
            </View>

            <TouchableOpacity style={styles.paymentMethodRow}>
              <View style={styles.rowLeft}>
                <FontAwesome5 name="percent" size={14} color="white" style={{marginRight: 12, marginLeft: 5}} />
                <Text style={styles.methodText}>0 Offers Available</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="white" />
            </TouchableOpacity>

            {isProcessing ? (
              <ActivityIndicator size="large" color="#00D1FF" style={{marginTop: 20}} />
            ) : (
              <TouchableOpacity 
                style={styles.payButton} 
                onPress={handleSimulatedPayment}
              >
                <Text style={styles.payButtonText}>Pay here</Text>
              </TouchableOpacity>
            )}
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
    paddingTop: 30 // Aligns with your Scan and Booking pages
  },
  
  // Brand Header
  brandHeader: { 
    marginBottom: 5 
  },
  brandTitle: { 
    color: 'white', 
    fontSize: 28, 
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },

  // Control Row
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

  // Card & Rows
  card: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.4)', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20 
  },
  cardHeader: { color: 'white', fontSize: 14, marginBottom: 20 },
  paymentMethodRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.3)', 
    borderRadius: 30, 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    marginBottom: 15 
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  visaBox: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: 'white', 
    paddingHorizontal: 5, 
    paddingVertical: 2, 
    borderRadius: 4, 
    marginRight: 15 
  },
  visaText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  methodText: { color: 'white', fontSize: 13 },
  
  amountContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 20, 
    paddingHorizontal: 5 
  },
  amountLabel: { color: '#BDC3C7', fontSize: 14 },
  amountValue: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  
  payButton: { 
    alignSelf: 'center', 
    marginTop: 15, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: 'white', 
    borderRadius: 30, 
    paddingVertical: 12, 
    paddingHorizontal: 60 
  },
  payButtonText: { color: 'white', fontSize: 14 },
});