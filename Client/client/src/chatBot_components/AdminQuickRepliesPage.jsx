import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useGetQuickRepliesQuery, useAddQuickReplyMutation, useDeleteQuickReplyMutation, useUpdateQuickReplyMutation } from '../features/admin/answerApi';

export default function AdminQuickRepliesPage() {
  const { data: replies = [], isLoading } = useGetQuickRepliesQuery();
  const [addReply] = useAddQuickReplyMutation();
  const [updateReply] = useUpdateQuickReplyMutation();
  const [deleteReply] = useDeleteQuickReplyMutation();

  const [newQuestion, setNewQuestion] = useState('');
  const [newText, setNewText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editQuestion, setEditQuestion] = useState('');
  const [editText, setEditText] = useState('');
  const [selectedReply, setSelectedReply] = useState(null);

  const handleAdd = async () => {
    if (newQuestion.trim() && newText.trim()) {
      await addReply({ question: newQuestion, text: newText });
      setNewQuestion('');
      setNewText('');
    }
  };

  const handleDelete = async (id) => {
    await deleteReply(id);
  };

  const openEditDialog = (reply) => {
    setSelectedReply(reply);
    setEditQuestion(reply.question);
    setEditText(reply.text);
    setEditDialogVisible(true);
  };

  const handleEditSave = async () => {
    if (editQuestion.trim() && editText.trim()) {
      await updateReply({ _id: selectedReply._id, question: editQuestion, text: editText });
      setEditDialogVisible(false);
    }
  };

  const filteredReplies = replies.filter((r) =>
    r.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-column align-items-center justify-content-center p-4">
      <Card title="שאלות ותשובות קבועות" className="w-full md:w-6">
        <div className="flex flex-column gap-2 mb-4">
          <InputText
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="שאלה חדשה"
          />
          <InputText
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="תשובה חדשה"
          />
          <Button label="הוסף" icon="pi pi-plus" onClick={handleAdd} />
        </div>

        <div className="flex mb-4">
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            placeholder="חפש לפי שאלה או תשובה..."
          />
        </div>

        {isLoading ? (
          <p>טוען...</p>
        ) : (
          <div className="flex flex-column gap-2">
            {filteredReplies.length > 0 ? (
              filteredReplies.map((r) => (
                <div
                  key={r._id}
                  className="flex justify-content-between align-items-center border-round p-2 shadow-1"
                >
                  <div>
                    <strong>שאלה:</strong> {r.question}<br />
                    <strong>תשובה:</strong> {r.text}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-info"
                      onClick={() => openEditDialog(r)}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-sm p-button-danger"
                      onClick={() => handleDelete(r._id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>לא נמצאו תוצאות תואמות.</p>
            )}
          </div>
        )}
      </Card>

      <Dialog header="עריכת שאלה ותשובה" visible={editDialogVisible} onHide={() => setEditDialogVisible(false)}>
        <div className="flex flex-column gap-3">
          <InputText value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} placeholder="שאלה" />
          <InputText value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="תשובה" />
          <div className="flex justify-content-end gap-2 mt-2">
            <Button label="שמירה" icon="pi pi-check" onClick={handleEditSave} />
            <Button label="ביטול" icon="pi pi-times" className="p-button-secondary" onClick={() => setEditDialogVisible(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
