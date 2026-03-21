import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHARGER_TYPES = [
  "Standard 3-Pin Plug (13A)",
  "Commando Socket (16A/32A)",
  "Type 1 (J1772) - AC",
  "Type 2 (Mennekes) - AC",
  "CHAdeMO - DC Fast",
  "CCS2 - DC Fast",
  "Tesla Proprietary",
  "Other",
];

// Icon map for charger types
const CHARGER_ICONS: Record<string, string> = {
  "Standard 3-Pin Plug (13A)": "power-socket-uk",
  "Commando Socket (16A/32A)": "power-plug",
  "Type 1 (J1772) - AC": "ev-plug-type1",
  "Type 2 (Mennekes) - AC": "ev-plug-type2",
  "CHAdeMO - DC Fast": "ev-plug-chademo",
  "CCS2 - DC Fast": "ev-plug-ccs2",
  "Tesla Proprietary": "ev-plug-tesla",
  "Other": "power-plug-outline",
};

const Field = ({
  label, icon, value, onChangeText, keyboardType, fieldKey, placeholder, focusedField, setFocusedField
}: any) => {
  const isFocused = focusedField === fieldKey;
  const hasValue = value.length > 0;
  return (
    <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
      <View style={styles.inputIconBox}>
        <Ionicons name={icon} size={17} color={isFocused ? "#FFC850" : "rgba(255,255,255,0.3)"} />
      </View>
      <View style={styles.inputBody}>
        {(isFocused || hasValue) && (
          <Text style={[styles.floatLabel, isFocused && styles.floatLabelActive]}>{label}</Text>
        )}
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={!isFocused && !hasValue ? placeholder || label : ""}
          placeholderTextColor="rgba(255,255,255,0.28)"
          keyboardType={keyboardType}
          autoCapitalize="sentences"
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
          selectionColor="#FFC850"
        />
      </View>
    </View>
  );
};

