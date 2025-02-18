import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import ChatBox from './ChatBox';
import Location from './Location';
const firebaseConfig = {
  apiKey: "AIzaSyBZm0-XzyYroEK6trkCQLo5rvsWKNLuvRU",
  authDomain: "receptionist-338.firebaseapp.com",
  projectId: "receptionist-338",
  storageBucket: "receptionist-338.firebasestorage.app",
  messagingSenderId: "443219379181",
  appId: "1:443219379181:web:4fb5a9d04b76f24e145de4",
  measurementId: "G-2D1M7M75FX"
};

interface Styles {
  container: ViewStyle;
  titleContainer: ViewStyle;
  title: TextStyle;
  body: TextStyle;
  mainContent: ViewStyle;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Receptionist: React.FC = () => {
  // State to hold location error message
  const [error, setError] = useState<string | null>(null);
  const handleLocationFetched = (lat: number | null, lng: number | null) => {
    console.log(`User Location: Latitude: ${lat}, Longitude: ${lng}`);
  };
  const handleError = (error: string) => {
    setError(error); // Set the error message
    console.log(error); // Log the error to the console
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Receptionist</Text>
        <Text style={styles.body}>Your Virtual Receptionist At Mudd Library</Text>
      </View>
      <View style={styles.mainContent}>
        <ChatBox />
        <Location onLocationFetched={handleLocationFetched} onError={handleError} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#1b1c1b',
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#212121', 
    backdropFilter: 'blur(10px)', 
    borderBottomWidth: 0, 
  },
  title: {
    fontFamily: 'RobotoSlab-ExtraBold',
    fontSize: 24,
    color: '#e8e4e3',
    marginBottom: 4, 
  },
  body: {
    fontFamily: 'RobotoSlab-ExtraBold',
    fontSize: 16, 
    color: '#e8e4e3', 
    opacity: 0.9, 
  },
  mainContent: {
    flex: 1,
  },
});

export default Receptionist;