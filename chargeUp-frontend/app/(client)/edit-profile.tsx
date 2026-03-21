import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const API_BASE = "http://10.184.109.178:5000";

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const avatarAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.spring(avatarAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch real profile data from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setName(storedName);

        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(API_BASE + "/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.name || data.userName) setName(data.name || data.userName);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);
          if (data.profileImage) setPhotoUri(data.profileImage);
        }
      } catch (err) {
        console.error("Load profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Pick from gallery
  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // Take with camera
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const showPhotoPicker = () => {
    Alert.alert("Update Photo", "Choose how to update your profile photo", [
      { text: "Take Photo", onPress: handleTakePhoto },
      { text: "Choose from Library", onPress: handlePickPhoto },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Save changes to backend
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Info", "Name cannot be empty.");
      return;
    }
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

    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());

      if (photoUri && !photoUri.startsWith("http")) {
        const filename = photoUri.split("/").pop() || "photo.jpg";
        const extension = (filename.split(".").pop() || "jpg").toLowerCase();
        const mimeType = extension === "png" ? "image/png" : "image/jpeg";
        formData.append("profileImage", {
          uri: photoUri,
          name: filename,
          type: mimeType,
        } as any);
      }

      const response = await fetch(API_BASE + "/api/auth/profile/update", {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userName", name.trim());
        Alert.alert("Saved!", "Your profile has been updated.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Save Failed", data.message || "Could not update profile.");
      }
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Connection Error", "Could not reach the server.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (n: string) => {
    if (!n) return "?";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n[0].toUpperCase();
  };

  const Field = ({
    label,
    icon,
    value,
    onChangeText,
    keyboardType,
    autoCapitalize,
    fieldKey,
  }: any) => {
    const isFocused = focusedField === fieldKey;
    const hasValue = value.length > 0;
    return (
      <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
        <View style={styles.inputIconBox}>
          <Ionicons
            name={icon}
            size={17}
            color={isFocused ? "#5ECFDA" : "rgba(255,255,255,0.3)"}
          />
        </View>
        <View style={styles.inputBody}>
          {(isFocused || hasValue) && (
            <Text
              style={[styles.floatLabel, isFocused && styles.floatLabelActive]}
            >
              {label}
            </Text>
          )}
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={!isFocused && !hasValue ? label : ""}
            placeholderTextColor="rgba(255,255,255,0.28)"
            keyboardType={keyboardType || "default"}
            autoCapitalize={autoCapitalize || "sentences"}
            onFocus={() => setFocusedField(fieldKey)}
            onBlur={() => setFocusedField(null)}
            selectionColor="#5ECFDA"
          />
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#101922", "#15252E", "#193038", "#0E4548"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ActivityIndicator size="large" color="#5ECFDA" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

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
      <View style={styles.blob1} />
      <View style={styles.blob2} />
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
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Header */}
              <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                  <Ionicons name="chevron-back" size={22} color="white" />
                </Pressable>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Avatar */}
              <Animated.View
                style={[
                  styles.avatarSection,
                  { transform: [{ scale: avatarAnim }] },
                ]}
              >
                <Pressable
                  onPress={showPhotoPicker}
                  style={styles.avatarPressable}
                >
                  <View style={styles.avatarRing}>
                    <LinearGradient
                      colors={["#3ABFCC", "#1A9BAA", "#0E7080"]}
                      style={styles.avatarGradient}
                    >
                      {photoUri ? (
                        <Image
                          source={{ uri: photoUri }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarInitials}>
                          {getInitials(name)}
                        </Text>
                      )}
                    </LinearGradient>
                  </View>
                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={15} color="white" />
                  </View>
                </Pressable>

                <Text style={styles.avatarHint}>Tap photo to update</Text>

                <View style={styles.photoActions}>
                  <Pressable
                    onPress={handlePickPhoto}
                    style={styles.photoActionBtn}
                  >
                    <Ionicons name="images-outline" size={15} color="#5ECFDA" />
                    <Text style={styles.photoActionText}>Gallery</Text>
                  </Pressable>
                  <View style={styles.photoActionSep} />
                  <Pressable
                    onPress={handleTakePhoto}
                    style={styles.photoActionBtn}
                  >
                    <Ionicons name="camera-outline" size={15} color="#5ECFDA" />
                    <Text style={styles.photoActionText}>Camera</Text>
                  </Pressable>
                </View>
              </Animated.View>

              {/* Form */}
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person-outline" size={14} color="#5ECFDA" />
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>
                <View style={styles.form}>
                  <Field
                    label="Full Name"
                    icon="person-outline"
                    value={name}
                    onChangeText={setName}
                    fieldKey="name"
                    autoCapitalize="words"
                  />
                  <Field
                    label="Email Address"
                    icon="mail-outline"
                    value={email}
                    onChangeText={setEmail}
                    fieldKey="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Field
                    label="Phone Number"
                    icon="call-outline"
                    value={phone}
                    onChangeText={setPhone}
                    fieldKey="phone"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.infoNote}>
                  <Ionicons
                    name="information-circle-outline"
                    size={13}
                    color="#5ECFDA"
                    style={{ marginRight: 7 }}
                  />
                  <Text style={styles.infoNoteText}>
                    Your email is used for login. Changing it may require
                    re-verification.
                  </Text>
                </View>
              </View>

              {/* Save */}
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <Pressable
                  onPress={handleSave}
                  disabled={isSaving}
                  style={styles.saveBtn}
                >
                  <LinearGradient
                    colors={["#3ABFCC", "#1E9BAA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveBtnGradient}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.saveBtnText}>Save Changes</Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>

              <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 40 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadingText: { color: "#5ECFDA", fontSize: 14 },
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
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(94,207,218,0.055)",
    top: -80,
    right: -80,
  },
  blob2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(94,207,218,0.03)",
    bottom: 100,
    left: -60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatarPressable: { position: "relative", marginBottom: 12 },
  avatarRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "rgba(94,207,218,0.5)",
    padding: 3,
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarInitials: { color: "white", fontSize: 44, fontWeight: "900" },
  avatarImage: { width: "100%", height: "100%", borderRadius: 65 },
  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1D3B42",
    borderWidth: 2.5,
    borderColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarHint: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
    marginBottom: 14,
  },
  photoActions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.07)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.18)",
    borderRadius: 22,
    overflow: "hidden",
  },
  photoActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  photoActionText: { color: "#5ECFDA", fontSize: 13, fontWeight: "600" },
  photoActionSep: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(94,207,218,0.2)",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.0,
    textTransform: "uppercase",
  },
  form: { gap: 10, marginBottom: 16 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  inputWrapFocused: {
    backgroundColor: "rgba(94,207,218,0.07)",
    borderColor: "rgba(94,207,218,0.4)",
  },
  inputIconBox: { width: 20, alignItems: "center" },
  inputBody: { flex: 1 },
  floatLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  floatLabelActive: { color: "#5ECFDA" },
  textInput: { color: "white", fontSize: 15, paddingVertical: 0 },
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(94,207,218,0.05)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.12)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  infoNoteText: {
    flex: 1,
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    lineHeight: 16,
  },
  saveBtn: { borderRadius: 16, overflow: "hidden", marginBottom: 14 },
  saveBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  saveBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  cancelBtn: { alignItems: "center", paddingVertical: 12 },
  cancelText: { color: "rgba(255,255,255,0.35)", fontSize: 14 },
});
