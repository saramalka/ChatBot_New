const Chat = require('../models/ChatMessage');
const ChatNode = require('../models/HealthDataUser');
const mongoose=require("mongoose")
const HealthDataUser = require('../models/HealthDataUser');
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'openAI_api_key',
});


const sendMessage = async (req, res) => {
  try {
    const { message, chatNodeId } = req.body;

    if (!message) {
      const firstChatNode = await ChatNode.findOne({ answer: null });
      if (!firstChatNode) {
        return res.json({ reply: 'לא נמצאה שאלה ראשונה' });
      }

      return res.json({
        text: firstChatNode.text,
        options: firstChatNode.options,
        chatNodeId: firstChatNode._id
      });
    }

    const currentChatNode = await ChatNode.findById(chatNodeId);
    if (!currentChatNode) {
      return res.status(404).json({ reply: 'שאלה לא נמצאה' });
    }

    const selectedOption = currentChatNode.options.find(opt => opt.text === message);
    if (!selectedOption) {
      return res.status(400).json({ reply: 'לא הבנתי את הבחירה שלך' });
    }

    const nextChatNode = await ChatNode.findById(selectedOption.nextChatNodeId);
    if (!nextChatNode) {
      return res.status(404).json({ reply: 'לא נמצאה שאלה להמשיך אליה' });
    }

    return res.json({
      text: nextChatNode.text,
      options: nextChatNode.options,
      chatNodeId: nextChatNode._id
    });
  } catch (err) {
    console.error('שגיאה בשרת:', err.message);
    return res.status(500).json({ reply: 'אירעה שגיאה בשרת' });
  }
};
  
const saveAndReply = async ({ req, res, message, reply }) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          messages: [
            {
              role: 'user',
              content: message,
              timestamp: new Date()
            },
            {
              role: 'bot',
              content: reply,
              timestamp: new Date()
            }
          ]
        }
      },
      { upsert: true, new: true }
    );

    return res.json({ reply });
  } catch (err) {
    console.error('שגיאה בשמירת ההודעות למסד:', err);
    return res.status(500).json({ reply: 'שגיאה בשמירת השיחה למסד' });
  }
};

const returnMessage = async (req, res) => {
  const chat = await Chat.findOne({ userId: req.user.id });
  res.json(chat?.messages || []);
};

const returnAutoMessage = async (req, res) => {
  const { content, role } = req.body;
  const userMessage = new Message({ content, role });
  await userMessage.save();

  const botContent = `הבוט ענה: קיבלתי "${content}"`;
  const botMessage = new Message({ content: botContent, role: 'bot' });
  await botMessage.save();

  res.status(201).json({ userMessage, botMessage });
}; 

const updateNutritionGoals= async (req, res) => {
  try {
  
    const healthData = await HealthDataUser.findOne({ userId: req.user.userId });

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
    const healthData = await HealthDataUser.findOne({ userId: req.user.userId });

    if (!healthData) {
      return res.status(404).json({ message: 'לא נמצאו נתוני בריאות למשתמש זה' });
    }
 //console.log("healthData" ,healthData)
  //  console.log("healthData.initialNutritionGoals.length" ,healthData.nutritionGoals.length)
    // ✅ אם כבר קיימות מטרות – מחזיר אותן בלי לשלוח שוב ל-GPT
    if (healthData.nutritionGoals && healthData.nutritionGoals.length > 0) {
    //  console.log("yessssssss")
      return res.json({ nutritionGoals: healthData.nutritionGoals, healthData });

    }

    // המשך לקרוא ל-GPT אם אין מטרות שמורות
//     const prompt = `
// אתה תזונאי מומחה. אנא ספק 4 מטרות תזונתיות חייב שזה יהיה בנושא תזונה בריאה כושר וכד בשפה העברית מותאמות אישית עבור משתמש עם הנתונים הבאים:
// משקל: ${healthData.weight} ק"ג,
// גובה: ${healthData.height} ס"מ,
// גיל: ${healthData.age} שנים,
// מין: ${healthData.gender},
// אלרגיות: ${healthData.allergies.join(', ')}.

// אנא הצג את המטרות בפורמט JSON בלבד, במערך של אובייקטים, כאשר כל אובייקט כולל את המאפיינים:
// "title", "description", "targetCalories", "targetCarbs", "targetProtein", "targetFat".
// `;


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

ההצעות חייבות להיות מדויקות, מבוססות עקרונות תזונה וכושר, לא מומצאות, ולא לכלול מידע שאינו מתאים לנתוני המשתמש.

החזר את התוצאה בפורמט JSON בלבד – מערך של אובייקטים עם המאפיינים שצוינו מעלה.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o" ,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0].message.content;

    let nutritionGoals;
    try {
    

      nutritionGoals = JSON.parse(responseText);

  
    } catch (e) {
      return res.status(500).json({ error: 'שגיאה בפרסינג JSON מה-OpenAI' });
    }

    // console.log("nutritionGoals" ,nutritionGoals)
   nutritionGoals = nutritionGoals.map(goal => ({
  ...goal,
  status: 'notStarted' }));

    console.log("nutritionGoals" ,nutritionGoals)
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

    const existing = await HealthDataUser.findOne({ userId: req.user.userId });
    
    if (existing) {
      // עדכון אם קיים
      existing.weight = weight;
      existing.height = height;
      existing.age = age;
      existing.gender = gender;
      existing.allergies = allergies;
      await existing.save();
      return res.json({ message: 'עודכן בהצלחה' });
    }
console.log("userID" ,req.user.userId)
console.log(req.body)
    // חדש אם לא קיים
    const healthData = new HealthDataUser({
      userId: req.user.userId,
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
    const data = await HealthDataUser.findOne({ userId: req.user.userId });
    if (!data) return res.status(404).json({ message: 'לא נמצאו נתונים' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשליפת נתוני הבריאות' });
  }
}

const all= async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user.userId });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'שגיאה בהבאת ההודעות' });
  }
}

const createMessage= async (req, res) => {
  try {
    const { message } = req.body;
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: "gpt-3.5-turbo",
    });

    const botReply = chatCompletion.choices[0].message.content;

    const newChat = new ChatMessage({
      userId: req.user.userId,
      userMessage: message,
      botReply
    });

    await newChat.save();

    res.json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשיחה עם הבוט' });
  }
}

module.exports= {createMessage,
  initial,updateNutritionGoals,healthData,healthDataGet
 ,sendMessage,returnMessage,returnAutoMessage,all};  