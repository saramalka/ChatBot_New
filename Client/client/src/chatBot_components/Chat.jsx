import  {  useState } from 'react';
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from '../features/chat/chatSlice';
import '../styles/chat.css';
const ChatComponent = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const token = localStorage.getItem('token');
  const { data: messages = [], refetch } = useGetMessagesQuery(token);
  const [sendMessage] = useSendMessageMutation();

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      setIsBotTyping(true);
      await sendMessage({ message: newMessage }).unwrap();
      setNewMessage('');
      refetch();
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
        <button onClick={handleSend} disabled={isBotTyping}> שלח</button>
      </div>
    </div>
  );
};

export default ChatComponent;
