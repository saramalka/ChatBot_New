import React, { useState, useEffect } from 'react';
import { useSendMessageMutation } from '../features/chat/chatSlice';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    const startChat = async () => {
      try {
        const data = await sendMessage({ message: 'התחל' }).unwrap();
console.log(data);

        const newMessages = [];

        if (data.reply) {
          newMessages.push({ role: 'bot', content: data.reply });
        }

        if (data.question && data.options) {
          newMessages.push({ role: 'bot', content: data.question });
          setOptions(data.options);
          setCurrentQuestionId(data.questionId);
        }

        setMessages(newMessages);
      } catch (err) {
        console.error('שגיאה בתחילת שיחה:', err);
        setMessages([{ role: 'bot', content: 'שגיאה בתחילת שיחה' }]);
      }
    };

    startChat();
  }, []);

  // שליחת תשובה חופשית
  const submit = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const data = await sendMessage({ message: input }).unwrap();

      const botMessages = [];

      if (data.reply) {
        botMessages.push({ role: 'bot', content: data.reply });
      }

      if (data.question && data.options) {
        botMessages.push({ role: 'bot', content: data.question });
        setOptions(data.options);
        setCurrentQuestionId(data.questionId);
      } else {
        setOptions([]);
        setCurrentQuestionId(null);
      }

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (err) {
      console.error('שגיאה בשליחה:', err);
      setMessages((prev) => [...prev, { role: 'bot', content: 'שגיאה בשליחה לשרת' }]);
    }

    setInput('');
  };

  // בחירת אופציה
  const handleOptionClick = async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const data = await sendMessage({
        selectedOptionText: text,
        currentQuestionId,
      }).unwrap();

      const botMessages = [];

      if (data.reply) {
        botMessages.push({ role: 'bot', content: data.reply });
      }

      if (data.question && data.options) {
        botMessages.push({ role: 'bot', content: data.question });
        setOptions(data.options);
        setCurrentQuestionId(data.questionId);
      } else {
        setOptions([]);
        setCurrentQuestionId(null);
      }

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (err) {
      console.error('שגיאה בבחירת אופציה:', err);
      setMessages((prev) => [...prev, { role: 'bot', content: 'שגיאה בשליחה לשרת' }]);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4 font-semibold text-center">צ'אטבוט</h2>

      <div className="space-y-2">
        {messages.map((msg, index) => (
          <Card key={index} className={msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}>
            <p><strong>{msg.role === 'user' ? 'את/ה' : 'בוט'}:</strong> {msg.content}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((opt) => (
          <Button
            key={opt._id}
            label={opt.text}
            onClick={() => handleOptionClick(opt.text)}
            severity="secondary"
          />
        ))}

      </div>

      <div className="mt-4 flex gap-2">
        <InputText
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          placeholder="הקלד הודעה חופשית..."
        />
        <Button label="שלח" onClick={submit} loading={isLoading} />
      </div>
    </div>
  );
};

export default ChatPage;
