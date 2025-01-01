const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yadamma077@gmail.com', // Replace with your Gmail address
    pass: 'rqyj jibq nhmz fytw', // Replace with your Gmail App password
  },
});

// Store OTPs temporarily in memory
const otps = {};

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'Email is required.' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP temporarily
  otps[email] = otp;

  // Email message setup
  const mailOptions = {
    from: 'yadamma077@gmail.com',
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP: ', error);
      return res.status(500).json({ status: 'Failed to send OTP' });
    }
    console.log('OTP sent: ' + info.response);
    res.status(200).json({ status: 'OTP sent successfully' });
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
