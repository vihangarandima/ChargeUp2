import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ChargingSession() {
  const router = useRouter();

  const { chargerId, sessionId, pricePerUnit } = useLocalSearchParams();

  const pricePerMinute = pricePerUnit
    ? parseFloat(pricePerUnit as string)
    : 20.0;
  const currentSessionId = (sessionId as string) || "SESS_" + Date.now();
  
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isCharging) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isCharging]);

  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  const currentAmount = (secondsElapsed / 60) * pricePerMinute;

  const handleStartCharging = () => {
    setIsCharging(true);
  };

  const handleStopAndPay = async () => {
    const finalAmount = currentAmount > 0 ? currentAmount.toFixed(2) : "10.00";
    setIsCharging(false); 

    try {
      await fetch("http://10.129.159.178:5000/api/stop-charging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSessionId }),
      });
      console.log("Hardware stop signal sent.");
    } catch (error) {
      console.log("Hardware stop failed, moving to payment.");
    }

    router.push({
      pathname: "/payment",
      params: { amount: finalAmount, sessionId: currentSessionId },
    });
  };

  return (
    <LinearGradient
      colors={["#0B1315", "#163B46", "#0B1315"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.brandHeader}>
            <Text style={styles.brandTitle}>ChargeUp</Text>
          </View>

          <View style={styles.controlRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={20} color="#BDC3C7" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>4</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.topCard}>
            <Text style={styles.cardTitle}>
              {isCharging ? "Charging in Progress" : "Charging"}
            </Text>
            
            <Image 
              source={require('../../assets/images/byd seal.png')} 
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsHeader}>LIVE CHARGING DETAILS</Text>

            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="time-outline" size={20} color="#BDC3C7" />
                <Text style={styles.labelText}>Time elapsed</Text>
              </View>
              <Text style={styles.valueText}>
                {hours}h {minutes < 10 ? "0" + minutes : minutes}m{" "}
                {seconds < 10 ? "0" + seconds : seconds}s
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="pricetag-outline" size={20} color="#BDC3C7" />
                <Text style={styles.labelText}>Price per min</Text>
              </View>
              <Text style={styles.valueText}>
                Rs. {pricePerMinute.toFixed(2)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Ionicons name="wallet-outline" size={20} color="#00D1FF" />
                <Text style={[styles.labelText, { color: "#00D1FF" }]}>
                  Current Amount
                </Text>
              </View>
              <Text
                style={[styles.valueText, { color: "#00D1FF", fontSize: 18 }]}
              >
                Rs. {currentAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleStartCharging}
                disabled={isCharging}
                activeOpacity={1} 
              >
                <Text style={styles.actionBtnText}>Start Charging</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleStopAndPay}
                disabled={!isCharging}
                activeOpacity={1}
              >
                <Text style={styles.actionBtnText}>Pay here</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: { paddingHorizontal: 25, paddingTop: 30 },
  brandHeader: { marginBottom: 5 },
  brandTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 35,
  },
  notificationBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 10,
    borderRadius: 25,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#555",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#163B46",
  },
  badgeText: { color: "white", fontSize: 9, fontWeight: "bold" },
  
  topCard: {
    backgroundColor: "#11222A", 
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)", 
    marginBottom: 25,
    height: 200, 
    padding: 18,
    position: "relative",
    overflow: "hidden", 
  },
  cardTitle: { 
    color: "white", 
    fontSize: 22, 
    fontWeight: "bold",
    zIndex: 10, 
  },
  
  carImage: {
    width: 280,
    height: 193,
    position: "absolute",
    bottom: -2,
    right: -3,
    zIndex: 1,
  },

  detailsCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginTop: 10,
  },
  detailsHeader: {
    color: "#BDC3C7",
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 18,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  labelGroup: { flexDirection: "row", alignItems: "center", gap: 12 },
  labelText: { color: "#E0E0E0", fontSize: 13 },
  valueText: { color: "white", fontSize: 14, fontWeight: "700" },
  
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  actionBtn: {
    width: "48%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "transparent",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0, 
    shadowOpacity: 0, 
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "normal",
  },
});