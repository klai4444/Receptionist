import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZm0-XzyYroEK6trkCQLo5rvsWKNLuvRU",
  authDomain: "receptionist-338.firebaseapp.com",
  projectId: "receptionist-338",
  storageBucket: "receptionist-338.firebasestorage.app",
  messagingSenderId: "443219379181",
  appId: "1:443219379181:web:4fb5a9d04b76f24e145de4",
  measurementId: "G-2D1M7M75FX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receptionist</Text>
      <Text style={styles.body}>Virtual receptionist, anytime, anywhere, anyone.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'RobotoSlab-Bold', // Match the file name
    fontSize: 24,
  },
  body: {
    fontFamily: 'RobotoSlab-Medium', // Match the file name
    fontSize: 18,
  },
});

