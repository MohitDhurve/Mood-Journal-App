require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const port = process.env.PORT || 3000;

// console.log('Environment Variables:', {
//     USERNAME: process.env.USER,
//     PASSWORD: process.env.PASSWORD
// });

// Load environment variables for MongoDB credentials

const userName = process.env.USER; 
const password = process.env.PASSWORD;

// MongoDB Atlas connection
mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.1zwmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'pages' directory
app.use(express.static(path.join(__dirname, 'pages')));

// Schema of the database
const EntrySchema = new mongoose.Schema({
    mood: {
        type: String,
        required: true,
    },
    journal: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Entry = mongoose.model('Entry', EntrySchema);

// Routes
app.get('/entries', async (req, res) => {
    try {
        const entries = await Entry.find();
        res.json(entries);
    } catch (error) {
        res.status(500).send('Error retrieving entries');
    }
});

app.post('/entries', async (req, res) => {
    try {
        const { mood, journal } = req.body;
        const entry = new Entry({ mood, journal });
        await entry.save();
        res.json(entry);
    } catch (error) {
        res.status(500).send('Error creating entry');
    }
});

app.delete('/entries/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error deleting entry');
    }
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Serve the app.html file for another route (example)
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'app.html'));
});

// Error handling for unknown routes
app.use((req, res) => {
    res.status(404).send('404: Page not found');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
