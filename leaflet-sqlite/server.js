const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const app = express();
const db = new sqlite3.Database('database.sqlite');

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS pins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL NOT NULL,
    lon REAL NOT NULL
)`);

app.use(cors())
// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON
app.use(bodyParser.json());

// Endpoint to get all pins from the database
app.get('/api/pins', (req, res) => {
    db.all("SELECT * FROM pins", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ pins: rows });
    });
});

// Endpoint to add a new pin
app.post('/api/pins', (req, res) => {
    const { lat, lon } = req.body;
    db.run(`INSERT INTO pins (lat, lon) VALUES (?, ?)`, [lat, lon], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
