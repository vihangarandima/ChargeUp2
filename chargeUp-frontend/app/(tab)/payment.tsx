import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, StatusBar, Modal } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import md5 from 'md5';

// --- YOUR PAYHERE SANDBOX CREDENTIALS ---
const MERCHANT_ID = "1234373"; 
const MERCHANT_SECRET = "NjkyNzU0MjMwMjk5NTIyNDYxNTM3MTcyMjU1NjQzNzcxMjAxODU2"; 

const BACKEND_URL = "http://192.168.8.160:5000"; 

export default function PaymentPage() {
  const router = useRouter();
  const { amount, sessionId } = useLocalSearchParams(); 
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayHere, setShowPayHere] = useState(false);
  
  // 1. Ensure Amount is always exactly 2 decimal places (Critical for Hash)
  const displayAmount = amount ? parseFloat(amount as string).toFixed(2) : "10.00";

  // 2. Force a unique Session ID for every attempt to avoid "Duplicate Order ID" declines
  // This adds a random 3-digit number to the end of your session ID
  const safeSessionId = (sessionId ? String(sessionId).trim() : "SESS_" + Date.now()) + "_" + Math.floor(Math.random() * 999);

  const safeMerchantId = MERCHANT_ID.trim();
  const safeSecret = MERCHANT_SECRET.trim();
  const safeAmount = displayAmount;

  const generateHash = () => {
    const hashedSecret = md5(safeSecret).toUpperCase();
    const currency = 'LKR';
    
    // The order and format here must be 100% exact
    const hashString = safeMerchantId + safeSessionId + safeAmount + currency + hashedSecret;
    const finalHash = md5(hashString).toUpperCase();

    console.log("DEBUG: Hash String ->", hashString);
    console.log("DEBUG: Generated Hash ->", finalHash);
    
    return finalHash;
  };

  const checkoutHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body onload="document.getElementById('payhere-form').submit();">
        <form id="payhere-form" method="post" action="https://sandbox.payhere.lk/pay/checkout">   
            <input type="hidden" name="merchant_id" value="${safeMerchantId}">
            <input type="hidden" name="return_url" value="http://chargeup.local/success">
            <input type="hidden" name="cancel_url" value="http://chargeup.local/cancel">
            <input type="hidden" name="notify_url" value="http://chargeup.local/notify">  
            <input type="hidden" name="order_id" value="${safeSessionId}">
            <input type="hidden" name="items" value="EV Charging Session">
            <input type="hidden" name="currency" value="LKR">
            <input type="hidden" name="amount" value="${safeAmount}">  
            <input type="hidden" name="hash" value="${generateHash()}">
            <input type="hidden" name="first_name" value="Test">
            <input type="hidden" name="last_name" value="User">
            <input type="hidden" name="email" value="test@example.com">
            <input type="hidden" name="phone" value="0771234567">
            <input type="hidden" name="address" value="No.1, Galle Road">
            <input type="hidden" name="city" value="Colombo">
            <input type="hidden" name="country" value="Sri Lanka">
        </form>
      </body>
    </html>
  `;

  const handleNavigationChange = async (navState: any) => {
    if (navState.url.includes('chargeup.local/success')) {
      setShowPayHere(false);
      setIsProcessing(true);

      try {
        await fetch(`${BACKEND_URL}/api/stop-charging`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sessionId: safeSessionId,
            status: 'paid'
          }),
        });
      } catch (error) {
        console.error("Hardware Stop Request Failed:", error);
      }

      setIsProcessing(false);
      router.push({
        pathname: '/payment-success',
        params: { amount: safeAmount, sessionId: safeSessionId }
      });

    } else if (navState.url.includes('chargeup.local/cancel')) {
      setShowPayHere(false);
      alert('Payment was cancelled.');
    }
  };

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Modal visible={showPayHere} animationType="slide" onRequestClose={() => setShowPayHere(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0B1315' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPayHere(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Secure Checkout</Text>
          </View>
          <WebView 
            originWhitelist={['*']}
            source={{ html: checkoutHTML }}
            onNavigationStateChange={handleNavigationChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={{ flex: 1 }}
          />
        </SafeAreaView>
      </Modal>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.brandHeader}><Text style={styles.brandTitle}>ChargeUp</Text></View>
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={26} color="white" /></TouchableOpacity>
          </View>

          <Text style={styles.stationTitle}>EVOCK Charging Station</Text>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Choose payment method</Text>
            <View style={styles.paymentMethodRow}>
                <View style={styles.rowLeft}>
                    <View style={styles.visaBox}><Text style={styles.visaText}>VISA</Text></View>
                    <Text style={styles.methodText}>Pay with PayHere</Text>
                </View>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amountValue}>Rs. {safeAmount}</Text>
            </View>

            {isProcessing ? (
              <ActivityIndicator size="large" color="#00D1FF" />
            ) : (
              <TouchableOpacity style={styles.payButton} onPress={() => setShowPayHere(true)}>
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
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 30 },
  brandHeader: { marginBottom: 5 },
  brandTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  controlRow: { flexDirection: 'row', marginBottom: 25 },
  stationTitle: { color: 'white', fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 25 },
  card: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 20, padding: 20 },
  cardHeader: { color: 'white', fontSize: 14, marginBottom: 20 },
  paymentMethodRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 30, padding: 12, marginBottom: 15 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  visaBox: { borderWidth: 1, borderColor: 'white', paddingHorizontal: 5, borderRadius: 4, marginRight: 15 },
  visaText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  methodText: { color: 'white', fontSize: 13 },
  amountContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  amountLabel: { color: '#BDC3C7' },
  amountValue: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  payButton: { alignSelf: 'center', borderWidth: 1, borderColor: 'white', borderRadius: 30, paddingVertical: 12, paddingHorizontal: 60 },
  payButtonText: { color: 'white', fontWeight: 'bold' },
  modalHeader: { padding: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1315' },
  modalTitle: { color: 'white', marginLeft: 15, fontSize: 18, fontWeight: 'bold' },
});