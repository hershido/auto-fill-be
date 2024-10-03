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
          { text: "I need to generate details for a business: business Type, business name ,business description, uniqueness description, business goals and target audience also business location which should be some random city in the world. These business details should vary across multiple industries, vary between cool and corporate. generate only one business at a time.\n" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "```json\n{\"businessType\": \"Restaurant\", \"businessName\": \"The Cozy Kettle\", \"businessDescription\": \"A charming cafe offering a warm and inviting atmosphere, serving artisanal coffee, pastries, and light bites. We focus on using fresh, local ingredients and creating a welcoming space for community gatherings.\", \"uniquenessDescription\": \"Our unique blend of vintage decor, cozy seating arrangements, and a carefully curated menu makes The Cozy Kettle a special destination for those seeking a respite from the hustle and bustle of everyday life.\", \"businessGoals\": \"To become a beloved local institution, known for its exceptional coffee, friendly service, and welcoming ambiance. We also aim to support local farmers and artisans by sourcing our ingredients responsibly.\", \"targetAudience\": \"Professionals, students, and residents seeking a comfortable space to work, relax, or meet with friends. We cater to both individual customers and small groups.\", \"businessLocation\": \"Edinburgh, Scotland\"}\n\n```" },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
  return result;
}
