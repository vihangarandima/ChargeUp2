import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from '@expo/vector-icons';

export default function ChargerInfo() {
  const router = useRouter();
  const { stationName, connectorType, lat, lng } = useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const handleConfirmDate = (date: Date) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(updatedDate);
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (time: Date) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(time.getHours(), time.getMinutes());
    setSelectedDate(updatedDate);
    setTimePickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.brandTitle}>ChargeUp</Text>

        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <View style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={22} color="white" />
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>4</Text></View>
          </View>
        </View>

        <Text style={styles.pageTitle}>Charger info</Text>

        <View style={styles.glassCard}>
          <Text style={styles.cardSectionTitle}>Charger Type</Text>
          <View style={styles.infoRow}><Text style={styles.infoText}>Fast Charger - Single Port</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoText}>30 kW to 75 kW scalable</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoText}>{connectorType || 'Type 2 (Mennekes / IEC 62196-2)'}</Text></View>

          <View style={styles.dateTimeRow}>
            <TouchableOpacity style={[styles.dateTimeBtn, { marginRight: 10 }]} onPress={() => setTimePickerVisibility(true)}>
              <Text style={styles.dateTimeBtnText}>{selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setDatePickerVisibility(true)}>
              <Text style={styles.dateTimeBtnText}>{selectedDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={() => {
            router.push({ pathname: "/bookig-confirmation", params: { stationName, bookingTime: selectedDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) } });
          }}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={() => setDatePickerVisibility(false)} isDarkModeEnabled={true} accentColor="#00D1FF" />
        <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleConfirmTime} onCancel={() => setTimePickerVisibility(false)} isDarkModeEnabled={true} accentColor="#00D1FF" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1D21' },
  scrollContent: { padding: 24, paddingTop: 50, paddingBottom: 40 },
  brandTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  notificationContainer: { position: 'relative', backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12 },
  notifBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#444', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#0B1D21' },
  notifBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  pageTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  glassCard: { backgroundColor: 'rgba(28, 46, 51, 0.7)', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: 'rgba(0, 209, 255, 0.2)' },
  cardSectionTitle: { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 18 },
  infoRow: { backgroundColor: 'rgba(0, 209, 255, 0.08)', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0, 209, 255, 0.15)' },
  infoText: { color: '#BDC3C7', fontSize: 14 },
  dateTimeRow: { flexDirection: 'row', marginTop: 10, marginBottom: 20 },
  dateTimeBtn: { flex: 1, backgroundColor: 'rgba(0, 209, 255, 0.08)', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 209, 255, 0.15)' },
  dateTimeBtnText: { color: '#BDC3C7', fontSize: 14 },
  bookButton: { backgroundColor: 'transparent', paddingVertical: 14, paddingHorizontal: 50, borderRadius: 25, alignSelf: 'center', borderWidth: 1.5, borderColor: 'rgba(0, 209, 255, 0.4)' },
  bookButtonText: { color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
