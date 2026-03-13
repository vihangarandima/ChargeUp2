import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hides the top header
        tabBarShowLabel: false, // Hides the text labels (Icon only)
        tabBarActiveTintColor: "white", // White icon when selected
        tabBarInactiveTintColor: "#83B4BB", // Faded color when not selected
        tabBarStyle: {
          backgroundColor: "#213A45", // Dark blue/grey background
          borderTopLeftRadius: 25, // Rounded top left
          borderTopRightRadius: 25, // Rounded top right
          borderTopWidth: 1, // The white line on top
          borderTopColor: "white", // Color of the top line
          borderLeftWidth: 1, // Connects the border to the curves
          borderLeftColor: "white",
          borderRightWidth: 1,
          borderRightColor: "white",
          height: 70, // Height of the bar
          position: "absolute", // Required to show rounded corners properly
          bottom: -1, // Pulls it down slightly to hide bottom edges
        },
      }}
    >
      {/* 🏠 TAB 1: HOME */}
      <Tabs.Screen
        name="(client)/home" // Make sure this exactly matches your home.tsx filename
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />

      {/* 📍 TAB 2: MAP */}
      <Tabs.Screen
        name="(client)/map-station-finder" // Make sure this matches your map file
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={28} color={color} />
          ),
        }}
      />

      {/* 📄 TAB 3: DETAILS */}
      <Tabs.Screen
        name="(client)/station-details" // Make sure this matches your details file
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="reader" size={28} color={color} />
          ),
        }}
      />

      {/* 👤 TAB 4: PROFILE */}
      <Tabs.Screen
        name="(host)/profile" // Or whatever your profile page is named
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={32} color={color} />
          ),
        }}
      />

      {/* Replace 'booking-page' with the actual name of your file (without the .tsx) */}
    </Tabs>
  );
}
