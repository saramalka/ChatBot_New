import React, { useEffect, useState } from 'react';
import NutritionForm from './NutritionForm';
import NutritionGoalsTable from './NutritionGoalsTable';
import ChatComponent from './Chat';
import {
  useLazyGetInitialGoalsQuery,
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
  const token=localStorage.getItem('token');
  const { data: fetchedHealthData } = useGetHealthDataQuery(token);
  const [getInitialGoals] = useLazyGetInitialGoalsQuery();
  const [saveHealthData] = useSaveHealthDataMutation();
  const [updateNutritionGoals] = useUpdateNutritionGoalsMutation();

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
    console.log("Saving health data:", healthData);
   console.log("USER FROM TOKEN:", localStorage.getItem('token'));

      console.log("fetchedHealthData:", fetchedHealthData);
  }, [fetchedHealthData]);

  const handleSave = async () => {
    try {
      
      await saveHealthData(healthData).unwrap();
      await refetch();
      setIsLoading(true);
      const result = await getInitialGoals().unwrap();
      setIsLoading(false);
      if (Array.isArray(result?.nutritionGoals)) {
        const enrichedGoals = result.nutritionGoals.map((goal, index) => ({
          ...goal,
          id: goal.id || index.toString()
        }));
        setInitialGoals(enrichedGoals);
      } else {
        console.error("nutritionGoals is not an array", result);
      }
    } catch (err) {
      console.error("getInitialGoals error:", err);
    }
  };

  const changeGoalStatus = async (goalId, newStatus) => {
    const updatedGoals = initialGoals.map(goal =>
      goal.id === goalId ? { ...goal, status: newStatus } : goal
    );
    setInitialGoals(updatedGoals);
    try {
      await updateNutritionGoals(updatedGoals).unwrap();
    } catch (err) {
      alert('err changeGoalStatus');
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

      <NutritionForm
        healthData={healthData}
        setHealthData={setHealthData}
        handleSave={handleSave}
      />

      <NutritionGoalsTable
        initialGoals={initialGoals}
        isLoading={isLoading}
        changeGoalStatus={changeGoalStatus}
        getStatusLabel={getStatusLabel}
      />

      <button className={`chat-toggle ${showChat ? 'open' : ''}`} onClick={() => setShowChat(!showChat)}>
        <img src="http://localhost:2200/bot.png" alt="bot icon" />
        <span className="chat-text">התזונאי שלך</span>
        {showChat && <span className="close-text">× סגור</span>}
      </button>

      {showChat && <div className="chat-box"><ChatComponent /></div>}
    </div>
  );
}
