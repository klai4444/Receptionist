import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

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
  botMessageText: TextStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  sendButton: ViewStyle;
  sendButtonText: TextStyle;
}

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), text: message.trim(), sender: 'user' }]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault(); // Prevent default enter behavior
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
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline={false} 
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

const styles = StyleSheet.create<Styles>({
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
    height: 40, // Fixed height
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
});

export default ChatBox;