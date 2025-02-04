import OpenAI from "openai";
const openai = new OpenAI({ apiKey: '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' })

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
    store: true,
});

console.log(completion.choices[0].message);