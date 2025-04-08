import nodemailer from 'nodemailer';
import { ENV_VARS } from './../config/envVars.js';

// Configure the transporter using Gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV_VARS.EMAIL_USER,
    pass: ENV_VARS.EMAIL_PASS,
  },
});

/**
 * Send an email using Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 * @param {string} [replyTo] - Optional Reply-To address (e.g., student's email)
 * @returns {Promise} - Resolves when email is sent
 */
export const sendEmail = async (to, subject, text, replyTo = null) => {
  const mailOptions = {
    from: `"PUCIT CMS" <${ENV_VARS.EMAIL_USER}>`,
    to,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  };

  //console.log("Email options:", mailOptions); // Log email options

  try {
    const info = await transporter.sendMail(mailOptions);
    //console.log(`Email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
    throw error;
  }
};
