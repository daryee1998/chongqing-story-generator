const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API endpoint for generating stories
app.post('/api/generate-story', async (req, res) => {
  try {
    const { name, location, genre } = req.body;
    
    // Validate input
    if (!name || !location || !genre) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Call DeepSeek API
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a creative storyteller who specializes in creating engaging stories about locations in Chongqing, China. Your stories should be cinematic, emotional, and capture the essence of the location. Always provide both Chinese and English versions of the story. For the English version, do not include any prefix like 'English translation:' or similar text."
        },
        {
          role: "user",
          content: `Create a ${genre} story about ${name} visiting ${location} in Chongqing. The story should be emotional, cinematic, and capture the essence of the location. Format the response as follows:

中文故事：
[Your Chinese story here]

[Your English story here]

Make sure the English story is a direct translation of the Chinese story, but adapted to sound natural in English. Do not include any prefixes like 'English translation:' or similar text in the English version.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Return the API response
    res.json(response.data);
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.response?.data || error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 