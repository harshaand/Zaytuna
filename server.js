import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.options('*', (req, res) => {
    res.sendStatus(200);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

//-------------------------------------------------------SENDING USER INFO TO MAILERLITE--------------------------------------------------------------

app.post('/api/subscribe', async (req, res) => {
    const { email, discount_code } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const subscriberData = {
            email: email,
            fields: {
                discount_code: discount_code,
            },
            groups: [process.env.MAILERLITE_GROUP_ID],
        };

        const subscribeResponse = await axios.post(process.env.MAILERLITE_SUBSCRIBERS_ENDPOINT,
            subscriberData,
            {
                headers: {
                    'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({
            message: 'Subscriber added successfully',
            data: subscribeResponse.data
        });

    } catch (error) {
        console.error('Error subscribing user:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'Error subscribing user',
            details: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});