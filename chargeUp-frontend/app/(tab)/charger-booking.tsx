import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function ChargerBooking() {
  const router = useRouter();
  const { stationName } = useLocalSearchParams();

  // State for Date and Time Pickers
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.brandTitle}>ChargeUp</Text>
        </View>

        <Text style={styles.stationTitle}>{stationName || "Charger Booking"}</Text>
        <Text style={styles.subTitle}>Select your preferred slot</Text>

        {/* Date and Time Selection Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity 
            style={styles.selectorButton} 
            onPress={() => setDatePickerVisibility(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#00D1FF" style={{ marginRight: 10 }} />
            <Text style={styles.selectorText}>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Select Time</Text>
          <TouchableOpacity 
            style={styles.selectorButton} 
            onPress={() => setTimePickerVisibility(true)}
          >
            <Ionicons name="time-outline" size={20} color="#00D1FF" style={{ marginRight: 10 }} />
            <Text style={styles.selectorText}>
              {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date/Time Picker Modals */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          isDarkModeEnabled={true}
        />

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={() => setTimePickerVisibility(false)}
          isDarkModeEnabled={true}
        />

        {/* Action Button: Redirects to booking-confirm.tsx */}
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            // Formatting the date string so the confirmation page can split it by ','
            const formattedTime = `${selectedDate.toLocaleDateString()},${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            router.push({
              pathname: "/booking-confirm", // UPDATED: Redirects to booking-confirm.tsx
              params: { 
                stationName: stationName || "Charging Station",
                bookingTime: formattedTime, // Sends: "12/05/2026,04:00 PM"
              }
            });
          }}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B1D21',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  scrollContent: { padding: 25, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  brandTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  backButton: { padding: 5 },
  stationTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  subTitle: { color: '#888', fontSize: 16, marginTop: 5, marginBottom: 30 },
  cardContainer: { 
    backgroundColor: '#1C2E33', 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(0, 209, 255, 0.1)' 
  },
  label: { 
    color: '#00D1FF', 
    fontSize: 12, 
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
  selectorText: { color: 'white', fontSize: 16 },
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
  bookButtonText: { color: '#0B1D21', fontSize: 18, fontWeight: 'bold' },
});