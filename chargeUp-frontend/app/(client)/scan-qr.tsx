import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Platform, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ScanQRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permission Required", "Please allow camera access.");
        return;
      }
    }
    setIsScanning(true);
  };

  const onBarCodeScanned = async ({ data }: { data: string }) => {
    setIsScanning(false);
    setIsVerifying(true); 
    
    try {
      const response = await fetch("http://192.168.8.160:5000/api/sessions/start", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chargerId: data })
      });
      
      const result = await response.json();
      setIsVerifying(false);

      if (result.success) {
        router.push({
          pathname: "/charging-session",
          params: { 
            chargerId: result.chargerId, 
            sessionId: result.sessionId,
            pricePerUnit: result.pricePerUnit 
          }
        });
      } else {
        Alert.alert("Error", "Invalid Charger QR Code.");
      }
    } catch (error) {
      setIsVerifying(false);
      console.error("Backend connection failed:", error);
      Alert.alert(
        "Network Error", 
        "Could not connect to the server. Did you update the IP address in scan-qr.tsx?"
      );
    }
  };

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          <View style={styles.brandHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          <View style={styles.controlRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color="rgba(255,255,255,0.7)" />
              <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
            </TouchableOpacity>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Successfully Reach{"\n"}your Destination</Text>
          </View>

          <View style={styles.stationContainer}>
            <Text style={styles.stationName}>EVOCK Charging Station</Text>
            <TouchableOpacity 
              style={styles.nextArrowBtn} 
              onPress={() => onBarCodeScanned({ data: "DEMO-CHARGER-01" })}
            >
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.evBadge}><Text style={styles.evBadgeText}>EV</Text></View>

          <View style={styles.qrCardWrapper}>
            {isVerifying ? (
              <View style={styles.qrCard}>
                <ActivityIndicator size="large" color="#00D1FF" />
                <Text style={{color: 'white', marginTop: 15}}>Verifying with Server...</Text>
              </View>
            ) : isScanning ? (
              <View style={styles.cameraContainer}>
                <CameraView 
                  style={styles.camera} 
                  facing="back"
                  onBarcodeScanned={onBarCodeScanned}
                  barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                />
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsScanning(false)}>
                  <Text style={styles.cancelText}>Cancel Scan</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.qrCard} onPress={handleStartScan}>
                <View style={styles.qrInner}>
                  <View style={styles.qrCircle}>
                    <Ionicons name="qr-code-outline" size={80} color="white" />
                  </View>
                  <Text style={styles.scanText}>Scan the QR Code</Text>
                </View>
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
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  content: { paddingHorizontal: 25, paddingTop: 30 }, 
  brandHeader: { marginBottom: 8 },
  brandTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, marginBottom: 15 },
  notificationBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 20 },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#555', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 8 },
  titleSection: { marginTop: 10, alignItems: 'center' },
  mainTitle: { color: 'white', fontSize: 21, fontWeight: 'bold', textAlign: 'center', lineHeight: 28 },
  stationContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  stationName: { color: 'white', fontSize: 22, fontWeight: '500' },
  nextArrowBtn: { marginLeft: 10, backgroundColor: 'rgba(255,255,255,0.1)', padding: 5, borderRadius: 15 },
  evBadge: { alignSelf: 'center', backgroundColor: 'rgba(0, 209, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 2, borderRadius: 4, marginTop: 5 },
  evBadgeText: { color: '#00D1FF', fontSize: 14, fontWeight: 'bold' },
  qrCardWrapper: { alignItems: 'center', marginTop: 30 },
  qrCard: { width: width * 0.85, height: width * 1.05, borderRadius: 25, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  qrInner: { alignItems: 'center' },
  qrCircle: { width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  scanText: { color: 'white', fontSize: 22, fontWeight: '500' },
  cameraContainer: { width: width * 0.85, height: width * 1.05, borderRadius: 25, overflow: 'hidden', backgroundColor: 'black' },
  camera: { flex: 1 },
  cancelBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'rgba(255, 0, 0, 0.7)', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 },
  cancelText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});