import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCTe-wTFyDpvS3UVkRZ28CCRudWY_b8xQ",
  authDomain: "chargeup-8cf7f.firebaseapp.com",
  projectId: "chargeup-8cf7f",
  storageBucket: "chargeup-8cf7f.firebasestorage.app",
  messagingSenderId: "71813664146",
  appId: "1:71813664146:web:443d1b5f4b5a24fd03854b",
  measurementId: "G-53QBFS5SD6",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
