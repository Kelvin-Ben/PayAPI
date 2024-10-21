import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not allowed'})
  }
  const { recaptchaResponse, name, email, company, title, message } = req.body;

  // check for empty fields
  if (!name || !email || !company || title || message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill out all the required fields.'
    })
  }

  // reCAPTCHA secret key
  const recaptchaSecret = RECAPTCHA_SECRET_KEY_LIVE;

  // verify site
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`;
  try {
    const recaptchaRes = await fetch(verificationURL, { method: 'POST' });
    const recaptchaResult = await recaptchaRes.json();

    if (recaptchaResult.success && recaptchaResult.score >= 0.5) {
      // Successful verification
      return res.status(200).json({ success: true, message: 'Verification successful.' });
  } else {
      // Failed verification
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' });
  }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}