import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';

// Import your type definitions
import { Message, ChatAPIResponse, ChatWindowProps } from  "../types/chat"; // Adjust path if you put types in a different folder

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat window whenever messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(''); // Clear input immediately

    setIsLoading(true);
    const API_URL: string = 'http://localhost:3000/chats'; // Your Node.js backend URL

    try {
      // Type the axios response data
      const response = await axios.post<ChatAPIResponse>(API_URL, { query: inputValue });
      const botResponseText: string = response.data.naturalLanguageResponse || "Sorry, I couldn't process that.";
      const botMessage: Message = { sender: 'bot', text: botResponseText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Optional: Log other data for debugging
      console.log('Generated Query:', response.data.generatedQuery);
      console.log('Raw Data:', response.data.rawData);

    } catch (error: any) { // Use 'any' for error for flexibility, or more specific Error types
      console.error('Error sending message:', error);
      let errorMessage: string = 'Oops! Something went wrong. Please try again.';
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        // Assuming your backend sends an error response with a 'message' field
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `Network error: ${error.message}`;
      }
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: errorMessage, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Assistant</h3>
        <button className="close-chat-btn" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div className="chat-welcome">
            Hi there! Ask me anything about your DFL reports.
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">Thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;