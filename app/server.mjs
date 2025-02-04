import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route to call OpenAI API
app.post('/openai', async (req, res) => {
    const { prompt } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",  // You can use gpt-4, gpt-3.5, or other models
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt },
            ],
            store: true,  // Optional
        });

        res.json(completion.choices[0].message);
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Something went wrong with OpenAI API' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
