import React from 'react';
import { Text, View, StyleSheet } from "react-native";

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

