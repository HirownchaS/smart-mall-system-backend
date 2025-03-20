const User = require("../models/User");
const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  const id = req.params.id;
  const { subject, html } = req.body;
  let user; // Declare user with let

  try {
    user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    return res.status(400).send({ error: "Error fetching user: " + err.message });
  }

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mall360shoppy@gmail.com",
      pass: "bhdn dfjx yrmt wukf",
    },
    tls: {
      rejectUnauthorized: false, // Ignore self-signed certificate error
    },
  });

  // Set email options
  const mailOptions = {
    from: "mall360shoppy@gmail.com",
    to: user.email, // Send email to the user's email address
    subject: subject,
    html: html,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = {
  sendEmail,
};
