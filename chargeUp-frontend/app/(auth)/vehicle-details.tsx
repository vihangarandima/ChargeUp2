import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const BRANDS = [
  "BYD",
  "MG",
  "Hyundai",
  "Nissan",
  "Tesla",
  "Wuling",
  "Riddara",
  "IM",
  "AVATR",
  "XPENG",

];
const MODELS = {
  BYD: ["Atto 3", "Dolphin", "Seal", "e6"],
  MG: ["ZS EV", "MG4 EV", "MG5 EV"],
  Hyundai: ["Kona Electric", "IONIQ 5", "IONIQ 6"],
  Nissan: ["Leaf", "Ariya"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Wuling:["Binguo"],
  Riddara: ["RD6"],
  IM: ["5","6"],
  AVATR: ["11"],
  XPENG: ["G6"]
};
const PORTS = ["Type 2", "CCS2", "CHAdeMO", "GB/T"];

export default function VehicleDetailsScreen() {
  const router = useRouter();

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPort, setSelectedPort] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [currentType, setCurrentType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconAnim = useRef(new Animated.Value(0.6)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.spring(iconAnim, {
        toValue: 1,
        tension: 90,
        friction: 7,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.96,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openDropdown = (type: string) => {
    setCurrentType(type);
    setSearchQuery("");
    setModalVisible(true);
  };

  const getFilteredData = () => {
    let data: string[] = [];
    if (currentType === "brand") data = BRANDS;
    else if (currentType === "model")
      data = MODELS[selectedBrand as keyof typeof MODELS] || [];
    else if (currentType === "port") data = PORTS;
    return data.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const handleSelect = (item: string) => {
    if (currentType === "brand") {
      setSelectedBrand(item);
      setSelectedModel("");
    } else if (currentType === "model") setSelectedModel(item);
    else if (currentType === "port") setSelectedPort(item);
    setModalVisible(false);
  };

  const handleContinue = async () => {
    animateBtn();
    if (!selectedBrand || !selectedModel || !selectedPort) {
      Alert.alert(
        "Required Fields",
        "Please select your brand, model, and charging port to continue.",
      );
      return;
    }
    try {
      await AsyncStorage.setItem("vehicleBrand", selectedBrand);
      await AsyncStorage.setItem("vehicleModel", selectedModel);
      await AsyncStorage.setItem(
        "vehicleCapacity",
        batteryCapacity ? `${batteryCapacity}` : "Standard",
      );
      await AsyncStorage.setItem("vehicleYear", manufactureYear || "Unknown");
      router.replace("/(client)/home");
    } catch (error) {
      console.error("Error saving vehicle details:", error);
      Alert.alert("Error", "Could not save your vehicle details.");
    }
  };

  const filled = [
    selectedBrand,
    selectedModel,
    selectedPort,
    manufactureYear,
    batteryCapacity,
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.topAccent} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── TOP BAR — outside animation so it never shifts ── */}
        <View style={styles.topBar}>
          <View style={styles.logoChip}>
            <Ionicons name="flash" size={14} color="#0E1F26" />
          </View>
          <Text style={styles.headerTitle}>ChargeUp</Text>
          <View style={styles.badgePill}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>EV Network</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              width: "100%",
            }}
          >
            {/* ── HERO ── */}
            <View style={styles.hero}>
              <Animated.View
                style={[
                  styles.iconOuter,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <LinearGradient
                  colors={["rgba(94,207,218,0.18)", "rgba(94,207,218,0.04)"]}
                  style={styles.iconGradient}
                >
                  <Animated.View
                    style={[
                      styles.iconInner,
                      { transform: [{ scale: iconAnim }] },
                    ]}
                  >
                    <Ionicons
                      name="car-sport-outline"
                      size={36}
                      color="white"
                    />
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
              <Text style={styles.heroTitle}>Your Vehicle</Text>
              <Text style={styles.heroSub}>
                Add your EV details to get started
              </Text>
            </View>

            {/* ── PROGRESS BAR ── */}
            <View style={styles.progressWrap}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Profile completion</Text>
                <Text style={styles.progressCount}>{filled} / 5</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(filled / 5) * 100}%` as any },
                  ]}
                />
              </View>
            </View>

            {/* ── FORM CARD ── */}
            <View style={styles.formCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="car-outline" size={14} color="#5ECFDA" />
                <Text style={styles.sectionTitle}>Vehicle Information</Text>
              </View>

              {/* Brand */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Choose your Brand</Text>
                <TouchableOpacity
                  style={styles.dropdownField}
                  onPress={() => openDropdown("brand")}
                >
                  <View style={styles.fieldIconBox}>
                    <Ionicons
                      name="storefront-outline"
                      size={16}
                      color={
                        selectedBrand ? "#5ECFDA" : "rgba(255,255,255,0.3)"
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.inputText,
                      !selectedBrand && styles.placeholderText,
                    ]}
                  >
                    {selectedBrand || "Ex: BYD"}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={22}
                    color={selectedBrand ? "#5ECFDA" : "rgba(255,255,255,0.35)"}
                  />
                </TouchableOpacity>
              </View>

              {/* Model */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Model</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownField,
                    !selectedBrand && styles.fieldDisabled,
                  ]}
                  onPress={() => selectedBrand && openDropdown("model")}
                >
                  <View style={styles.fieldIconBox}>
                    <Ionicons
                      name="car-outline"
                      size={16}
                      color={
                        selectedModel ? "#5ECFDA" : "rgba(255,255,255,0.3)"
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.inputText,
                      !selectedModel && styles.placeholderText,
                    ]}
                  >
                    {selectedModel || "Ex: Seal"}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={22}
                    color={selectedModel ? "#5ECFDA" : "rgba(255,255,255,0.35)"}
                  />
                </TouchableOpacity>
              </View>

              {/* Charging Port */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Charging Port</Text>
                <TouchableOpacity
                  style={styles.dropdownField}
                  onPress={() => openDropdown("port")}
                >
                  <View style={styles.fieldIconBox}>
                    <Ionicons
                      name="flash-outline"
                      size={16}
                      color={selectedPort ? "#5ECFDA" : "rgba(255,255,255,0.3)"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.inputText,
                      !selectedPort && styles.placeholderText,
                    ]}
                  >
                    {selectedPort || "Ex: Type 2"}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={22}
                    color={selectedPort ? "#5ECFDA" : "rgba(255,255,255,0.35)"}
                  />
                </TouchableOpacity>
              </View>

              {/* Manufacture Year */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Manufacture Year</Text>
                <View style={styles.inputField}>
                  <View style={styles.fieldIconBox}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={
                        manufactureYear ? "#5ECFDA" : "rgba(255,255,255,0.3)"
                      }
                    />
                  </View>
                  <TextInput
                    placeholder="Ex: 2025"
                    placeholderTextColor="rgba(255,255,255,0.28)"
                    style={styles.inputText}
                    keyboardType="numeric"
                    value={manufactureYear}
                    onChangeText={setManufactureYear}
                    selectionColor="#5ECFDA"
                  />
                </View>
              </View>

              {/* Battery Capacity */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Battery Capacity</Text>
                <View style={styles.inputField}>
                  <View style={styles.fieldIconBox}>
                    <Ionicons
                      name="battery-charging-outline"
                      size={16}
                      color={
                        batteryCapacity ? "#5ECFDA" : "rgba(255,255,255,0.3)"
                      }
                    />
                  </View>
                  <TextInput
                    placeholder="Ex: 45 kWh"
                    placeholderTextColor="rgba(255,255,255,0.28)"
                    style={styles.inputText}
                    value={batteryCapacity}
                    onChangeText={setBatteryCapacity}
                    selectionColor="#5ECFDA"
                  />
                </View>
              </View>

              {/* Continue Button */}
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <Pressable onPress={handleContinue} style={styles.ctaBtn}>
                  <LinearGradient
                    colors={["#3ABFCC", "#1E9BAA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>Continue</Text>
                    <View style={styles.ctaArrow}>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color="#0E4548"
                      />
                    </View>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            </View>

            {/* ── HINT ── */}
            <View style={styles.hintBox}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color="#5ECFDA"
                style={{ marginRight: 7 }}
              />
              <Text style={styles.hintText}>
                You can update your vehicle details anytime from your profile
                settings.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* ── MODAL — same logic, upgraded look ── */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={["#15252E", "#193038", "#1D3B42"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {currentType === "brand"
                ? "Choose Brand"
                : currentType === "model"
                  ? "Choose Model"
                  : "Charging Port"}
            </Text>

            <View style={styles.searchBarContainer}>
              <Ionicons
                name="search"
                size={18}
                color="#5ECFDA"
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder={`Search ${currentType}...`}
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.searchTextInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                selectionColor="#5ECFDA"
              />
              <Pressable onPress={() => setModalVisible(false)} hitSlop={10}>
                <Ionicons
                  name="close-circle"
                  size={22}
                  color="rgba(255,255,255,0.4)"
                />
              </Pressable>
            </View>

            <FlatList
              data={getFilteredData()}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected =
                  (currentType === "brand" && item === selectedBrand) ||
                  (currentType === "model" && item === selectedModel) ||
                  (currentType === "port" && item === selectedPort);
                return (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      isSelected && styles.listItemSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#5ECFDA"
                        style={{ marginRight: 12 }}
                      />
                    ) : (
                      <View style={{ width: 30 }} />
                    )}
                    <Text
                      style={[
                        styles.listItemText,
                        isSelected && styles.listItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#5ECFDA",
    opacity: 0.65,
    zIndex: 10,
  },
  blob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(94,207,218,0.055)",
    top: -100,
    right: -80,
  },
  blob2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(94,207,218,0.03)",
    bottom: 100,
    left: -70,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 40,
    alignItems: "center",
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 4,
  },
  logoChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    flex: 1,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.1)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.22)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5ECFDA",
  },
  badgeText: {
    color: "#5ECFDA",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  // Hero
  hero: { alignItems: "center", marginBottom: 20, width: "100%" },
  iconOuter: { width: 92, height: 92, borderRadius: 46, marginBottom: 14 },
  iconGradient: {
    flex: 1,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(94,207,218,0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(94,207,218,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 5,
  },
  heroSub: { color: "rgba(255,255,255,0.38)", fontSize: 13 },

  // Progress
  progressWrap: { width: "100%", marginBottom: 16 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  progressCount: { color: "#5ECFDA", fontSize: 12, fontWeight: "700" },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: { height: "100%", backgroundColor: "#5ECFDA", borderRadius: 2 },

  // Card
  formCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.0,
    textTransform: "uppercase",
  },

  // Fields
  inputGroup: { marginBottom: 12 },
  label: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 7,
    textTransform: "uppercase",
  },
  dropdownField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  fieldDisabled: { opacity: 0.4 },
  fieldIconBox: { width: 20, alignItems: "center" },
  inputText: { flex: 1, color: "white", fontSize: 15 },
  placeholderText: { color: "rgba(255,255,255,0.28)" },

  // CTA
  ctaBtn: { borderRadius: 15, overflow: "hidden", marginTop: 8 },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
  },
  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Hint
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "rgba(94,207,218,0.06)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.12)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  hintText: {
    flex: 1,
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    lineHeight: 18,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: height * 0.62,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    padding: 20,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.2)",
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchTextInput: { flex: 1, color: "white", fontSize: 15 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  listItemSelected: {
    backgroundColor: "rgba(94,207,218,0.07)",
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  listItemText: { color: "rgba(255,255,255,0.7)", fontSize: 15 },
  listItemTextSelected: { color: "#5ECFDA", fontWeight: "600" },
});
