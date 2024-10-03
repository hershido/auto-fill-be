const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const cors = require("cors");
app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON requests
app.use(express.json());

// Example route
app.get("/", async (req, res) => {
  const response = await run();
  res.send(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            text: "I need to generate details for a business: business Type, business name ,business description, uniqueness description, business goals and target audience. These business details should vary across multiple industries, vary between cool and corporate. generate only one business at a time.\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"businessType": "Restaurant", "businessName": "The Hungry Alchemist", "businessDescription": "A modern gastropub serving inventive, globally inspired dishes with a focus on locally sourced ingredients and craft cocktails.", "uniquenessDescription": "We combine the warmth and comfort of a traditional pub with the culinary creativity and sophistication of a fine dining establishment. Our menu is constantly evolving, offering a unique and exciting experience every time you visit.", "businessGoals": "To become a renowned destination for food and drink enthusiasts in the city, known for our exceptional quality, innovative menu, and warm, inviting atmosphere.", "targetAudience": "Young professionals, foodies, and social groups seeking a unique and memorable dining experience."}\n\n```',
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
  return result;
}
