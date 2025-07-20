const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'https://suumo-ai.vercel.app',
  'http://localhost:3000'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json());

// nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// メール送信API
app.post('/api/send', async (req, res) => {
  const { type, ...data } = req.body;
  let subject = '【SUUMO AI君】新規お問い合わせ';
  let text = '';

  if (type === 'valuation') {
    subject = '【SUUMO AI君】新規査定依頼';
    text = `査定依頼がありました。\n\n` +
      Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
  } else if (type === 'contact') {
    subject = '【SUUMO AI君】お問い合わせ';
    text = `お問い合わせがありました。\n\n` +
      Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'support@century21.group',
      subject,
      text
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'メール送信に失敗しました', details: err && err.toString ? err.toString() : err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 