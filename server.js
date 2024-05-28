import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Configura CORS para permitir cualquier origen
app.use(cors());

app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { to, from, html, subject, text } = req.body;

    console.log({ to, from, html, subject, text });

    if (!to || !from || !html || !subject || !text) {
        return res.status(400).json({
            error: 'Did not provide the right data',
            missingFields: {
                to: !to,
                from: !from,
                html: !html,
                subject: !subject,
                text: !text
            }
        });
    }

    try {
        const emailResponse = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            html: `${html} user email: ${from}`,
            text
        });

        return res.status(200).json({
            message: 'Email sent successfully',
            emailResponse
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
