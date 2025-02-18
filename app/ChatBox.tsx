import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import axios from 'axios';
import { CONFIG } from '../config';

const API_KEY = CONFIG.OPENAI_API_KEY;

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => prev + ' ' + transcript.trim());
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.log('Speech recognition not supported in this browser');
    }
  }, []);

  const toggleVoiceRecognition = async () => {
    if (!recognition) {
      console.log('Speech recognition not available');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        await recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const sendMessageToChatGPT = async (userMessage: string) => {
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const payload = {
      model: "gpt-4", 
      messages: messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })).concat({ role: 'user', content: userMessage }),
      temperature: 0.7,
    };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const chatGPTMessage = response.data.choices[0].message.content;

      // Append bot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), text: chatGPTMessage, sender: 'bot' }
      ]);
    } catch (error) {
      console.error('Error fetching ChatGPT response:', error);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      const userMessage = { id: Date.now(), text: message.trim(), sender: 'user' };
      setMessages([...messages, userMessage]);
      setMessage('');

      sendMessageToChatGPT(message.trim());
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault(); // Prevents default behavior (like adding a new line)
      handleSend();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageBubble, msg.sender === 'user' ? styles.userMessage : styles.botMessage]}
          >
            <Text style={msg.sender === 'user' ? styles.messageText : styles.botMessageText}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]} 
          onPress={toggleVoiceRecognition}
        >
          <Text style={styles.sendButtonText}>🎤</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          onKeyPress={handleKeyPress}
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030303' },
  messagesContainer: { flex: 1, padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 20, marginVertical: 6 },
  userMessage: { backgroundColor: '#2563eb', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  botMessage: { backgroundColor: '#ffffff', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  messageText: { color: '#ffffff', fontSize: 16, lineHeight: 24 },
  botMessageText: { color: '#1f2937', fontSize: 16, lineHeight: 24 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#030303' },
  input: { flex: 1, height: 40, fontSize: 16, color: '#1f2937', backgroundColor: '#f9fafb', borderRadius: 20, paddingHorizontal: 16 },
  sendButton: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  sendButtonText: { color: '#ffffff', fontSize: 16 },
  voiceButton: { backgroundColor: '#2563eb', padding: 10, borderRadius: 20, marginRight: 12, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  voiceButtonActive: { backgroundColor: '#dc2626' },
});

export default ChatBox;
