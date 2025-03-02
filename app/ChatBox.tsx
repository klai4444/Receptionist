import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { CONFIG } from '../config'; // Adjust path as needed

const API_KEY = CONFIG.OPENAI_API_KEY;
const ASSISTANT_ID = "asst_jNXRblRWrlyLWQc8Jgf1MsmX";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hi! I'm your virtual receptionist for Mudd Library. How can I help you?", sender: 'bot' }
  ]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [officeHoursSent, setOfficeHoursSent] = useState(false);

  // Create a thread when the component mounts
  useEffect(() => {
    createThread();
  }, []);

  // Create a new thread
  const createThread = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/threads',
        {},
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
        }
      );
      
      setThreadId(response.data.id);
    } catch (error) {
      console.error('Error creating thread:', error);
      
      let errorMessage = 'Failed to create thread. ';
      
      if (axios.isAxiosError(error)) {
        errorMessage += `Status: ${error.response?.status || 'Unknown'}, `;
        errorMessage += `Message: ${error.response?.data?.error?.message || error.message || 'Unknown error'}`;
      } else {
        errorMessage += String(error);
      }
      
      setError(errorMessage);
      
      // Display a single error message to the user
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          sender: 'bot',
        },
      ]);
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }

    // Add user message to the UI
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage(''); // Clear input field
    setIsLoading(true);
    setError(null);

    try {
      // If no thread exists, create one first
      if (!threadId) {
        await createThread();
      }

      if (!threadId) {
        throw new Error("Failed to create thread. Cannot proceed.");
      }

      // Send message to thread
      await axios.post(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        {
          role: "user",
          content: currentMessage
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
        }
      );
      
      // Run the assistant
      const runResponse = await axios.post(
        `https://api.openai.com/v1/threads/${threadId}/runs`,
        {
          assistant_id: ASSISTANT_ID,
          additional_instructions: "Use the vector store for retrieving context when responding. Only give responses based off of the documents. DO NOT MENTION YOU HAVE DOCUMENTS.",
          tools: [{"type": "file_search"}]
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
        }
      );
      
      const runId = runResponse.data.id;
      
      // Poll for response
      await pollRunStatus(threadId, runId);
    } catch (error) {
      console.error('Error in message flow:', error);
      
      let errorMessage = 'Failed to process message. ';
      
      if (axios.isAxiosError(error)) {
        errorMessage += `Status: ${error.response?.status || 'Unknown'}, `;
        errorMessage += `Message: ${error.response?.data?.error?.message || error.message || 'Unknown error'}`;
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += String(error);
      }
      
      setError(errorMessage);
      
      // Display a user-friendly error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "I'm sorry, I couldn't process your message. Please try again.",
          sender: 'bot',
        },
      ]);
      
      setIsLoading(false);
    }
  };

  // Poll for the run status and get the assistant's response
  const pollRunStatus = async (threadId: string, runId: string) => {
    let runStatus = 'in_progress';
    let attempts = 0;
    const maxAttempts = 30; // Reduced to avoid excessive polling
   
    while ((runStatus === 'in_progress' || runStatus === 'queued' || runStatus === 'requires_action') && attempts < maxAttempts) {
      try {
        attempts++;
       
        // Add a small delay to avoid hammering the API
        await new Promise(resolve => setTimeout(resolve, 1000));
       
        const runResponse = await axios.get(
          `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2',
            },
          }
        );
       
        runStatus = runResponse.data.status;
       
        // Handle the case where the run requires action (tool execution)
        if (runStatus === 'requires_action') {
          // Check if tool outputs need to be submitted
          if (runResponse.data.required_action &&
              runResponse.data.required_action.type === 'submit_tool_outputs' &&
              runResponse.data.required_action.submit_tool_outputs.tool_calls) {
           
            const toolCalls = runResponse.data.required_action.submit_tool_outputs.tool_calls;
            const toolOutputs = [];
           
            // Process each tool call
            for (const toolCall of toolCalls) {
              console.log(`Tool call requested: ${toolCall.function?.name}`);
             
              // Add the tool output (approving the tool call)
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify({ results: "Approved" }) // General approval response
              });
            }
           
            // Submit the tool outputs back to the API
            await axios.post(
              `https://api.openai.com/v1/threads/${threadId}/runs/${runId}/submit_tool_outputs`,
              {
                tool_outputs: toolOutputs
              },
              {
                headers: {
                  'Authorization': `Bearer ${API_KEY}`,
                  'Content-Type': 'application/json',
                  'OpenAI-Beta': 'assistants=v2',
                },
              }
            );
           
            // Continue polling as the run is still in progress
            runStatus = 'in_progress';
            continue;
          }
        }
       
        if (runStatus === 'completed') {
          // Get the messages from the thread
          const messagesResponse = await axios.get(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            {
              headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2',
              },
            }
          );
         
          // The most recent message should be the assistant's response
          const assistantMessages = messagesResponse.data.data.filter(
            (msg: any) => msg.role === 'assistant'
          );
         
          if (assistantMessages.length > 0) {
            const latestMessage = assistantMessages[0];
            let messageContent = latestMessage.content[0].text.value;
            messageContent = messageContent
           
            setMessages(prev => [
              ...prev,
              {
                id: Date.now(),
                text: messageContent,
                sender: 'bot',
              },
            ]);
          } else {
            setMessages(prev => [
              ...prev,
              {
                id: Date.now(),
                text: "I didn't receive a response. Please try again.",
                sender: 'bot',
              },
            ]);
          }
         
          break;
        } else if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
          // Display error message with more details if available
          let errorMessage = "I'm sorry, I couldn't process your request. ";
         
          if (runResponse.data.last_error) {
            errorMessage += `Error: ${runResponse.data.last_error.message}`;
          } else {
            errorMessage += "Please try again.";
          }
         
          setMessages(prev => [
            ...prev,
            {
              id: Date.now(),
              text: errorMessage,
              sender: 'bot',
            },
          ]);
         
          break;
        }
      } catch (error) {
        console.error('Error polling run status:', error);
       
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            text: "I'm having trouble retrieving the response. Please try again.",
            sender: 'bot',
          },
        ]);
       
        break;
      }
    }
   
    if (attempts >= maxAttempts) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "The response is taking longer than expected. Please try again later.",
          sender: 'bot',
        },
      ]);
    }
   
    setIsLoading(false);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>An error occurred. Please try again.</Text>
        </View>
      )}
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text 
              style={msg.sender === 'user' ? styles.messageText : styles.botMessageText}
            >
              {msg.text}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Assistant is typing...</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          onKeyPress={handleKeyPress}
          multiline
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (isLoading || !message.trim()) && styles.disabledButton]} 
          onPress={handleSend}
          disabled={isLoading || !message.trim()}
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
    backgroundColor: 'rgb(204, 196, 223)',
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
    backgroundColor: 'rgb(255, 255, 255)',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: 'rgb(255, 255, 255)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    color: 'rgb(0, 0, 0)',
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
    backgroundColor: 'rgb(204, 196, 223)',
    padding: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    color: 'rgb(0, 0, 0)',
    backgroundColor: 'rgb(255, 255, 255)',
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