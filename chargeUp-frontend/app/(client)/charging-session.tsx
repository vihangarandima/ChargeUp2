import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChargingSession() {
  const router = useRouter();

  // --- DATABASE LOGIC ---
  const [sessionId, setSessionId] = useState(null);
  const [data, setData] = useState({ timeElapsedMins: 0, amount: 0, pricePerUnit: 20.00 });
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.8.158:5000/api/sessions';

  useEffect(() => {
    fetch(`${API_URL}/start`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => {
        setSessionId(json._id);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to start session:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => {
      fetch(`${API_URL}/${sessionId}`)
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Update failed:", err));
    }, 5000); 

    return () => clearInterval(interval);
  }, [sessionId]);

  const hours = Math.floor(data.timeElapsedMins / 60);
  const minutes = data.timeElapsedMins % 60;

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* 1. Top Brand Header - Consistent with other pages */}
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
            <Text style={styles.cardTitle}>Charging</Text>
            <View style={styles.placeholderSpace}>
              {loading ? (
                <ActivityIndicator size="large" color="#00D1FF" />
              ) : (
                <View style={styles.imagePlaceholder}>
                   <Ionicons name="flash" size={45} color="#00D1FF" />
                   <Text style={{color: '#888', marginTop: 8}}>Vehicle Connected</Text>
                </View>
              )}
            </View>
          </View>

          {/* 4. Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsHeader}>CHARGING DETAILS</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="battery-half-outline" size={20} color="#BDC3C7" />
                <Text style={styles.labelText}>Charging time</Text>
              </View>
              <Text style={styles.valueText}>
                {hours}h {minutes < 10 ? '0' + minutes : minutes} min
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="stats-chart" size={20} color="#BDC3C7" />
                <Text style={styles.labelText}>Price per unit</Text>
              </View>
              <Text style={styles.valueText}>Rs. {data.pricePerUnit.toFixed(2)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="stats-chart" size={20} color="#BDC3C7" />
                <Text style={styles.labelText}>Amount</Text>
              </View>
              <Text style={styles.valueText}>Rs. {data.amount.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.payButton}
              onPress={() => {
                const finalSessionId = sessionId || "DEMO_" + Date.now();
                const finalAmount = data.amount > 0 ? data.amount.toFixed(2) : "100.00";
                
                router.push({
                  pathname: '/payment', 
                  params: { amount: finalAmount, sessionId: finalSessionId }
                });
              }}
            >
              <Text style={styles.payButtonText}>Pay here</Text>
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
    paddingTop: 30 // Pushes everything down for a balanced look
  }, 

  // Brand Header
  brandHeader: { 
    marginBottom: 5 
  },
  brandTitle: { 
    color: 'white', 
    fontSize: 28, // Matches ScanQR and Payment pages
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },

  // Control Row
  controlRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 35 // Space before the charging card
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

  // Cards
  topCard: { 
    backgroundColor: 'transparent', 
    borderRadius: 20, 
    padding: 18, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.25)', 
    marginBottom: 25, 
    height: 170 
  }, 
  cardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  placeholderSpace: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { alignItems: 'center' },
  
  detailsCard: { 
    backgroundColor: 'rgba(255,255,255,0.02)', 
    borderRadius: 20, 
    padding: 22, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.25)', 
    marginTop: 10 
  },
  detailsHeader: { 
    color: '#BDC3C7', 
    fontSize: 10, 
    letterSpacing: 1.2, 
    marginBottom: 18, 
    textTransform: 'uppercase', 
    fontWeight: '600' 
  },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 18 
  },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  labelText: { color: '#E0E0E0', fontSize: 13 },
  valueText: { color: 'white', fontSize: 14, fontWeight: '700' },
  
  // Pay Button
  payButton: { 
    marginTop: 15, 
    alignSelf: 'center', 
    borderWidth: 1, 
    borderColor: '#FFFFFF', 
    backgroundColor: 'transparent', 
    borderRadius: 30, 
    paddingVertical: 12, 
    paddingHorizontal: 60, 
    alignItems: 'center' 
  },
  payButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
});