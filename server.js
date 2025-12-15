const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.post('/api/mortgage-snapshot', async (req, res) => {
  const { loanType } = req.body;

  try {
    const prompt = `Generate a short mortgage rate update and caption for the loan type: ${loanType}. Keep it client-friendly and engaging.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const result = response.data.choices[0].message.content;
    res.json({ snapshot: result });
  } catch (error) {
    console.error('Error generating snapshot:', error.message);
    res.status(500).json({ error: 'Error generating snapshot' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
