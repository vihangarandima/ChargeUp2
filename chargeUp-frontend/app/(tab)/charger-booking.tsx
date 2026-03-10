import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from '@expo/vector-icons';

export default function ChargerBooking() {
  const router = useRouter();
  const { stationName } = useLocalSearchParams();

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
        
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.stationTitle}>{stationName || "Charger Booking"}</Text>
        <Text style={styles.subTitle}>Select your preferred slot</Text>

        <View style={styles.cardContainer}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity 
            style={styles.selectorButton} 
            onPress={() => setDatePickerVisibility(true)}
          >
            <Ionicons name="calendar-outline" size={22} color="#00D1FF" />
            <Text style={styles.selectorText}>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Select Time</Text>
          <TouchableOpacity 
            style={styles.selectorButton} 
            onPress={() => setTimePickerVisibility(true)}
          >
            <Ionicons name="time-outline" size={22} color="#00D1FF" />
            <Text style={styles.selectorText}>
              {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          isDarkModeEnabled={true}
          accentColor="#00D1FF"
        />

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={() => setTimePickerVisibility(false)}
          isDarkModeEnabled={true}
          accentColor="#00D1FF"
        />

        {/* Book Now Button */}
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            // pathname matches your 'bookig-confirmation.tsx' file
            router.push({
              pathname: "/bookig-confirmation", 
              params: { 
                stationName: stationName || "Charging Station",
                bookingTime: selectedDate.toISOString(), 
                lat: "6.9147", 
                lng: "79.8543", 
                connectorType: "Type 2 (Mennekes)"
              }
            });
          }}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1D21' },
  scrollContent: { padding: 25, paddingTop: 60, paddingBottom: 40 },
  backButton: { marginBottom: 20 },
  stationTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  subTitle: { color: '#888', fontSize: 16, marginTop: 5, marginBottom: 30 },
  cardContainer: { 
    backgroundColor: '#1C2E33', 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)' 
  },
  label: { 
    color: '#00D1FF', 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textTransform: 'uppercase' 
  },
  selectorButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)' 
  },
  selectorText: { color: 'white', marginLeft: 15, fontSize: 18, fontWeight: '500' },
  bookButton: { 
    backgroundColor: '#00D1FF', 
    padding: 20, 
    borderRadius: 20, 
    marginTop: 40, 
    alignItems: 'center', 
    shadowColor: "#00D1FF", 
    shadowOpacity: 0.4, 
    shadowRadius: 10, 
    elevation: 5 
  },
  bookButtonText: { color: '#0B1D21', fontSize: 18, fontWeight: 'bold' }
});