const express = require('express');
const pool = require('./database');
require('dotenv').config();

const app = express();
app.use(express.json());

// List all table names (sheets)
app.get('/api/sheets', async (req, res) => {
    try {
        const [rows] = await pool.query("SHOW TABLES");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Generic: fetch all records from any sheet
app.get('/api/sheets/:sheet', async (req, res) => {
    const sheet = req.params.sheet;
    try {
        const [rows] = await pool.query(`SELECT * FROM \`${sheet}\``);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Add a record to a given sheet (expects JSON {name: ...})
app.post('/api/sheets/:sheet', async (req, res) => {
    const sheet = req.params.sheet;
    try {
        const [result] = await pool.query(
            `INSERT INTO \`${sheet}\` (name) VALUES (?)`,
            [req.body.name]
        );
        res.json({ insertedId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on port ${port}`));
