const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // For environment variables

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email address from .env
    pass: process.env.EMAIL_PASS, // App password from .env
  },
});

// Store OTPs temporarily in memory
const otps = {};

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ status: 'Invalid or missing email address.' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP temporarily
  otps[email] = otp;

  // Automatically delete OTP after 5 minutes
  setTimeout(() => {
    delete otps[email];
  }, 300000);

  // Email message setup
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}\nThis OTP will expire in 5 minutes.`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP: ', error);
      return res.status(500).json({ status: 'Failed to send OTP', error: error.message });
    }
    console.log('OTP sent: ' + info.response);
    res.status(200).json({ status: 'OTP sent successfully' });
  });
});

// Utility function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
