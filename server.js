require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3002;
const path = require('path');  // Make sure to require 'path'

// Airtable API details
const airtableApiUrlMenuTable = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_MENU_NAME}`;
const airtableApiUrlReviewsTable = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_REVIEWS_NAME}`;
const airtableToken = process.env.AIRTABLE_API_KEY;

// Enable CORS (for testing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
// Route to fetch menu items from Airtable
app.get('/api/menu', async (req, res) => {
    try {
        const response = await fetch(airtableApiUrlMenuTable, {
            headers: {
                Authorization: `Bearer ${airtableToken}`
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Airtable' });
    }
});

// Route to fetch menu items from Airtable
app.get('/api/reviews', async (req, res) => {
    try {
        const response = await fetch(airtableApiUrlReviewsTable, {
            headers: {
                Authorization: `Bearer ${airtableToken}`
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Airtable' });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//-------------------------------------------------------SENDING USER INFO TO MAILERLITE--------------------------------------------------------------
const axios = require('axios');

const BASE_URL = 'https://api.mailerlite.com/api/v2';

// Use the built-in Express middleware to parse JSON requests
app.use(express.json());

app.post('/api/subscribe', async (req, res) => {
    const { email, discount_code } = req.body; // Extracting name and email from request body
    try {
        const subscriberData = {
            email: email,
            fields: {
                discount_code: discount_code,
            },
            groups: [process.env.MAILERLITE_GROUP_ID],
        };

        const subscribeResponse = await axios.post(`${BASE_URL}/subscribers`, subscriberData, {
            headers: {
                'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY,
                'Content-Type': 'application/json',
            },
        });

        res.status(200).json({ message: 'Subscriber added successfully', data: subscribeResponse.data });
    } catch (error) {
        console.error('Error subscribing user:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error subscribing user', details: error.response ? error.response.data : error.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


