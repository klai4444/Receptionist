import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Platform } from "react-native";
import ChatBox from './ChatBox';
import { Image, Modal} from "react-native";
import { WebView } from "react-native-webview";

interface Styles {
  container: ViewStyle;
  titleContainer: ViewStyle;
  title: TextStyle;
  body: TextStyle;
  mainContent: ViewStyle;
  iframe: ViewStyle;
  sidebar: ViewStyle;
  mapButton: ViewStyle;
  mapIcon: ViewStyle;
  calendarButton: ViewStyle;
  webview: ViewStyle;
  calendarIcon: ViewStyle;
  modalIcon: ViewStyle;
  modalBackground: ViewStyle;
  mapModal: ViewStyle;
  muddMap: ViewStyle;
  closeButton: ViewStyle;
  closeIcon: ViewStyle;
  calendarModal: ViewStyle;

}


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
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  
  const handleMapButtonPress = () => {
    setModalVisible(true); // Show the popup when button is pressed
  };
  const handleCloseMap = () => {
    setModalVisible(false); // Hide the popup when closed
  };

  const handleCalendarButtonPress = () => {
    setCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };
  return (
    <View style={styles.container}>
      {/* Top-Left Button */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.mapButton} onPress={handleMapButtonPress}>
          <Image source={require('./icons8-map-50.png')} style={styles.mapIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.calendarButton} onPress={handleCalendarButtonPress}>
          <Image source={require('./icons8-calendar-48.png')} style={styles.calendarIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <ChatBox />
      </View>
      
      {/* Map Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseMap}
      >
        <View style={styles.modalBackground}>
          <View style={styles.mapModal}>
            {/* Display Map Image in Popup */}
            <Image source={require('./mudd_map.jpg')} style={styles.muddMap} />

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseMap}>
              <Image source={require('./close-icon.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Calendar Modal */}
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
    flexDirection: "row",
    backgroundColor: '#E4E0EE',
  },
  sidebar: {
    width: 80,
    backgroundColor: 'rgb(204, 196, 223)',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    height: "100%",
  },
  iframe: { width: "100%", height: "100%", border: "none" },
  webview: { flex: 1, width: "100%", height: "100%" },
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
  mapModal: {
    width: "40%",
    height: "100%",
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muddMap: {
    width: "100%",
    height: "100%",
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
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default Receptionist;