const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/verifyRecaptcha', async (req, res) => {
  const token = req.body.recaptchaResponse;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await axios.post(recaptchaUrl);
    const data = response.data;
    
    if (data.success && data.score >= 0.5) {
      res.json({ success: true, message: 'Your Message was sent successfull.'})
    }else {
      res.json({success: false, message: 'Error occurred during verification.'})
    }
  } catch (error) {
    res.json({ success: false, message: 'Error occurred during verification.'})
  }
})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})