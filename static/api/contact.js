const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO, // Your email where you want to receive messages
      subject: `رسالة جديدة من ${name}`,
      text: `
        الاسم: ${name}
        البريد الإلكتروني: ${email}
        الرسالة:
        ${message}
      `,
      html: `
        <h3>رسالة جديدة من نموذج الاتصال</h3>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>
        <p><strong>الرسالة:</strong></p>
        <p>${message}</p>
      `
    });

    return res.status(200).json({ message: 'تم إرسال الرسالة بنجاح' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إرسال الرسالة' });
  }
}
