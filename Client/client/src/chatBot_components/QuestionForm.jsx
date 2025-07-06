import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion, clearMessages } from '../features/questions/questionsSlice';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Textarea } from 'primereact/textarea';

const QuestionForm = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(state => state.questions);

  const [questionId, setQuestionId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [reply, setReply] = useState('');
  const [optionText, setOptionText] = useState('');
  const [nextQuestionId, setNextQuestionId] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const addOption = () => {
    if (optionText && nextQuestionId) {
      setOptions([...options, { text: optionText, nextQuestionId }]);
      setOptionText('');
      setNextQuestionId('');
    }
  };

  const handleSubmit = () => {
    if (!questionId.trim()) {
      alert('יש להזין ID לשאלה');
      return;
    }

    const questionData = {
      questionId,
      questionText: questionText.trim() || undefined,
      reply: reply.trim() || undefined,
      options,
    };

    dispatch(addQuestion(questionData));

    setQuestionId('');
    setQuestionText('');
    setReply('');
    setOptions([]);
  };

  return (
    <Card title="הזנת שאלה חדשה" className="p-4 max-w-2xl mx-auto">
      <div className="p-fluid space-y-3">
        <span className="p-float-label">
          <InputText value={questionId} onChange={(e) => setQuestionId(e.target.value)} />
          <label>ID של השאלה</label>
        </span>

        <span className="p-float-label">
          <InputText value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
          <label>שאלה להצגה</label>
        </span>

        <span className="p-float-label">
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} autoResize rows={2} />
          <label>תשובה חופשית (לא חובה)</label>
        </span>

        <div className="flex gap-2">
          <InputText
            placeholder="טקסט אופציה"
            value={optionText}
            onChange={(e) => setOptionText(e.target.value)}
          />
          <InputText
            placeholder="ID שאלה הבאה"
            value={nextQuestionId}
            onChange={(e) => setNextQuestionId(e.target.value)}
          />
          <Button label="הוסף אופציה" onClick={addOption} />
        </div>

        {options.length > 0 && (
          <ul className="list-disc ml-4">
            {options.map((opt, idx) => (
              <li key={idx}>{opt.text} → {opt.nextQuestionId}</li>
            ))}
          </ul>
        )}

        {error && <p className="text-red-600">{error}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}

        <Button label="שמור שאלה" className="mt-4" onClick={handleSubmit} loading={loading} />
      </div>
    </Card>
  );
};

export default QuestionForm;
