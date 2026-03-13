import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface PaymentDetailsProps {
  amount: string;
  onStartCharging: () => void;
  buttonLabel?: string; 
}

export default function PaymentDetailsCard({ amount, onStartCharging, buttonLabel = "Charging Successful" }: PaymentDetailsProps) {
  // Use local date string for accuracy in your timezone
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
  
  return (
    <View style={styles.card}>
      <Text style={styles.successTitle}>Payment is successful</Text>
      
      <View style={styles.detailsWrapper}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.value}>Rs. {amount}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Method</Text>
          <FontAwesome name="cc-visa" size={20} color="white" />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{dateStr}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.statusSuccess}>Successful</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={onStartCharging}
        activeOpacity={0.7}
      >
        <Text style={styles.actionButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle background makes text easier to read
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.4)', 
    borderRadius: 20, 
    padding: 24, // Slightly more padding for a premium feel
    marginBottom: 20 
  },
  successTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  detailsWrapper: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  label: { color: '#BDC3C7', fontSize: 14 },
  value: { color: 'white', fontSize: 15, fontWeight: '600' },
  statusSuccess: { color: '#00E676', fontSize: 15, fontWeight: 'bold' },
  actionButton: {
    alignSelf: 'center', 
    marginTop: 10, 
    borderWidth: 1, 
    borderColor: 'white', 
    borderRadius: 30, 
    paddingVertical: 14, 
    width: '100%', 
    alignItems: 'center'
  },
  actionButtonText: { color: 'white', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
});