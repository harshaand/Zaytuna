import axios from 'axios';

export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

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

        const subscribeResponse = await axios.post(
            process.env.MAILERLITE_SUBSCRIBERS_ENDPOINT,
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
            data: subscribeResponse.data,
        });
    } catch (error) {
        console.error(
            'Error subscribing user:',
            error.response ? error.response.data : error.message
        );
        res.status(500).json({
            error: 'Error subscribing user',
            details: error.response ? error.response.data : error.message,
        });
    }
}
