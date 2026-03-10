import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function ChargerInfo() {
  const router = useRouter();
  const { stationName } = useLocalSearchParams();

  // 1. STATE: To store the selected date/time and toggle the popups
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // 2. HANDLERS: Logic for when the user picks a date or time
  const handleConfirmDate = (date: Date) => {
    // Preserve the current time but update the date
    const updatedDate = new Date(selectedDate);
    updatedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(updatedDate);
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (time: Date) => {
    // Preserve the current date but update the hours and minutes
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(time.getHours(), time.getMinutes());
    setSelectedDate(updatedDate);
    setTimePickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.stationTitle}>{stationName || "Charger Information"}</Text>
        <Text style={styles.subTitle}>Select your preferred slot</Text>

        <View style={styles.cardContainer}>
          {/* DATE SELECTOR BUTTON */}
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity 
            style={styles.selectorButton} 
            onPress={() => setDatePickerVisibility(true)}
          >
            <Ionicons name="calendar-outline" size={22} color="#00D1FF" />
            <Text style={styles.selectorText}>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* TIME SELECTOR BUTTON */}
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

        {/* 3. THE PICKER MODALS */}
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

        {/* BOOK NOW BUTTON */}
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            router.push({
              pathname: "/(tab)/booking-confirm",
              params: { 
                stationName: stationName,
                // Passing the formatted string to the next page
                bookingTime: selectedDate.toLocaleString([], { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                }) 
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
  scrollContent: { padding: 25, paddingTop: 60 },
  backButton: { marginBottom: 20 },
  stationTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  subTitle: { color: '#888', fontSize: 16, marginTop: 5, marginBottom: 30 },
  cardContainer: { backgroundColor: '#1C2E33', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  label: { color: '#00D1FF', fontSize: 14, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
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