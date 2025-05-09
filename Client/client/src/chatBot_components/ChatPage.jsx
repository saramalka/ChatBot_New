import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useGetMessagesQuery, useSendMessageMutation } from '../features/chat/chatApi';

export default function ChatPage() {
  const { data: messages = [], refetch } = useGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();
  const [input, setInput] = useState('');

  const submit = async () => {
    if (!input.trim()) return;
    await sendMessage({ message: input });
    setInput('');
    refetch();
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center p-4">
      <Card title="צ'אט עם הבוט" className="w-6">
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 text-${msg.role === 'user' ? 'right' : 'left'}`}>
              <strong>{msg.role === 'user' ? 'אתה' : 'בוט'}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex">
          <InputText value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 mr-2" />
          <Button label="שלח" icon="pi pi-send" onClick={submit} />
        </div>
      </Card>
    </div>
  );
}
