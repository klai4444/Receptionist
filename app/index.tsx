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
        <Text style={styles.body}>Virtual receptionist, anytime, anywhere, anyone.</Text>
      </View>
      <View style={styles.mainContent}>
        <ChatBox />
        <Location onLocationFetched={handleLocationFetched} onError={handleError} />
      </View>
    </View>
  );
};

const getChatResponse = async (message) => {
  try {
      const response = await fetch('https://us-central1-receptionist-338', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message })
      });

      const data = await response.json();
      console.log('OpenAI Response:', data);
  } catch (error) {
      console.error('Error fetching OpenAI response:', error);
  }
};


const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 24,
  },
  body: {
    fontFamily: 'RobotoSlab-Medium',
    fontSize: 18,
  },
  mainContent: {
    flex: 1,
  },
});

export default Receptionist;