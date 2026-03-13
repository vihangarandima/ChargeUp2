import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Platform, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// ⬇️ REPLACE THIS WITH YOUR ACTUAL IP
const BACKEND_URL = "http://192.168.8.160:3000/api/charger"; 

export default function ScanQRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

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
    
    try {
      // OPTIONAL: Tell your backend a scan happened
      /*
      await fetch(`${BACKEND_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chargerId: data })
      });
      */

      // Navigate and pass the QR data to the next screen
      router.push({
        pathname: "/charging-session",
        params: { chargerId: data, stationName: "EVOCK Charging Point" }
      });
    } catch (error) {
      Alert.alert("Connection Error", "Could not reach the server.");
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
            <Text style={styles.mainTitle}>Ready to Charge?{"\n"}Scan and Start</Text>
          </View>

          <View style={styles.qrCardWrapper}>
            {isScanning ? (
              <View style={styles.cameraContainer}>
                <CameraView 
                  style={styles.camera} 
                  facing="back"
                  onBarcodeScanned={onBarCodeScanned}
                  barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                />
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsScanning(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.qrCard} onPress={handleStartScan}>
                <View style={styles.qrInner}>
                  <View style={styles.qrCircle}>
                    <Ionicons name="qr-code-outline" size={80} color="white" />
                  </View>
                  <Text style={styles.scanText}>Tap to Scan QR</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footerInfo}>
             <Ionicons name="information-circle-outline" size={20} color="#00D1FF" />
             <Text style={styles.footerText}>Align the QR code within the frame</Text>
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
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  notificationBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 20 },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#555', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 8 },
  titleSection: { marginVertical: 20, alignItems: 'center' },
  mainTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  qrCardWrapper: { alignItems: 'center', marginTop: 20 },
  qrCard: { width: width * 0.85, height: width * 1.0, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  qrInner: { alignItems: 'center' },
  qrCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: '#00D1FF', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  scanText: { color: 'white', fontSize: 18, fontWeight: '500' },
  cameraContainer: { width: width * 0.85, height: width * 1.0, borderRadius: 30, overflow: 'hidden' },
  camera: { flex: 1 },
  cancelBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 25, borderRadius: 20 },
  cancelText: { color: 'white', fontWeight: 'bold' },
  footerInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  footerText: { color: 'rgba(255,255,255,0.6)', marginLeft: 8, fontSize: 14 }
});