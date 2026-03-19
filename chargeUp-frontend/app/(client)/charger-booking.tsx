import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  SafeAreaView, Platform, StatusBar, Image, Dimensions 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width } = Dimensions.get('window');

export default function ChargerBooking() {
  const router = useRouter();
  const { stationName } = useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [hasUserSelected, setHasUserSelected] = useState(false); // Track if user made a manual choice

  // Auto-update the time every minute until the user makes a manual selection
  useEffect(() => {
    if (!hasUserSelected) {
      const ticker = setInterval(() => {
        setSelectedDate(new Date());
      }, 10000); // Check every 10 seconds to keep it fresh
      return () => clearInterval(ticker);
    }
  }, [hasUserSelected]);

  const handleConfirmDate = (date: Date) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(updatedDate);
    setHasUserSelected(true); // Stop auto-updating
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (time: Date) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(time.getHours(), time.getMinutes());
    setSelectedDate(updatedDate);
    setHasUserSelected(true); // Stop auto-updating
    setTimePickerVisibility(false);
  };

  return (
    <LinearGradient colors={['#0B1315', '#163B46', '#0B1315']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
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
            <Text style={styles.mainTitle}>Charger info</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/charger-unit.png')} 
              style={styles.chargerImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.qrCard}>
            <View style={styles.cardInner}>
              <Text style={styles.cardHeading}>Select Slot</Text>
              
              <View style={styles.divider} />

              {/* Date Input Box */}
              <TouchableOpacity 
                style={styles.selectorBox} 
                onPress={() => setDatePickerVisibility(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#00D1FF" style={{ marginRight: 12 }} />
                <Text style={styles.selectorText}>{selectedDate.toLocaleDateString()}</Text>
              </TouchableOpacity>

              {/* Time Input Box */}
              <TouchableOpacity 
                style={styles.selectorBox} 
                onPress={() => setTimePickerVisibility(true)}
              >
                <Ionicons name="time-outline" size={20} color="#00D1FF" style={{ marginRight: 12 }} />
                <Text style={styles.selectorText}>
                  {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.bookPill}
                onPress={() => {
                  const formattedTime = `${selectedDate.toLocaleDateString()},${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  router.push({
                    pathname: "/booking-confirmation",
                    params: { stationName: stationName || "Charging Point", bookingTime: formattedTime }
                  });
                }}
              >
                <Text style={styles.bookText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>

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

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  content: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 40 },
  brandHeader: { marginBottom: 12 },
  brandTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  notificationBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 20 },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#555', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 8 },
  titleSection: { marginTop: 5, marginBottom: 10, alignItems: 'center' },
  mainTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  imageContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  chargerImage: { width: width * 0.5, height: 180 },
  qrCard: { 
    width: width * 0.85, 
    alignSelf: 'center',
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 25 
  },
  cardInner: { width: '100%' },
  cardHeading: { color: 'white', fontSize: 20, fontWeight: '600', marginBottom: 5 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
  selectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectorText: { color: 'white', fontSize: 16, fontWeight: '400' },
  bookPill: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingVertical: 10,
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  bookText: { color: 'white', fontSize: 18, fontWeight: '500' }
});