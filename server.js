const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Parsing json requests
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'securepassword4265',
    port: 5432
});


// Endpoint to handle user queries
app.post('/api/query', async (req, res) => {
    console.log('Headers:', req.headers);  // Log request headers
    console.log('Raw body:', req.body);    // Log raw request body

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

// Start up the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});