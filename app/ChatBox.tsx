import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ id: number; text: string; sender: 'user' | 'bot' }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;  
      recognitionInstance.interimResults = true; 
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setMessage(transcript.trim());
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start(); 
        }
      };

      recognitionRef.current = recognitionInstance;
    } else {
      console.log('Speech recognition not supported in this browser');
    }
  }, []);

  const toggleVoiceRecognition = async () => {
    if (!recognitionRef.current) {
      console.log('Speech recognition not available');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
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
            <Text style={msg.sender === 'user' ? styles.messageText : styles.botMessageText}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={[styles.voiceButton, isListening ? styles.voiceButtonActive : styles.voiceButtonInactive]} 
          onPress={toggleVoiceRecognition}
        >
          <FontAwesome 
            name={isListening ? 'microphone' : 'microphone-slash'} 
            size={20} 
            color="white"
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={() => {
            setMessages([...messages, { id: Date.now(), text: message, sender: 'user' }]);
            setMessage('');
          }}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
  },
  userMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'RobotoSlab-Regular',
  },
  botMessageText: {
    color: '#1f2937',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'RobotoSlab-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#030303',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#030303',
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'RobotoSlab-Medium',
  },
  voiceButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonInactive: {
    backgroundColor: '#dc2626',
  },
  voiceButtonActive: {
    backgroundColor: '#2563eb',
  },
});

export default ChatBox;