export default function HostDetailsScreen() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const router = useRouter();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(35)).current;
  const iconAnim = useRef(new Animated.Value(0.6)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 11, useNativeDriver: true }),
      Animated.spring(iconAnim, { toValue: 1, tension: 90, friction: 7, delay: 150, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.07, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 70, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start();
  };

  // Progress
  const filled = [fullName, address, idNumber, phone, chargerType].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* Gold top accent for host screens */}
      <View style={styles.topAccent} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

              {/* ── TOP BAR ── */}
              <View style={styles.topBar}>
                <View style={styles.logoChip}>
                  <Ionicons name="flash" size={13} color="#0E1F26" />
                </View>
                <Text style={styles.brandName}>ChargeUp</Text>
                <View style={styles.badgePill}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>Host Portal</Text>
                </View>
              </View>

              {/* ── HERO ── */}
              <View style={styles.hero}>
                <Animated.View style={[styles.iconOuter, { transform: [{ scale: pulseAnim }] }]}>
                  <LinearGradient
                    colors={["rgba(255,200,80,0.2)", "rgba(255,200,80,0.05)"]}
                    style={styles.iconGradient}
                  >
                    <Animated.View style={[styles.iconInner, { transform: [{ scale: iconAnim }] }]}>
                      <MaterialCommunityIcons name="ev-station" size={38} color="white" />
                    </Animated.View>
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.heroTitle}>Share & Earn</Text>
                <Text style={styles.heroSub}>Fill in your details to list your charger</Text>
              </View>

              {/* ── PROGRESS ── */}
              <View style={styles.progressWrap}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Profile completion</Text>
                  <Text style={styles.progressCount}>{filled} / 5</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: ((filled / 5) * 100) + "%" as any }]} />
                </View>
              </View>

              {/* ── FORM CARD ── */}
              <View style={styles.card}>

                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="card-account-details-outline" size={14} color="#FFC850" />
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>

                <View style={styles.form}>
                  <Field
                    label="Full Name"
                    icon="person-outline"
                    value={fullName}
                    onChangeText={setFullName}
                    fieldKey="name"
                    placeholder="Your legal full name"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <Field
                    label="Address"
                    icon="home-outline"
                    value={address}
                    onChangeText={setAddress}
                    fieldKey="address"
                    placeholder="Charger location address"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <Field
                    label="ID / Passport Number"
                    icon="id-card-outline"
                    value={idNumber}
                    onChangeText={setIdNumber}
                    fieldKey="id"
                    placeholder="For identity verification"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <Field
                    label="Telephone Number"
                    icon="call-outline"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    fieldKey="phone"
                    placeholder="+94 77 000 0000"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />

                  {/* Charger Type Dropdown */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setModalVisible(true)}
                    style={[styles.inputWrap, chargerType && styles.inputWrapFocused]}
                  >
                    <View style={styles.inputIconBox}>
                      <MaterialCommunityIcons
                        name="ev-plug-type2"
                        size={17}
                        color={chargerType ? "#FFC850" : "rgba(255,255,255,0.3)"}
                      />
                    </View>
                    <View style={styles.inputBody}>
                      {chargerType && (
                        <Text style={styles.floatLabelActive}>Charging Unit Type</Text>
                      )}
                      <Text style={chargerType ? styles.dropdownValue : styles.dropdownPlaceholder}>
                        {chargerType || "Select charger type"}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={chargerType ? "#FFC850" : "rgba(255,255,255,0.3)"}
                    />
                  </TouchableOpacity>
                </View>

                {/* ── CONTINUE BTN ── */}
                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                  <Pressable
                    onPress={() => {
                      animateBtn();
                      router.push({
                        pathname: "/(host)/location-picker",
                        params: { fullName, address, idNumber, phone, chargerType },
                      });
                    }}
                    style={styles.ctaBtn}
                  >
                    <LinearGradient
                      colors={["#D4A017", "#FFC850", "#D4A017"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.ctaGradient}
                    >
                      <Text style={styles.ctaText}>Continue</Text>
                      <View style={styles.ctaArrow}>
                        <Ionicons name="arrow-forward" size={16} color="#5A3800" />
                      </View>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>

              </View>

              {/* ── TRUST BADGE ── */}
              <View style={styles.trustBox}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#FFC850" style={{ marginRight: 7 }} />
                <Text style={styles.trustText}>
                  Your details are encrypted and used only for verification purposes.
                </Text>
              </View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── CHARGER TYPE MODAL ── */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalSheet}>
            <LinearGradient
              colors={["#15252E", "#193038", "#1D3B42"]}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Handle */}
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Charger Type</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {CHARGER_TYPES.map((type, index) => {
                const isSelected = chargerType === type;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                    onPress={() => { setChargerType(type); setModalVisible(false); }}
                  >
                    <View style={[styles.modalOptionIcon, isSelected && styles.modalOptionIconSelected]}>
                      <MaterialCommunityIcons
                        name={(CHARGER_ICONS[type] || "power-plug") as any}
                        size={20}
                        color={isSelected ? "#FFC850" : "rgba(255,255,255,0.5)"}
                      />
                    </View>
                    <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                      {type}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#FFC850" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Pressable style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 40 },

  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: "#FFC850", opacity: 0.7, zIndex: 10,
  },
  blob1: {
    position: "absolute", width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(255,200,80,0.05)", top: -100, right: -80,
  },
  blob2: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(255,200,80,0.03)", bottom: 100, left: -70,
  },

  // Top bar
  topBar: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 22 },
  logoChip: {
    width: 26, height: 26, borderRadius: 7, backgroundColor: "#FFC850",
    alignItems: "center", justifyContent: "center", marginRight: 8,
  },
  brandName: { color: "white", fontSize: 20, fontWeight: "700", letterSpacing: 0.4, flex: 1 },
  badgePill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,200,80,0.12)", borderWidth: 1,
    borderColor: "rgba(255,200,80,0.3)", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, gap: 5,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFC850" },
  badgeText: { color: "#FFC850", fontSize: 11, fontWeight: "600" },

  // Hero
  hero: { alignItems: "center", marginBottom: 20 },
  iconOuter: { width: 92, height: 92, borderRadius: 46, marginBottom: 14 },
  iconGradient: { flex: 1, borderRadius: 46, alignItems: "center", justifyContent: "center" },
  iconInner: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "rgba(255,200,80,0.12)",
    borderWidth: 1.5, borderColor: "rgba(255,200,80,0.45)",
    alignItems: "center", justifyContent: "center",
  },
  heroTitle: { color: "white", fontSize: 28, fontWeight: "800", letterSpacing: -0.8, marginBottom: 5 },
  heroSub: { color: "rgba(255,255,255,0.4)", fontSize: 13 },

  // Progress
  progressWrap: { width: "100%", marginBottom: 16 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  progressCount: { color: "#FFC850", fontSize: 12, fontWeight: "700" },
  progressTrack: { height: 4, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#FFC850", borderRadius: 2 },

  // Card
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    padding: 18, marginBottom: 16,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 16 },
  sectionTitle: {
    color: "rgba(255,255,255,0.5)", fontSize: 11,
    fontWeight: "700", letterSpacing: 1.0, textTransform: "uppercase",
  },

  // Inputs
  form: { gap: 10, marginBottom: 20 },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 13, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14, paddingVertical: 13, gap: 10,
  },
  inputWrapFocused: {
    backgroundColor: "rgba(255,200,80,0.07)",
    borderColor: "rgba(255,200,80,0.4)",
  },
  inputIconBox: { width: 20, alignItems: "center" },
  inputBody: { flex: 1 },
  floatLabel: {
    color: "rgba(255,255,255,0.3)", fontSize: 10,
    fontWeight: "600", letterSpacing: 0.8,
    textTransform: "uppercase", marginBottom: 2,
  },
  floatLabelActive: { color: "#FFC850", fontSize: 10, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 2 },
  textInput: { color: "white", fontSize: 15, paddingVertical: 0 },
  dropdownValue: { color: "white", fontSize: 15 },
  dropdownPlaceholder: { color: "rgba(255,255,255,0.28)", fontSize: 15 },

  // CTA
  ctaBtn: { borderRadius: 15, overflow: "hidden" },
  ctaGradient: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: 15, gap: 10,
  },
  ctaText: { color: "#3A2000", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },
  ctaArrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(58,32,0,0.2)",
    alignItems: "center", justifyContent: "center",
  },

  // Trust badge
  trustBox: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "rgba(255,200,80,0.06)",
    borderWidth: 1, borderColor: "rgba(255,200,80,0.15)",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
  },
  trustText: { flex: 1, color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 18 },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    overflow: "hidden", padding: 20, paddingBottom: 36, maxHeight: "65%",
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center", marginBottom: 16,
  },
  modalTitle: {
    color: "white", fontSize: 17, fontWeight: "700",
    letterSpacing: 0.3, marginBottom: 16, textAlign: "center",
  },
  modalOption: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  modalOptionSelected: {
    backgroundColor: "rgba(255,200,80,0.07)",
    borderRadius: 10, paddingHorizontal: 8,
  },
  modalOptionIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center", justifyContent: "center",
  },
  modalOptionIconSelected: {
    backgroundColor: "rgba(255,200,80,0.15)",
    borderWidth: 1, borderColor: "rgba(255,200,80,0.35)",
  },
  modalOptionText: { flex: 1, color: "rgba(255,255,255,0.7)", fontSize: 14 },
  modalOptionTextSelected: { color: "#FFC850", fontWeight: "600" },
  modalCancelBtn: {
    marginTop: 16, alignItems: "center",
    paddingVertical: 13,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 13, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalCancelText: { color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: "600" },
});