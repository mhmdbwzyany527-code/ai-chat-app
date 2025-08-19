import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// نقطة الدردشة
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // حط مفتاحك في Render
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "حدث خطأ في الخادم" });
  }
});

app.listen(port, () => {
  console.log(`✅ السيرفر يشتغل على المنفذ ${port}`);
});
