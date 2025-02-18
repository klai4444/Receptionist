const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// 🔹 Enable CORS for all origins
app.use(cors({ origin: true }));


app.use(express.json());

app.post("/api/getOpenAIResponse", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "gpt-4o",
                prompt: message,
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // 🔹 Explicitly set CORS headers in the response
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        res.json(response.data);
    } catch (error) {
        console.error("Error calling OpenAI:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch response from OpenAI" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
