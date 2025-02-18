import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import ChatBox from './ChatBox';
import Location from './Location';

const Receptionist: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Receptionist</Text>
        <Text style={styles.body}>Your Virtual Receptionist At Mudd Library</Text>
      </View>
      <View style={styles.mainContent}>
        <ChatBox />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1b1c1b' },
  titleContainer: { padding: 20, alignItems: 'center', backgroundColor: 'rgba(27, 28, 27, 0.8)' },
  title: { fontSize: 24, color: '#2563eb', marginBottom: 4 },
  body: { fontSize: 16, color: '#2563eb', opacity: 0.9 },
  mainContent: { flex: 1 },
});

export default Receptionist;
