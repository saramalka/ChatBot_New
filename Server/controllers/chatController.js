const ChatMessage = require('../models/ChatMessage');
const HealthDataUser = require('../models/HealthDataUser');
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'openAI_api_key',
});

const updateNutritionGoals= async (req, res) => {
  try {
  
    const healthData = await HealthDataUser.findOne({ userId: req.user.id });
    console.log("healthData" ,req.user.id)
    if (!healthData) {
      return res.status(404).json({ message: 'לא נמצאו נתוני בריאות למשתמש זה' });
    }
   console.log( req.body )
    healthData.nutritionGoals = req.body;
 
    await healthData.save();

    res.json({ message: 'עודכן בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בעדכון המטרות', error: err });
  }
}

const initial=async (req, res) => {
  try {
   
console.log("USER FROM REQUEST:", req.user);

    const healthData = await HealthDataUser.findOne({ userId: req.user.id });

    if (!healthData) {
      return res.status(404).json({ message: 'לא נמצאו נתוני בריאות למשתמש זה' });
    }
    if (healthData.nutritionGoals && healthData.nutritionGoals.length > 0) {
      //console.log("healthData",healthData)
      return res.json({ nutritionGoals: healthData.nutritionGoals, healthData });

    }

const prompt = `
אתה תזונאי מומחה ואיש כושר מוסמך. נא ליצור 4 מטרות מותאמות אישית עבור משתמש עם הנתונים הבאים:

- משקל: ${healthData.weight} ק"ג
- גובה: ${healthData.height} ס"מ
- גיל: ${healthData.age} שנים
- מין: ${healthData.gender}
- אלרגיות:${Array.isArray(healthData.allergies) ? healthData.allergies.join(', ') : healthData.allergies || ''}

כל מטרה צריכה לכלול:
1. כותרת המטרה ("title") – קצרה וברורה
2. תיאור הפעולות שהמשתמש צריך לעשות ("description") – כגון פעילות גופנית מומלצת (הליכה, ריצה, אופני כושר, חדר כושר), והרגלים תזונתיים (כמו שתיית מים, ירקות מסוימים, הימנעות ממזון מסוים)
3. יעד קלורי מומלץ ליום ("targetCalories")
4. יעד יומי לפחמימות בגרם ("targetCarbs")
5. יעד יומי לחלבון בגרם ("targetProtein")
6. יעד יומי לשומן בגרם ("targetFat")

ובשפה עברית ההצעות חייבות להיות מדויקות, מבוססות עקרונות תזונה וכושר, לא מומצאות, ולא לכלול מידע שאינו מתאים לנתוני המשתמש.
החזר אך ורק JSON תקני – מערך של אובייקטים עם השדות שצוינו. 
אל תוסיף הסברים, תגיות markdown או טקסט נוסף.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o" ,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0].message.content;
let cleaned = responseText.trim();
if (cleaned.startsWith('```json') || cleaned.startsWith('```')) {
  cleaned = cleaned.replace(/```json|```/g, '').trim();
}
    let nutritionGoals;
    try {
      nutritionGoals = JSON.parse(cleaned);
    } catch (jsonErr) {
    console.error("OpenAI החזיר תגובה לא חוקית:", cleaned);
    return res.status(500).json({ error: 'התגובה מה-OpenAI לא בפורמט JSON תקני' });
  }
    nutritionGoals = nutritionGoals.map((goal, index) => ({
      ...goal,
      status: 'notStarted' ,
      id: index.toString()
      }));

    healthData.nutritionGoals = nutritionGoals;
       

    await healthData.save();

    res.json({ nutritionGoals, healthData });
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

const healthData=async(req, res) =>{
  try {
    const { weight, height, age, gender, allergies } = req.body;

    const existing = await HealthDataUser.findOne({ userId: req.user.id });
    
    if (existing) {
      existing.weight = weight;
      existing.height = height;
      existing.age = age;
      existing.gender = gender;
      existing.allergies = allergies;
      await existing.save();
      return res.json({ message: 'עודכן בהצלחה' });
    }

console.log(req.body)
    const healthData = new HealthDataUser({
      userId: req.user.id,
      weight,
      height,
      age,
      gender,
      allergies
    });

    await healthData.save();
    res.json({ message: 'נשמר בהצלחה' });

  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשמירת נתוני הבריאות' });
  }
}
const healthDataGet =async (req, res) => {
  try {
    const data = await HealthDataUser.findOne({ userId: req.user.id });

    if (!data) return res.status(404).json({ message: 'לא נמצאו נתונים' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשליפת נתוני הבריאות' });
  }
}

const all= async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user.id });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'שגיאה בהבאת ההודעות' });
  }
}
const getUserHealthData = async (userId) => {
  return await HealthDataUser.findOne({ userId });
};

const createMessage= async (req, res) => {
  try {
    const { message } = req.body;
    const userHealthData = await getUserHealthData(req.user.id);
    const nutritionGoals = userHealthData?.nutritionGoals || [];

    let healthContext = '';
    if (userHealthData) {
      healthContext = `
      מידע רפואי:
      - משקל: ${userHealthData.weight} ק"ג
      - גובה: ${userHealthData.height} ס"מ
      - גיל: ${userHealthData.age} שנים
      - מין: ${userHealthData.gender}
      - אלרגיות: ${userHealthData.allergies}
      `;
    }

    let goalsContext = '';
if (nutritionGoals.length > 0) {
  goalsContext = 'מטרות תזונה שהוגדרו:\n' + nutritionGoals.map((goal, index) => (
    `מטרה ${index + 1}:\n` +
    `- כותרת: ${goal.title}\n` +
    `- תיאור: ${goal.description}\n` +
    `- קלוריות יעד: ${goal.targetCalories}\n` +
    `- פחמימות: ${goal.targetCarbs} גרם\n` +
    `- חלבון: ${goal.targetProtein} גרם\n` +
    `- שומן: ${goal.targetFat} גרם\n`
  )).join('\n\n');
}


    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "אתה תזונאי מוסמך. תן ייעוץ בריאותי לפי המידע האישי של המשתמש." },
        { role: "user", content: `${healthContext}\n\n${goalsContext}\n\nשאלה: ${message}` }
      ],
    });

    const botReply = chatCompletion.choices[0].message.content;

    const newChat = new ChatMessage({
      userId: req.user.id,
      userMessage: message,
      botReply
    });

    await newChat.save();
    res.json({ reply: botReply });
  } catch (error) {
    console.error('שגיאה בשיחה עם הבוט:', error);
    res.status(500).json({ error: 'שגיאה בשיחה עם הבוט' });
  }
}


module.exports= {createMessage,
  initial,updateNutritionGoals,healthData,healthDataGet,all};  