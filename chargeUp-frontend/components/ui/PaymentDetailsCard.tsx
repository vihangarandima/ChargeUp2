import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface PaymentDetailsProps {
  amount: string;
  onStartCharging: () => void;
}

export default function PaymentDetailsCard({ amount, onStartCharging }: PaymentDetailsProps) {
  // You can make these dynamic later, but hardcoding for visual match right now!
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '/');
  
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
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>5 : 25 PM</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>1 h 33 min</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.statusSuccess}>Successful</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onStartCharging}>
        <Text style={styles.actionButtonText}>Start charging</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.4)', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20 
  },
  successTitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  detailsWrapper: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#BDC3C7', // Exact gray from your amountLabel
    fontSize: 14,
  },
  value: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statusSuccess: {
    color: '#00E676', // Bright green for success
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    alignSelf: 'center', 
    marginTop: 10, 
    marginBottom: 5, 
    borderWidth: 1, 
    borderColor: 'white', 
    borderRadius: 30, 
    paddingVertical: 12, 
    width: '100%', // Makes it stretch nicely inside the card
    alignItems: 'center'
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
  },
});