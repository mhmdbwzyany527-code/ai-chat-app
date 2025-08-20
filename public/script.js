const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");

let messages = [];

function appendMessage(sender, text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = `${sender}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  appendMessage("أنت", userMessage, "user");
  chatInput.value = "";

  messages.push({ role: "user", content: userMessage });

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "❌ خطأ";

  appendMessage("الذكاء الاصطناعي", reply, "bot");
  messages.push({ role: "assistant", content: reply });
});
