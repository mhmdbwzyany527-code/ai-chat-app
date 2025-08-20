const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔑 تأكد أنك حاط مفتاحك هنا في Render Environment Variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

// يخدم الملفات من مجلد public
app.use(express.static("public"));

// صفحة البداية index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// API الدردشة
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",   // تقدر تخليها gpt-4 لو عندك
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
