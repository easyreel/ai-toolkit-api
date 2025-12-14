const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Load .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files if needed

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/mortgage-snapshot', async (req, res) => {
  const { loanType } = req.body;

  if (!loanType) {
    return res.status(400).json({ error: 'Loan type is required' });
  }

  try {
    const prompt = `
Give me the latest 3 interest rate changes for ${loanType} loans in the U.S., including the date and rate for each change. Then write a short 2–3 sentence summary of the trend, using plain English that’s great for a social media caption.
Be concise but insightful.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // You can switch to 'gpt-4' or 'gpt-5-mini' as needed
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 250,
    });

    const result = response.choices[0].message.content.trim();
    res.json({ snapshot: result });

  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: 'Failed to generate snapshot' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
