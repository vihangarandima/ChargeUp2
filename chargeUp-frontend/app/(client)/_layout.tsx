import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

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
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          // Removed side borders for a cleaner, thinner look
          borderTopWidth: 0.5,
          borderTopColor: "rgba(255, 255, 255, 0.3)",
          
          // --- Ultra-Slim Dimensions ---
          height: Platform.OS === "ios" ? 65 : 50, 
          paddingBottom: Platform.OS === "ios" ? 15 : 0,
          position: "absolute",
          bottom: 0,
          elevation: 0, // Removes shadow for a flatter look
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === "android" ? 2 : 0,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} /> // Smaller icons (22)
          ),
        }}
      />

      <Tabs.Screen
        name="map-station-finder"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="scan-qr"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="qr-code" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="client-profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />

      {/* --- HIDDEN PAGES --- */}
      <Tabs.Screen name="station-details" options={{ href: null }} />
      <Tabs.Screen name="booking-confirmation" options={{ href: null }} />
      <Tabs.Screen name="charger-booking" options={{ href: null }} />
      <Tabs.Screen name="payment-success" options={{ href: null }} />
      <Tabs.Screen name="payment" options={{ href: null }} />
      <Tabs.Screen name="charging-session" options={{ href: null }} />
    </Tabs>
  );
}