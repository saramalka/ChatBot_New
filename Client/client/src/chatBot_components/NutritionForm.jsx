import '../styles/nutritition.css'
export default function NutritionForm({ healthData, setHealthData, handleSave }) {
  return (
    <div className="form-section">
      <h3>נתוני תזונה ובריאות</h3>
      <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <label>משקל:
          <input
            type="number"
            value={healthData.weight}
            onChange={e => setHealthData({ ...healthData, weight: e.target.value })}
          />
        </label>
        <label>גובה:
          <input
            type="number"
            value={healthData.height}
            onChange={e => setHealthData({ ...healthData, height: e.target.value })}
          />
        </label>
        <label>גיל:
          <input
            type="number"
            value={healthData.age}
            onChange={e => setHealthData({ ...healthData, age: e.target.value })}
          />
        </label>
        <label>מין:
          <select
            value={healthData.gender}
            onChange={e => setHealthData({ ...healthData, gender: e.target.value })}
          >
            <option value="">בחר</option>
            <option value="male">זכר</option>
            <option value="female">נקבה</option>
            <option value="other">אחר</option>
          </select>
        </label>
        <label>אלרגיות (מופרדות בפסיקים):
          <input
            value={healthData.allergies}
            onChange={e => setHealthData({ ...healthData, allergies: e.target.value })}
          />
        </label>
        <button type="submit">שמור</button>
      </form>
    </div>
  );
}
