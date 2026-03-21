import React from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HelpSupportScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#060E14", "#101922", "#15252E"]} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Ionicons name="mail-outline" size={24} color="#5ECFDA" style={{ marginBottom: 10 }} />
            <Text style={styles.title}>Contact Us</Text>
            <Text style={styles.desc}>Need help? Email our support team at support@chargeup.com or call us at 1-800-CHARGE.</Text>
          </View>
          <Text style={styles.faqHeader}>Frequently Asked Questions</Text>
          <View style={styles.faqCard}>
            <Text style={styles.faqTitle}>How to pay for charging?</Text>
            <Text style={styles.faqDesc}>You can securely save your credit card via Stripe directly in the ChargeUp app before initiating a session.</Text>
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
