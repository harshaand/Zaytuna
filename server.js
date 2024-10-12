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
//-------------------------------------------------------SENDING USER INFO TO AIRTABLE--------------------------------------------------------------
// Middleware to parse JSON request body
app.use(express.json());

app.post('/api/add-record', async (req, res) => {
    const { name, email, coupon } = req.body;

    // Check required fields
    if (!name || !email || !coupon) {
        return res.status(400).json({ error: 'Missing required fields: name, email, and coupon' });
    }

    // Construct the Airtable URL
    const airtableApiUrlAddRecord = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_COUPONS_NAME}`;

    // Log the Airtable URL to check correctness
    console.log('Airtable URL:', airtableApiUrlAddRecord);

    // Ensure that required environment variables are set
    if (!process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_COUPONS_NAME || !airtableApiUrlAddRecord.startsWith('https://')) {
        return res.status(500).json({ error: 'Invalid Airtable configuration or URL' });
    }

    const recordData = {
        fields: {
            Name: name,
            Email: email,
            Coupon: coupon
        }
    };

    try {
        const response = await fetch(airtableApiUrlAddRecord, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ records: [recordData] })
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ message: 'Record added successfully', data });
        } else {
            res.status(500).json({ error: 'Error adding record to Airtable', details: data });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error connecting to Airtable', details: error });
    }
});

//-------------------------------------------------------SENDING USER INFO TO MAILERLITE--------------------------------------------------------------
const axios = require('axios');

const BASE_URL = 'https://api.mailerlite.com/api/v2';

// Replace with the subscriber's name and email
const subscriberName = 'yoshi';
const subscriberEmail = 'yoshi@gmail.com';

async function subscribeUser(name, email) {
    try {
        // Step 2: Subscribe the user to the group using the group ID directly
        const subscriberData = {
            email: email,
            name: name,
            fields: {
            },
            groups: [process.env.MAILERLITE_GROUP_ID] // Directly using the group ID
        };

        const subscribeResponse = await axios.post(`${BASE_URL}/subscribers`, subscriberData, {
            headers: {
                'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log('Subscriber added successfully:', subscribeResponse.data);
    } catch (error) {
        console.error('Error subscribing user:', error.response ? error.response.data : error.message);
    }
}

// Call the function
subscribeUser(subscriberName, subscriberEmail);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*
fetch('http://localhost:3002/api/add-record', {  // Use absolute URL
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'hi Doe',
        email: 'johndoe@gmail.com',
        coupon: 'discountcode123'
    })
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */