import React, { useState } from 'react';
import {useGetQuickRepliesQuery,useAddQuickReplyMutation,useDeleteQuickReplyMutation,} from '../features/admin/answerApi';

export default function AdminQuickRepliesPage() {
  const { data: replies = [], isLoading } = useGetQuickRepliesQuery();
  const [addReply] = useAddQuickReplyMutation();
  const [deleteReply] = useDeleteQuickReplyMutation();
  const [newText, setNewText] = useState('');

  const handleAdd = async () => {
    if (newText.trim()) {
      await addReply({ text: newText });
      setNewText('');
    }
  };

  return (
    <div>
      <h2>תשובות קבועות</h2>
      <input
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder="תשובה חדשה"
      />
      <button onClick={handleAdd}>הוסף</button>

      {isLoading ? (
        <p>טוען...</p>
      ) : (
        <ul>
          {replies.map((r) => (
            <li key={r._id}>
              {r.text}
              <button onClick={() => deleteReply(r._id)}>מחק</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
