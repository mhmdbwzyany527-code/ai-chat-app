// script.js
// هذا الملف مسؤول عن التفاعل مع واجهة OpenAI + التبويب + عداد + الفيديو (جاهز لفتح 2026/01/13)

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");
const tabButtons = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".tab-section");
const videoSection = document.getElementById("video-section");
const countdown = document.getElementById("countdown");

let OPENAI_API_KEY = "sk-proj-; // 🔑 ضع مفتاحك هنا
let messages = [];

// 🎨 تبديل التبويبات
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    sections.forEach((s) => s.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");
  });
});

// 📝 إرسال رسالة
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  appendMessage("أنت", userMessage, "user");
  chatInput.value = "";

  messages.push({ role: "user", content: userMessage });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;

    appendMessage("ARTYA AI", reply, "bot");
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    appendMessage("ARTYA AI", "⚠️ حدث خطأ: " + err.message, "bot");
  }
});

// 🗨️ عرض الرسائل
function appendMessage(sender, text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 📅 عدّاد ميزة الفيديو (تفتح 2026/01/13)
function updateCountdown() {
  const targetDate = new Date("2026-01-13T00:00:00").getTime();
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    countdown.textContent = "🎉 الميزة متاحة الآن!";
    // مكانك تضيف كود استدعاء API للفيديو
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdown.textContent = `${days}ي ${hours}س ${minutes}د ${seconds}ث`;
}

setInterval(updateCountdown, 1000);
