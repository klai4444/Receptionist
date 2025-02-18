const functions = require("firebase-functions");
const axios = require("axios");
const express = require("express");
const cors = require("cors");

// Initialize Express app
const app = express();

// Use CORS middleware correctly
app.use(cors({origin: true}));

// Handle preflight requests
app.options("*", cors());

// Define the OpenAI API route
app.post("/getOpenAIResponse", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  const {message} = req.body;

  if (!message) {
    return res.status(400).send("Message is required");
  }

  const openAIEndpoint = "https://api.openai.com/v1/completions";
  const apiKey = functions.config().openai.api_key;

  try {
    const response = await axios.post(
        openAIEndpoint,
        {
          model: "gpt-4o",
          prompt: message,
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
    return res.status(500).send("Failed to communicate with OpenAI API");
  }
});

// Export Firebase function
exports.api = functions.https.onRequest(app);
