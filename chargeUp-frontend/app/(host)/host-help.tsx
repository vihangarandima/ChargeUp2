import React from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HostHelpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#060E14", "#101922", "#15252E"]} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Host Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Ionicons name="chatbubbles-outline" size={24} color="#FFC850" style={{ marginBottom: 10 }} />
            <Text style={styles.title}>Host Support Center</Text>
            <Text style={styles.desc}>Reach out at hosts@chargeup.com or call 1-800-HOST-CHARGE for dedicated assistance.</Text>
          </View>
          <Text style={styles.faqHeader}>Host Frequently Asked Questions</Text>
          <View style={styles.faqCard}>
            <Text style={styles.faqTitle}>How do I get paid?</Text>
            <Text style={styles.faqDesc}>Earnings are securely accumulated and transferred to your connected Stripe account generally within 2-3 business days.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", marginBottom: 30 },
  title: { color: "white", fontSize: 18, fontWeight: "600", marginBottom: 8 },
  desc: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 20 },
  faqHeader: { color: "white", fontSize: 18, fontWeight: "600", marginBottom: 14 },
  faqCard: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16 },
  faqTitle: { color: "white", fontSize: 15, fontWeight: "600", marginBottom: 6 },
  faqDesc: { color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 18 },
});
