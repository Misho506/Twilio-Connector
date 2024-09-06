const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();
let cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/send-sms', (req, res) => {
  const { to, body } = req.body;

  client.messages.create({
    body: body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to
  })
    .then(message => res.json({ success: true, messageSid: message.sid }))
    .catch(error => {
      console.error("Error sending SMS:", error);  // Log the full error
      res.status(500).json({ success: false, error: error.message });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
