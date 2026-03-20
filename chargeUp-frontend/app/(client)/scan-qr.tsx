import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Platform, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ScanQRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanningLocked, setScanningLocked] = useState(false); 

  // FIXED: Ensure this path matches your file structure exactly
  const handleNavigate = (id: string) => {
    router.replace({
      pathname: "/charging-session", 
      params: { chargerId: id }
    });
  };

  const handleStartScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permission Required", "Please allow camera access.");
        return;
      }
    }
    setScanningLocked(false);
    setIsScanning(true);
  };

  const onBarCodeScanned = ({ data }: { data: string }) => {
    if (scanningLocked) return; 

    if (!data.startsWith("CHARGEUP_")) {
      setScanningLocked(true);
      Alert.alert(
        "Invalid Charger", 
        "This QR code is not recognized as a ChargeUp station.",
        [{ text: "TRY AGAIN", onPress: () => setScanningLocked(false) }],
        { cancelable: false }
      );
      return;
    }

    setScanningLocked(true); 
    setIsScanning(false); 
    const scannedContent = data.replace("CHARGEUP_", "");
    handleNavigate(scannedContent === "LATEST" ? "latest" : scannedContent);
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

          <View style={styles.emulatorBypassContainer}>
            {/* The arrow icon is now inside this button for easier emulator navigation */}
            <TouchableOpacity onPress={() => handleNavigate("latest")} style={styles.bypassBtn}>
                <Text style={styles.bypassText}>QUICK CONNECT</Text>
                <Ionicons name="arrow-forward-circle" size={20} color="#00D1FF" />
            </TouchableOpacity>
          </View>

          <View style={styles.qrCardWrapper}>
            {isScanning ? (
              <View style={styles.cameraContainer}>
                <CameraView 
                  style={styles.camera} 
                  facing="back"
                  onBarcodeScanned={scanningLocked ? undefined : onBarCodeScanned}
                  barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                >
                  <div style={styles.overlay}>
                    <View style={styles.unfocusedContainer} />
                    <View style={styles.focusedContainer}>
                      <View style={[styles.corner, styles.topLeft]} />
                      <View style={[styles.corner, styles.topRight]} />
                      <View style={[styles.corner, styles.bottomLeft]} />
                      <View style={[styles.corner, styles.bottomRight]} />
                      <Text style={styles.overlayText}>ALIGN QR CODE</Text>
                    </View>
                    <View style={styles.unfocusedContainer} />
                  </div>
                </CameraView>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsScanning(false)}>
                  <Text style={styles.cancelText}>CANCEL SCAN</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.qrCard} onPress={handleStartScan}>
                <View style={styles.qrInner}>
                  <View style={styles.qrCircle}>
                    <Ionicons name="qr-code-outline" size={80} color="white" />
                  </View>
                  <Text style={styles.scanText}>Tap to Scan QR</Text>
                  <Text style={styles.subScanText}>Scan the code on the ChargeUp unit</Text>
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
  content: { paddingHorizontal: 25, paddingTop: 20 },
  brandHeader: { marginBottom: 8 },
  brandTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  notificationBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 20 },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#555', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 8 },
  titleSection: { marginTop: 5, marginBottom: 10, alignItems: 'center' },
  mainTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  emulatorBypassContainer: { alignItems: 'center', marginVertical: 10 },
  bypassBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,209,255,0.1)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(0,209,255,0.3)' },
  bypassText: { color: '#00D1FF', fontSize: 13, fontWeight: 'bold', marginRight: 8 },
  qrCardWrapper: { alignItems: 'center', marginTop: 5 },
  qrCard: { width: width * 0.85, height: width * 1.0, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  qrInner: { alignItems: 'center' },
  qrCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: '#00D1FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  scanText: { color: 'white', fontSize: 18, fontWeight: '600' },
  subScanText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 8 },
  cameraContainer: { width: width * 0.85, height: width * 1.0, borderRadius: 30, overflow: 'hidden', position: 'relative' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  unfocusedContainer: { flex: 1, width: '100%' },
  focusedContainer: { width: 200, height: 200, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  overlayText: { color: 'white', position: 'absolute', bottom: -40, fontWeight: 'bold', letterSpacing: 1 },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#00D1FF', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  cancelBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'rgba(255, 59, 48, 0.8)', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 25 },
  cancelText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});