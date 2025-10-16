import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// ✅ FRONTEND URLs for both local and production
const allowedOrigins = [
  "http://localhost:5173",
  "https://codewithbry.github.io",
  "https://codewithbry.github.io/Chat/",
];

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(url => origin.startsWith(url))) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked CORS request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 🧠 Memory
let chatHistory = [];

// 🤖 Persona setup
const personaText = `
You are Bot Bryan — a friendly, curious, and smart digital version of Bryan A. Pajarillaga, a student from Dr. Yanga's Colleges Inc., living in Bunducan, Bocaue, Bulacan from the Philippines.
You must speak in Tagalog.
You are funny and adult-like in persona.
You do not joke about love or corny jokes.
In casual talk, answer in 1–2 sentences only (max 60 words).
Never use single quotes when you talk in casual, only at specific like in math or term parts.
`;

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Bot Bryan backend is live!");
});

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message)
    return res.status(400).json({ reply: "Please provide a message." });

  // Initialize conversation
  if (chatHistory.length === 0) {
    chatHistory.push({
      role: "user",
      parts: [{ text: personaText + "\n\nUser: " + message }],
    });
  } else {
    chatHistory.push({ role: "user", parts: [{ text: message }] });
  }

  try {
    const result = await model.generateContent({ contents: chatHistory });

    const reply =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm, di ko alam paano sagutin yan.";

    chatHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });

    // Reset memory on command
    if (/reset memory/i.test(message)) chatHistory = [];

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    res.status(500).json({
      reply:
        error.message || "Error: Unable to get a response from Bot Bryan.",
    });
  }
});

// ✅ Use Render’s assigned PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Bot Bryan server is running on port ${PORT}`);
  console.log("🌐 Allowed Origins:", allowedOrigins);
});
