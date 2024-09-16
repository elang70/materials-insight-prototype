const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
readline = require('readline');

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

// Endpoint to handle functionality when user makes a post request to http://localhost:3001/api/query
app.post('/api/query', async (req, res) => {
    const { alloy, query, response } = req.body;

    if (!alloy || !query || !response) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const result = await pool.query(
            'INSERT INTO queries (alloy, query,response) VALUES ($1, $2, $3) RETURNING *',
            [alloy, query, response]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/inquiry', async (req, res) => {
    const alloy = req.body.alloy;
    const inquiry = req.body.inquiry;

    try{
        const response = await callChatGPT(inquiry);
        res.send({response});
        console.log(response);
    } catch (error) {
        console.error('Error calling ChatGPT:', error);
        res.status(500).send('Error calling ChatGPT')
    }
    
});

// Start up the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});