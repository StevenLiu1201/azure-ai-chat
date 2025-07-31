// js/app.js
document.getElementById("sendButton").addEventListener("click", sendMessage);

const chat = document.querySelector(".chat-messages");

const systemPrompt = {
  role: "system",
  content:
    "You are a personal assistant that answers questions about Zhongrui Liu and his work. Use the provided context to give clear and helpful responses.",
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
    // Profile
    {
      section: "Profile",
      content:
        "Currently working at Indigenous Services Canada, where Steven designs and maintains accessible, dynamic web-based learning systems and job aid tools.",
    },
    {
      section: "Profile",
      content:
        "Steven has a proven ability to manage projects independently and collaboratively, troubleshoot complex technical issues, and quickly adapt to new tools and frameworks.",
    },
    {
      section: "Profile",
      content:
        "He holds a Government of Canada Reliability Clearance and is consistently recognized for professionalism, time management, and teamwork in fast-paced development environments.",
    },

    // Education
    {
      section: "Education",
      content:
        "Graduated in April 2025 from Algonquin College with a diploma in Web Development & Internet Applications, with hands-on experience in building secure, full-stack web applications.",
    },
    {
      section: "Education",
      content:
        "Steven holds a Master of Engineering in Electrical and Computer Engineering from the University of Windsor.",
    },

    // Work Experience - Indigenous Services Canada
    {
      section: "Work Experience",
      content:
        "Steven currently works as a Programming Officer (PM1) at Indigenous Services Canada, since May 2024.",
    },
    {
      section: "Work Experience",
      content:
        "At ISC, he designs, develops, and maintains interactive web-based job aids and e-learning courses on the Moodle platform.",
    },
    {
      section: "Work Experience",
      content:
        "He creates interactive activities, quizzes, and instructional videos using Articulate Rise 360, Storyline, and H5P.",
    },
    {
      section: "Work Experience",
      content:
        "Steven optimizes and enhances images with Adobe Photoshop and Illustrator to meet accessibility and design standards.",
    },
    {
      section: "Work Experience",
      content:
        "He developed a Dynamic Job Aid Framework using JavaScript, featuring reusable components and URL-based routing for scalable content delivery.",
    },

    // Work Experience - Beiming Software Corporation
    {
      section: "Work Experience",
      content:
        "From Oct 2016 to May 2017, Steven worked as a Web Developer at Beiming Software Corporation in Beijing.",
    },
    {
      section: "Work Experience",
      content:
        "He collaborated with a team to develop a website for SDIC Power Holdings Co. Ltd., using Java and MySQL.",
    },
    {
      section: "Work Experience",
      content:
        "The site streamlined tasks such as releasing announcements, managing staff files, and providing internal communication channels.",
    },

    // Work Experience - Canadian Tire
    {
      section: "Work Experience",
      content:
        "From Aug 2020 to Aug 2023, Steven worked as a Warehouse Manager at Canadian Tire in Ottawa, ON.",
    },
    {
      section: "Work Experience",
      content:
        "He handled departmental scheduling to ensure proper staffing across shifts.",
    },
    {
      section: "Work Experience",
      content:
        "He initiated a small-scale project aimed at optimizing budget management and team scheduling.",
    },

    // Skills - Programming Languages
    {
      section: "Skills",
      content:
        "Steven is proficient in programming languages including C#, PHP, Java, JavaScript, and SQL.",
    },

    // Skills - Frameworks & Libraries
    {
      section: "Skills",
      content:
        "He has experience working with frameworks and libraries such as ASP.NET Core, React, and jQuery.",
    },

    // Skills - Tools
    {
      section: "Skills",
      content:
        "Steven is familiar with tools like Git, Visual Studio, Postman, and Azure for development and deployment.",
    },

    // Skills - Learning Content Development
    {
      section: "Skills",
      content:
        "He uses tools like Moodle, Articulate Rise 360, Storyline, H5P, and Adobe Captivate for developing e-learning content.",
    },

    // Skills - Design Tools
    {
      section: "Skills",
      content:
        "Steven is skilled in using Adobe Photoshop and Adobe Illustrator for creating and editing multimedia content.",
    },
    // Projects
    {
      section: "Projects",
      content:
        "Steven created the 'Dynamic Job Aid Framework', allowing dynamic loading of training pages based on URL parameters.",
    },
    {
      section: "Projects",
      content:
        "He built a personal finance dashboard app using React, Node.js, and MySQL.",
    },
    {
      section: "Projects",
      content:
        "He designed a CMS-based service management website for a massage business using PHP and the Google Sheets API as a backend CMS.",
    },
    {
      section: "Projects",
      content:
        "He developed and deployed a custom Azure OpenAI-powered chat assistant to support course Q&A and HR inquiries.",
    },
    {
      section: "Projects",
      content:
        "Steven built a Restaurant Review System as a lab project, designing a RESTful API using ASP.NET Core to manage restaurant reviews stored in XML format.",
    },
    {
      section: "Projects",
      content:
        "He created a client-side ASP.NET MVC Core application to consume the API, parse XML responses, and display reviews using Razor Views.",
    },
    {
      section: "Projects",
      content:
        "The restaurant review API and application were tested and integrated using a local IIS deployment.",
    },
  ];

  messages.splice(1, 0, {
    role: "system",
    content:
      "Relevant document data:\n" +
      matchedChunks.map((chunk) => chunk.content).join("\n"),
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
