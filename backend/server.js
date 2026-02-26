require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// In production, configure CORS to only allow requests from your frontend domain
app.use(cors());

// Nodemailer Transporter Setup for Brevo
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // smtp-relay.brevo.com
    port: process.env.SMTP_PORT,   // 587
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

// Contact Route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    try {
        // Send email
        const info = await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_LOGIN}>`, // Best practice: send from an authenticated domain/email
            replyTo: email,
            to: process.env.RECEIVER_EMAIL, // Send to yourself
            subject: `New Portfolio Contact from ${name}`,
            text: `You have a new message from ${name} (${email}):\n\n${message}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
