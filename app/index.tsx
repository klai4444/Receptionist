import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Platform } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import ChatBox from './ChatBox';
import Location from './Location';
import { Image, Modal} from "react-native";
import { WebView } from "react-native-webview";
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

const GoogleCalendar = () => {
  const calendarUrl =
    "https://calendar.google.com/calendar/embed?src=s3e00qjdm5hnociosvc477854qhdnn19%40import.calendar.google.com&ctz=America%2FChicago";

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <iframe src={calendarUrl} style={styles.iframe} />
      ) : (
        <WebView source={{ uri: calendarUrl }} style={styles.webview} />
      )}
    </View>
  );
};

const Receptionist: React.FC = () => {
  // State to hold location error message
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const handleLocationFetched = (lat: number | null, lng: number | null) => {
    console.log(`User Location: Latitude: ${lat}, Longitude: ${lng}`);
  };
  const handleError = (error: string) => {
    setError(error); // Set the error message
    console.log(error); // Log the error to the console
  };
  
  // Function to handle button press
  const handleMapButtonPress = () => {
    console.log("Map button pressed!");
    setModalVisible(true); // Show the popup when button is pressed
  };
  const handleCloseModal = () => {
    setModalVisible(false); // Hide the popup when closed
  };

  // Function to handle calendar press
  const handleCalendarButtonPress = () => {
    console.log("Calendar button pressed!");
    setCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };
  return (
    <View style={styles.container}>
      {/* Top-Left Button */}
      <TouchableOpacity style={styles.mapButton} onPress={handleMapButtonPress}>
        <Image source={require('./icons8-map-50.png')} style={styles.mapIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.calendarButton} onPress={handleCalendarButtonPress}>
        <Image source={require('./icons8-calendar-48.png')} style={styles.calendarIcon} />
      </TouchableOpacity>
      {/*
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Receptionist</Text>
        <Text style={styles.body}>Your Virtual Receptionist At Mudd Library</Text>
      </View>
      */}
      <View style={styles.mainContent}>
        <ChatBox />
        <Location onLocationFetched={handleLocationFetched} onError={handleError} />
      </View>
      
      {/* Modal Popup */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* Display Map Image in Popup */}
            <Image source={require('./mudd_map.jpg')} style={styles.popupImage} />

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Image source={require('./close-icon.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Calendar Modal Popup */}
      <Modal visible={isCalendarVisible} transparent={true} animationType="fade" onRequestClose={handleCloseCalendar}>
        <View style={styles.modalBackground}>
          <View style={styles.calendarModal}>
            <GoogleCalendar />
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseCalendar}>
              <Image source={require("./close-icon.png")} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#E4E0EE',
  },
  iframe: { width: "100%", height: 600, border: "none" },
  webview: { flex: 1, width: "100%", height: 600 },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#212121', 
    backdropFilter: 'blur(10px)', 
    borderBottomWidth: 0, 
  },
  title: {
    fontFamily: 'RobotoSlab-ExtraBold',
    fontSize: 50,
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
  mapButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 5, // Shadow effect on Android
    zIndex: 10, // Ensures it appears above other elements
  },
  calendarButton: {
    position: 'absolute',
    top: 70,
    left: 10,
    backgroundColor: '#fffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 5, // Shadow effect on Android
    zIndex: 10, // Ensures it appears above other elements
  },
  buttonText: {
    fontSize: 24,
    color: '#e8e4e3',
    fontWeight: 'bold',
  },
  mapIcon: {
    width: 40, // Adjust size as needed
    height: 40,
    resizeMode: 'contain',
  },
  calendarIcon: {
    width: 40, // Adjust size as needed
    height: 40,
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupImage: {
    width: 250,
    height: 300,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  calendarModal: {
    width: "40%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default Receptionist;