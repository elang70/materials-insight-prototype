const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config()

const apiKey = process.env.OPENAI_API_KEY;

const app = express();
const port = 3001;

app.use(cors());

// Middleware: runs before request gets processed
// Parses json object into a JS object we can use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'securepassword4265',
    port: 5432
});

// Grabs alloy data from local alloy database
const alloysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'alloys.json'), 'utf8'));

// Function to call the ChatGPT API
async function callChatGPT(prompt) {
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ],
    };

    try {
        const response = await axios.post(url, data, { headers });
        const result = response.data.choices[0].message.content;
        return result;
    } catch (error) {
        console.error(
            "Error calling ChatGPT API:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

app.post('/inquiry', async (req, res) => {
    const alloy = req.body.alloy;
    const inquiry = req.body.inquiry;

    const alloyData = alloysData[alloy];
    if (!alloyData) {
        return res.status(400).send('Alloy not found');
    }

    const prompt = `Here is the data for ${alloy} alloy:\n${JSON.stringify(alloyData, null, 2)}\n\nUser Inquiry: ${inquiry}`;

    try{
        const response = await callChatGPT(prompt);
        res.send({response});
        console.log(response);
        const result = await pool.query(
            'INSERT INTO queries (alloy, query,response) VALUES ($1, $2, $3) RETURNING *',
            [alloy, inquiry, response]
        );
    } catch (error) {
        console.error('Error calling ChatGPT:', error);
        res.status(500).send('Error calling ChatGPT')
    }
    
});

// Start up the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});