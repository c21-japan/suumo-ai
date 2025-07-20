const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json());

// メール送信API（Mailjet）
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
    const response = await axios.post('https://api.mailjet.com/v3.1/send', {
      Messages: [
        {
          From: {
            Email: process.env.MJ_FROM,
            Name: 'SUUMO AI君'
          },
          To: [
            {
              Email: process.env.MJ_TO,
              Name: 'サポート'
            }
          ],
          Subject: subject,
          TextPart: text
        }
      ]
    }, {
      auth: {
        username: process.env.MJ_APIKEY_PUBLIC,
        password: process.env.MJ_APIKEY_PRIVATE
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'メール送信に失敗しました', details: err && err.response && err.response.data ? err.response.data : err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 