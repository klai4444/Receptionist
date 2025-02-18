import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

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
      // Create speech recognition instance
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + ' ' + transcript.trim());
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

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), text: message.trim(), sender: 'user' }]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]} 
          onPress={toggleVoiceRecognition}
        >
          <Text style={styles.sendButtonText}>🎤</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Receptionist"
          placeholderTextColor="#969696"
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
  container: {
    flex: 1,
    backgroundColor: '#212121',
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
    backgroundColor: '#2f2f2f',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#212121',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    color: '#e8e4e3',
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
    backgroundColor: '#212121',
    padding: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    color: '#e8e4e3',
    backgroundColor: '#2f2f2f',
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
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 20,
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#dc2626',
  },
});

export default ChatBox;