import React from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HostHomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Image with 35% opacity */}
      <ImageBackground
        source={require('../../assets/images/car_charging.jpg')}
        style={StyleSheet.absoluteFillObject}
        imageStyle={{ opacity: 0.35 }}
      >
        {/* Dark Gradient Overlay to ensure text readability */}
        <LinearGradient
          colors={['rgba(10, 17, 20, 0.9)', 'rgba(15, 35, 45, 0.7)', 'rgba(10, 17, 20, 0.9)']}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* --- HEADER --- */}
            <Text style={styles.brandText}>ChargeUp</Text>

            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greetingText}>Hello, Ashan</Text>
                <Text style={styles.subtitleText}>Lend Your charger</Text>
              </View>

              <View style={styles.headerIcons}>
                <Pressable style={styles.iconCircle}>
                  <Ionicons name="search" size={20} color="white" />
                </Pressable>

                <Pressable style={styles.iconCircle}>
                  <Ionicons name="notifications-outline" size={20} color="white" />
                  {/* Notification Badge */}
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>4</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* --- MAIN CHARGER CARD --- */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.heroCard}
            >
              {/* Plug Icon Top Right */}
              <MaterialCommunityIcons
                name="power-plug"
                size={28}
                color="white"
                style={styles.plugIcon}
              />

              {/* Placeholder for your 3D Charger image.
                Replace the uri with require('../../assets/images/charger_model.png') if you have it locally downloaded
              */}
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8643/8643034.png' }}
                style={styles.chargerImage}
                resizeMode="contain"
              />
            </LinearGradient>

            {/* --- MANAGE YOUR CHARGER SECTION --- */}
            <Text style={styles.sectionTitle}>Manage Your Charger</Text>

            <Pressable style={styles.listItem}>
              <Text style={styles.listItemText}>EVOCK Charging Station</Text>
            </Pressable>

            <Pressable style={styles.listItem}>
              <Ionicons name="add" size={24} color="white" style={styles.addIcon} />
              <Text style={styles.listItemText}>Add a new Charging Station</Text>
            </Pressable>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

