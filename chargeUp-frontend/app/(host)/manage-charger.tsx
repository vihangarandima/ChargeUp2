import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HostChargerDetailsScreen() {
  // State to manage the active status of the charger
  const [chargerStatus, setChargerStatus] = useState('available');