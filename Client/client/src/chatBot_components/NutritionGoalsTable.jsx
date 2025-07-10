import { ProgressSpinner } from 'primereact/progressspinner';
import ChatComponent from './Chat';
import '../styles/nutritition.css'

export default function NutritionGoalsTable({ initialGoals, isLoading, changeGoalStatus, getStatusLabel, showChat, setShowChat }) {
  if (initialGoals.length === 0 && !isLoading) return null;

  return (
    <>
      <div className="nutrition-section">
        <h3>הצעות תזונה ראשוניות</h3>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '10px' }}>
            <ProgressSpinner />
          </div>
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
                          onClick={() => changeGoalStatus(goal.id, status)}
                        >
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

      <button className={`chat-toggle ${showChat ? 'open' : ''}`} onClick={() => setShowChat(!showChat)}>
        <img src="http://localhost:2200/bot.png" alt="bot icon" />
        <span className="chat-text">התזונאי שלך</span>
        {showChat && <span className="close-text">× סגור</span>}
      </button>

      {showChat && <div className="chat-box"><ChatComponent /></div>}
    </>
  );
}
