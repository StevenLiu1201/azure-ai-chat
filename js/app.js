// js/app.js
document.getElementById("sendButton").addEventListener("click", sendMessage);

const chat = document.querySelector(".chat-messages");

const systemPrompt = {
  role: "system",
  content:
    "You are a course assistant to help students understand the structure of this training program. You can explain the purpose of each module, what topics are covered, and how different sections connect together.",
};

let messages = [systemPrompt];

function appendMessage(role, content) {
  const msg = document.createElement("div");
  msg.className = "message " + role;
  msg.textContent = (role === "user" ? "👤 You: " : "🧑‍💼 Officer: ") + content;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function showErrorPopup(message) {
  const popup = document.createElement("div");
  popup.innerText = message;
  Object.assign(popup.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#f44336",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  });
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 8000);
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("user", userText);
  messages.push({ role: "user", content: userText });
  input.value = "";

  const matchedChunks = [
    "The training team name is DDR Training Team.",
    "Members include Zhongrui, Nicole B., and John A.",
    "The course is designed to be completed step by step...",
    "If you're unsure where to start, begin with the 'Introduction' module...",
    "The Reference Guide summarizes key content from each module...",
    "The Reference Guide can be accessed at any time from the course menu.",
  ];

  messages.splice(1, 0, {
    role: "system",
    content: "Relevant document data:\n" + matchedChunks.join("\n"),
  });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, max_tokens: 4096, temperature: 1 }),
    });

    if (response.status === 429) {
      showErrorPopup("Too many requests (free quota hit). Try again later.");
      return;
    }

    if (!response.ok) {
      showErrorPopup("Unexpected error: " + response.statusText);
      return;
    }

    const data = await response.json();
    const assistantReply = data.choices[0].message.content;
    messages.push({ role: "assistant", content: assistantReply });
    appendMessage("assistant", assistantReply);
  } catch (err) {
    showErrorPopup("Network error or something went wrong.");
  }
}
