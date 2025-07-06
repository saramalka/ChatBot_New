import React, { useEffect, useState } from 'react';
import '../styles/nutritition.css';
import '../styles/AuthPage.css';
import ChatComponent from './Chat';
import {
  useGetInitialGoalsQuery,
  useUpdateNutritionGoalsMutation,
  useSaveHealthDataMutation,
  useGetHealthDataQuery,
  useGetMessagesQuery
} from '../features/chat/chatSlice';


export default function Component() {
const { refetch } = useGetMessagesQuery();
  const [healthData, setHealthData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    allergies: ''
  });
  const [initialGoals, setInitialGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const userName = localStorage.getItem('username');
const { data: fetchedHealthData } = useGetHealthDataQuery();
  const { data: fetchedGoals, isLoading: goalsLoading } = useGetInitialGoalsQuery();
  const [saveHealthData] = useSaveHealthDataMutation();
  const [updateNutritionGoals] = useUpdateNutritionGoalsMutation();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };


useEffect(() => {
  if (fetchedHealthData) {
    setHealthData({
      weight: fetchedHealthData.weight ?? '',
      height: fetchedHealthData.height ?? '',
      age: fetchedHealthData.age ?? '',
      gender: fetchedHealthData.gender ?? '',
      allergies: fetchedHealthData.allergies ?? ''
    });
  }
}, [fetchedHealthData]);


useEffect(() => {
  if (fetchedGoals && fetchedGoals.nutritionGoals) {
    const enrichedGoals = fetchedGoals.nutritionGoals.map((goal, index) => ({
      ...goal,
      id: goal.id || index.toString() 
    }));
    setInitialGoals(enrichedGoals);
  }
}, [fetchedGoals]);


  const handleSave = async () => {
    try {
      await saveHealthData(healthData).unwrap();
      await refetch();
      alert('הנתונים נשמרו בהצלחה');
    } catch (err) {
      alert('שגיאה בשמירה');
    }
  };

  // const changeGoalStatus = async (index, newStatus) => {
  //   const updatedGoals = [...initialGoals];
  //   updatedGoals[index].status = newStatus;
  //   setInitialGoals(updatedGoals);
  //   try {
  //     await updateNutritionGoals(updatedGoals).unwrap();
  //   } catch (err) {
  //     alert('שגיאה בעדכון סטטוס');
  //   }
  // };
  const changeGoalStatus = async(goalId, newStatus) => {
  const updatedGoals = initialGoals.map(goal =>
    goal.id === goalId ? { ...goal, status: newStatus } : goal
  );
  console.log('Updated Goals:', updatedGoals);
  setInitialGoals(updatedGoals);
  try {
    await updateNutritionGoals(updatedGoals).unwrap();
  } catch (err) {
    alert('שגיאה בעדכון סטטוס');
  }
};


  const getStatusLabel = (status) => {
    switch (status) {
      case 'notStarted': return 'לא התחיל';
      case 'inProgress': return 'בתהליך';
      case 'completed': return 'הושלם';
      default: return status;
    }
  };
  return (
    <div className={`page-container ${initialGoals.length === 0 ? 'only-form' : ''}`}>
      <div className="title">ברוך/ה הבא/ה {userName}</div>

      <div className="form-section">
        <h3>נתוני תזונה ובריאות</h3>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>

          <label>משקל: <input type="number" value={healthData.weight} onChange={e => setHealthData({ ...healthData, weight: e.target.value })} /></label>
          <label>גובה: <input type="number" value={healthData.height} onChange={e => setHealthData({ ...healthData, height: e.target.value })} /></label>
          <label>גיל: <input type="number" value={healthData.age} onChange={e => setHealthData({ ...healthData, age: e.target.value })} /></label>
          <label>מין:
            <select value={healthData.gender} onChange={e => setHealthData({ ...healthData, gender: e.target.value })}>
              <option value="">בחר</option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
              <option value="other">אחר</option>
            </select>
          </label>
          <label>אלרגיות (מופרדות בפסיקים): <input value={healthData.allergies} onChange={e => setHealthData({ ...healthData, allergies: e.target.value })} /></label>
          <button type="submit">שמור</button>
        </form>
      </div>

      {initialGoals.length > 0 && (
        <div className="nutrition-section">
          <h3>הצעות תזונה ראשוניות</h3>
          {isLoading ? (
            <div className="dots-loader"><span></span><span></span><span></span></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>כותרת</th>
                  <th>קלוריות יעד</th>
                  <th>פחמימות</th>
                  <th>חלבון</th>
                  <th>שומן</th>
                  <th>סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {initialGoals.map((goal, i) => (
                  <tr key={i}>
                    <td>{goal.title}</td>
                    <td>{goal.targetCalories}</td>
                    <td>{goal.targetCarbs}</td>
                    <td>{goal.targetProtein}</td>
                    <td>{goal.targetFat}</td>
                    <td>
                      <div className="status-buttons">
                        {['notStarted', 'inProgress', 'completed'].map(status => (
                          <button
                            key={status}
                            className={`${status} ${goal.status === status ? 'active' : ''}`}
                            onClick={() => changeGoalStatus(goal.id, status)}>
                            {getStatusLabel(status)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <button className={`chat-toggle ${showChat ? 'open' : ''}`} onClick={() => setShowChat(!showChat)}>
        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png" alt="bot icon" />
        <span className="chat-text">התזונאי שלך</span>
        {showChat && <span className="close-text">× סגור</span>}
      </button>

      {showChat && <div className="chat-box"><ChatComponent /></div>}
    </div>
  );
}


