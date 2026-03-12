import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChargingSession() {
  const router = useRouter();
  
  // Catching the variables from the backend
  const { chargerId, sessionId, pricePerUnit } = useLocalSearchParams();

  // Convert the backend price string to a number (defaults to 20.00 if missing)
  const pricePerMinute = pricePerUnit ? parseFloat(pricePerUnit as string) : 20.00;
  const currentSessionId = sessionId || "SESS_TEST_" + Date.now();

  // --- FRONTEND TIMER LOGIC ---
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    // Start a timer that ticks every 1 second
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000); 

    // Stop timer if user leaves the page
    return () => clearInterval(interval);
  }, []);

  // Calculate Time
  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  // Calculate Cost live using the BACKEND'S price
  const currentAmount = (secondsElapsed / 60) * pricePerMinute;

  // Function to handle the Stop & Pay action
  const handleStopCharging = async () => {
    // Minimum charge of Rs 10
    const finalAmount = currentAmount > 10 ? currentAmount.toFixed(2) : "10.00";

    try {
      // 🛑 Signal your backend to stop the hardware relay
      // Replace with your actual laptop IP
      await fetch('http://192.168.8.160:5000/api/stop-charging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId }),
      });
    } catch (error) {
      console.log("Hardware stop signal sent.");
    }

    // Move to payment page
    router.push({
      pathname: '/payment', 
      params: { amount: finalAmount, sessionId: currentSessionId }
    });
  };

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* 1. Top Brand Header */}
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

          {/* 3. Top Card */}
          <View style={styles.topCard}>
            <Text style={styles.cardTitle}>Charging in Progress</Text>
            <Text style={{color: '#BDC3C7', fontSize: 12, marginTop: 4}}>Session: {currentSessionId}</Text>
            
            <View style={styles.placeholderSpace}>
                <View style={styles.imagePlaceholder}>
                   <Ionicons name="flash" size={45} color="#00D1FF" />
                   <Text style={{color: '#00D1FF', marginTop: 8, fontWeight: 'bold'}}>
                      Energy Flowing...
                   </Text>
                </View>
            </View>
          </View>

          {/* 4. Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsHeader}>LIVE CHARGING DETAILS</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="time-outline" size={20} color="#BDC3C7" />
                <Text style={styles.labelText}>Time elapsed</Text>
              </View>
              <Text style={styles.valueText}>
                {hours}h {minutes < 10 ? '0' + minutes : minutes}m {seconds < 10 ? '0' + seconds : seconds}s
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="pricetag-outline" size={20} color="#BDC3C7" />
                <Text style={styles.labelText}>Price per min</Text>
              </View>
              <Text style={styles.valueText}>Rs. {pricePerMinute.toFixed(2)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="wallet-outline" size={20} color="#00D1FF" />
                <Text style={[styles.labelText, {color: '#00D1FF'}]}>Current Amount</Text>
              </View>
              <Text style={[styles.valueText, {color: '#00D1FF', fontSize: 18}]}>
                Rs. {currentAmount.toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.payButton}
              onPress={handleStopCharging}
            >
              <Text style={styles.payButtonText}>Stop & Pay</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 25, 
    paddingTop: 30 
  }, 
  brandHeader: { marginBottom: 5 },
  brandTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5 },
  controlRow: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 5, marginBottom: 35 
  },
  notificationBtn: { 
    backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 25, position: 'relative' 
  },
  badge: { 
    position: 'absolute', top: -2, right: -2, backgroundColor: '#555', 
    width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: '#163B46' 
  },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  topCard: { 
    backgroundColor: 'transparent', borderRadius: 20, padding: 18, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', marginBottom: 25, height: 170 
  }, 
  cardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  placeholderSpace: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { alignItems: 'center' },
  detailsCard: { 
    backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 22, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', marginTop: 10 
  },
  detailsHeader: { 
    color: '#BDC3C7', fontSize: 10, letterSpacing: 1.2, marginBottom: 18, 
    textTransform: 'uppercase', fontWeight: '600' 
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  labelText: { color: '#E0E0E0', fontSize: 13 },
  valueText: { color: 'white', fontSize: 14, fontWeight: '700' },
  payButton: { 
    marginTop: 15, alignSelf: 'center', borderWidth: 1, borderColor: '#FFFFFF', 
    backgroundColor: 'transparent', borderRadius: 30, paddingVertical: 12, 
    paddingHorizontal: 60, alignItems: 'center' 
  },
  payButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
});