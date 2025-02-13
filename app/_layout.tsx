import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Receptionist",
        headerTitleStyle: {
          fontFamily: 'RobotoSlab-Bold',
          fontSize: 24,
          color: '#2563eb', 
        },
        headerStyle: {
          backgroundColor: 'rgba(3, 3, 3, 0.8)',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#1b1c1b', 
        },

        headerShown: false, 
      }}
    />
  );
}