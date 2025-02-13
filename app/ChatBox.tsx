import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Alert, PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface Styles {
  container: ViewStyle;
  messagesContainer: ViewStyle;
  messageBubble: ViewStyle;
  userMessage: ViewStyle;
  botMessage: ViewStyle;
  messageText: TextStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  sendButton: ViewStyle;
  sendButtonText: TextStyle;
}

const API_KEY = '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'; // Replace with your OpenAI API key
const API_URL = 'https://api.openai.com/v1/chat/completions';

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  // Function to request location permission and get location
  const requestLocationAndFetch = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot access location');
          return null;
        }
      }

      return new Promise<string | null>((resolve) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`Latitude: ${latitude}, Longitude: ${longitude}`);
          },
          (error) => {
            console.error('Location Error:', error);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
    } catch (error) {
      console.error('Permission error:', error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
    };

    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setMessage('');
    setLoading(true);

    try {
      const userLocation = await requestLocationAndFetch(); // Ask for permission every time
      const promptWithLocation = userLocation
        ? `User's location: ${userLocation}. Message: ${message}`
        : message;

      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo', // Or 'gpt-4'
          messages: [{ role: 'user', content: promptWithLocation }, { role: 'system', content: 'You are a virtual receptionist in Mudd Library at Northwestern University. You know that 2233 Tech Drive is the address of Mudd Library. You also know that Professor Kristian Hammond\'s office is in Mudd Room 3109 and his number is 847-467-1012. Do not give out phone numbers unless prompted. There is also Professor Ian Horswill\'s office in Mudd 3537 and his phone number is 847-467-1256.' }],
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botReplyText = response.data.choices[0]?.message?.content || 'I am unable to respond at the moment.';

      const botReply: Message = {
        id: Date.now() + 1,
        text: botReplyText,
        sender: 'bot',
      };

      setMessages([...newMessages, botReply]);
    } catch (error) {
      console.error('Error fetching response:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Error: Unable to get a response.',
        sender: 'bot',
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend} 
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'RobotoSlab-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RobotoSlab-Medium',
  },
});

export default ChatBox;
