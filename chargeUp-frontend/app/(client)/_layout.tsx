import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarShowLabel: false, 
        tabBarActiveTintColor: "white", 
        tabBarInactiveTintColor: "#83B4BB", 
        tabBarStyle: {
          backgroundColor: "#213A45", 
          borderTopLeftRadius: 25, 
          borderTopRightRadius: 25, 
          borderTopWidth: 1, 
          borderTopColor: "white", 
          borderLeftWidth: 1, 
          borderLeftColor: "white",
          borderRightWidth: 1,
          borderRightColor: "white",
          height: 70, 
          position: "absolute", 
          bottom: -1, 
        },
      }}
    >
      {/* 🏠 TAB 1: HOME */}
      <Tabs.Screen
        name="home" 
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={26} color={color} />
          ),
        }}
      />

      {/* 📍 TAB 2: MAP */}
      <Tabs.Screen
        name="map-station-finder" 
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={26} color={color} />
          ),
        }}
      />

      {/* ⚡ TAB 3: SCAN QR (Now Visible & Connected) */}
      <Tabs.Screen
        name="scan-qr" 
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="qr-code-outline" size={30} color={color} />
          ),
        }}
      />

      {/* 👤 TAB 4: PROFILE */}
      <Tabs.Screen
        name="profile" 
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={30} color={color} />
          ),
        }}
      />

      {/* --- HIDDEN PAGES (Kept in background for logic) --- */}

      <Tabs.Screen
        name="station-details"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="booking-confirmation"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="booking-confirm"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="charger-booking"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="charging-session"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="payment"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="payment-success"
        options={{ href: null }}
      />
      
    </Tabs>
  );
}