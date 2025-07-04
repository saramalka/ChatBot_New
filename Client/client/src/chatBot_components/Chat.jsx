import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/chat/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      setIsBotTyping(true);
      const res = await axios.post(
        'http://localhost:3000/api/chat',
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, { userMessage: newMessage, botReply: res.data.reply }]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className="chat-message">
          <div className="message user">
            <strong>אתה:</strong> <span>{msg.userMessage}</span>
          </div>
          <div className="message bot">
            <strong>בוט:</strong> <span>{msg.botReply}</span>
          </div>
        </div>
      ))}

      <div className="chat-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="כתוב הודעה..."
        />
        <button onClick={sendMessage}>שלח</button>
      </div>
    </div>
  );
};

export default ChatComponent;
