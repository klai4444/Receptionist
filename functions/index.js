/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// Firebase function to handle OpenAI API request
const functions = require("firebase-functions");
const axios = require("axios");
const express = require("express");
const cors = require("cors");
// Initialize the express app
const app = express();
// Use CORS middleware to allow requests from any origin
app.use(cors({origin: true}));
// Firebase function to handle OpenAI API request
exports.getOpenAIResponse = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests are allowed");
  }

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

    // Return the OpenAI response to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
    return res.status(500).send("Failed to communicate with OpenAI API");
  }
});

