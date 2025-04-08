import nodemailer from 'nodemailer';
import { ENV_VARS } from './../config/envVars.js';


// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV_VARS.EMAIL_USER,
    pass: ENV_VARS.EMAIL_PASS,
  },
});
//when sending the email to the faculty, set the Reply-To header to the student's email address.
// Email sending utility
export const sendEmail = async (to, subject, text, replyTo) => {
 const mailOptions = {
    from: ENV_VARS.EMAIL_USER, // Your email address
    to, // Faculty's email address
    subject,
    text,
    replyTo, // Add the student's email here
  };

  return transporter.sendMail(mailOptions);
};
