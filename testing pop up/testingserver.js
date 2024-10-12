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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});









// Include the API URL, API key, base ID, and table name
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_MENU_NAME}`;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

// Function to post data to Airtable
async function postToAirtable(name, email, coupon) {
    const url = AIRTABLE_API_URL.replace('{BASE_ID}', 'your_base_id').replace('{TABLE_NAME}', 'YourTableName');

    const data = {
        records: [
            {
                fields: {
                    Name: name,
                    Email: email,
                    Coupon: coupon
                }
            }
        ]
    };

    const response = await fetch(AIRTABLE_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        console.log('Data successfully posted to Airtable');
    } else {
        console.error('Error posting data to Airtable:', response.statusText);
    }
}

// Usage example
postToAirtable('John Doe', 'john.doe@example.com', 'DISCOUNT20');