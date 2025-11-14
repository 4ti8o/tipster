const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for standings
app.get('/standings', (req, res) => {
    res.sendFile(path.join(__dirname, 'standings.html'));
});

// Route for 1.5 odds
app.get('/1.5', (req, res) => {
    res.sendFile(path.join(__dirname, '1.5.html'));
});

// Route for 2.5 odds
app.get('/2.5', (req, res) => {
    res.sendFile(path.join(__dirname, '2.5.html'));
});

// Route for 3.5 odds
app.get('/3.5', (req, res) => {
    res.sendFile(path.join(__dirname, '3.5.html'));
});

// Route for BBTS
app.get('/bbts', (req, res) => {
    res.sendFile(path.join(__dirname, 'bbts.html'));
});

// Route for history
app.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, 'history.html'));
});

// Route for correct score
app.get('/correct-score', (req, res) => {
    res.sendFile(path.join(__dirname, 'correct-score.html'));
});

// API endpoint for history data
app.get('/api/history', (req, res) => {
    const history = require('./history.json');
    res.json(history);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
