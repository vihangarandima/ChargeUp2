import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  StatusBar,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const BRANDS = ["BYD", "MG", "Hyundai", "Nissan", "Tesla", "Browns (TAFE)", "Vegamite", "DFSK", "JAC"];
const MODELS = {
  "BYD": ["Atto 3", "Dolphin", "Seal", "e6"],
  "MG": ["ZS EV", "MG4 EV", "MG5 EV"],
  "Hyundai": ["Kona Electric", "IONIQ 5", "IONIQ 6"],
  "Nissan": ["Leaf", "Ariya"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
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

  const openDropdown = (type) => {
    setCurrentType(type);
    setSearchQuery("");
    setModalVisible(true);
  };

  const getFilteredData = () => {
    let data = [];
    if (currentType === "brand") data = BRANDS;
    else if (currentType === "model") data = MODELS[selectedBrand] || [];
    else if (currentType === "port") data = PORTS;
    return data.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const handleSelect = (item) => {
    if (currentType === "brand") {
      setSelectedBrand(item);
      setSelectedModel("");
    }
    else if (currentType === "model") setSelectedModel(item);
    else if (currentType === "port") setSelectedPort(item);
    setModalVisible(false);
  };

  // ✅ Updated Navigation Logic to /(tab)/home
  const handleContinue = () => {
    if (!selectedBrand || !selectedModel || !selectedPort) {
      Alert.alert("Required Fields", "Please select your brand, model, and charging port to continue.");
      return;
    }

    // Using replace to prevent the user from "back-buttoning" into the setup screen
    router.replace("/(client)/home");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#101922', '#15252E', '#193038', '#1D3B42', '#0E4548']}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>ChargeUp</Text>

          <View style={styles.brandHero}>
            <Ionicons name="flash" size={100} color="white" />
            <Text style={styles.tagline}>Find, book and pay</Text>
          </View>

          <Text style={styles.instructionText}>Add your vehicle details here.</Text>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Choose your Brand</Text>
              <TouchableOpacity style={styles.dropdownField} onPress={() => openDropdown("brand")}>
                <Text style={[styles.inputText, !selectedBrand && { color: "#999" }]}>
                  {selectedBrand || "Ex : BYD"}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Model</Text>
              <TouchableOpacity
                style={[styles.dropdownField, !selectedBrand && { opacity: 0.5 }]}
                onPress={() => selectedBrand && openDropdown("model")}
              >
                <Text style={[styles.inputText, !selectedModel && { color: "#999" }]}>
                  {selectedModel || "Ex : Seal"}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Charging port</Text>
              <TouchableOpacity style={styles.dropdownField} onPress={() => openDropdown("port")}>
                <Text style={[styles.inputText, !selectedPort && { color: "#999" }]}>
                  {selectedPort || "Ex : Type 2"}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Manufacture year</Text>
              <View style={styles.inputField}>
                <TextInput
                  placeholder="Ex : 2025"
                  placeholderTextColor="#999"
                  style={styles.inputText}
                  keyboardType="numeric"
                  value={manufactureYear}
                  onChangeText={setManufactureYear}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Battery capacity</Text>
              <View style={styles.inputField}>
                <TextInput
                  placeholder="Ex : 45kWh"
                  placeholderTextColor="#999"
                  style={styles.inputText}
                  value={batteryCapacity}
                  onChangeText={setBatteryCapacity}
                />
              </View>
            </View>

            <Pressable style={styles.continueBtn} onPress={handleContinue}>
              <Text style={styles.continueText}>continue</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={20} color="white" style={{ marginRight: 10 }} />
              <TextInput
                placeholder={`Search ${currentType}...`}
                placeholderTextColor="#999"
                style={styles.searchTextInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="white" />
              </Pressable>
            </View>

            <FlatList
              data={getFilteredData()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listItem} onPress={() => handleSelect(item)}>
                  <Text style={styles.listItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, alignItems: "center" },
  headerTitle: { alignSelf: "flex-start", color: "white", fontSize: 24, fontWeight: "800", marginBottom: 20 },
  brandHero: { alignItems: "center", marginBottom: 20 },
  tagline: { color: "white", fontSize: 18, marginTop: 5, fontWeight: '300' },
  instructionText: { color: "white", fontSize: 15, alignSelf: "flex-start", marginBottom: 15, fontWeight: '500' },
  formCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 20
  },
  inputGroup: { marginBottom: 18 },
  label: { color: "white", fontSize: 14, marginBottom: 8, fontWeight: '600' },
  dropdownField: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", borderRadius: 12, paddingHorizontal: 15, height: 50 },
  inputField: { borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", borderRadius: 12, paddingHorizontal: 15, height: 50, justifyContent: "center" },
  inputText: { flex: 1, color: "white", fontSize: 15 },
  continueBtn: { alignSelf: "flex-end", borderWidth: 1.5, borderColor: "white", borderRadius: 25, paddingVertical: 10, paddingHorizontal: 35, marginTop: 15, backgroundColor: 'rgba(255,255,255,0.1)' },
  continueText: { color: "white", fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { height: height * 0.7, backgroundColor: '#15252E', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20 },
  searchTextInput: { flex: 1, color: 'white', fontSize: 16 },
  listItem: { paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.1)' },
  listItemText: { color: 'white', fontSize: 16 }
});