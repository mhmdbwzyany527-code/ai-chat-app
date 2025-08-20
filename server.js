// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // للدردشة
// -------- إعداد ميزة النص إلى فيديو --------
const VIDEO_UNLOCK_AT = new Date("2026-01-13T00:00:00Z"); // تاريخ الفتح
// يمكنك لاحقاً إضافة مفاتيح مزوّد الفيديو هنا مثلاً:
// const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// --- دردشة OpenAI ---
app.post("/chat", async (req, res) => {
  const message = req.body?.message;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY غير موجود" });
  if (!message) return res.status(400).json({ error: "لا توجد رسالة" });

  try {
    const r = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "أنت ARTYA AI مساعد عربي ودود ومختصر." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );
    const reply = r.data?.choices?.[0]?.message?.content?.trim() || "لم أفهم الرسالة.";
    res.json({ reply });
  } catch (e) {
    console.error("OpenAI error:", e.response?.data || e.message);
    res.status(500).json({ error: "فشل الاتصال بـ OpenAI" });
  }
});

// --- نص → فيديو (قادم) ---
app.post("/video", async (req, res) => {
  const now = new Date();
  if (now < VIDEO_UNLOCK_AT) {
    return res.status(403).json({
      locked: true,
      unlockAt: VIDEO_UNLOCK_AT.toISOString(),
      message: "الميزة ستفتح تلقائياً عند التاريخ المحدد."
    });
  }

  const prompt = (req.body?.prompt || "").trim();
  if (!prompt) return res.status(400).json({ error: "الرجاء إدخال نص" });

  try {
    // 🔧 نقطة التكامل لاحقاً:
    // 1) Stable Video Diffusion محلياً أو عبر خدمة خارجية.
    // 2) أي مزوّد يوفر Text-To-Video API.
    // يجب أن تُرجع في النهاية رابط الملف mp4.
    //
    // مثال تشغيلي مبدئي (ديمو): ارجع فيديو تجريبي داخل /public/sample.mp4
    // ضع ملفاً صغيراً باسم sample.mp4 داخل مجلد public
    const demoUrl = "/sample.mp4"; // ارفع ملف placeholder لاحقاً
    return res.json({ url: demoUrl, demo: true });

    // لو فعّلت مزوّد حقيقي، أعد:
    // return res.json({ url: realVideoUrl });
  } catch (err) {
    console.error("Video error:", err.response?.data || err.message);
    res.status(500).json({ error: "تعذّر إنشاء الفيديو حالياً" });
  }
});

app.listen(PORT, () => console.log(`✅ ARTYA AI server running on port ${PORT}`));
