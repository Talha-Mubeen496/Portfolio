const nodemailer = require("nodemailer");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  // Create a transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,   // Your Gmail address from Netlify env vars
      pass: process.env.GMAIL_PASS,   // Your Gmail App Password from Netlify env vars
    },
  });

  // Email options
  const mailOptions = {
    from: data.email,
    to: process.env.GMAIL_USER,
    subject: data.subject || "New message from portfolio contact form",
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: "Email sent successfully!" };
  } catch (error) {
    return { statusCode: 500, body: "Failed to send email: " + error.message };
  }
};
