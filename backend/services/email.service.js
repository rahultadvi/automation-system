

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, link) => {
  try {
    console.log("Sending email to:", email);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below link to verify:</p>
        <a href="${link}">${link}</a>
      `
    });

    console.log("Email sent successfully ✅");

  } catch (error) {
    console.log("Resend error:", error);
    throw error;
  }
};




// import nodemailer from "nodemailer";



// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },

//   family: 4,
//   connectionTimeout: 10000,
//   socketTimeout: 10000
// });

// export const sendVerificationEmail = async (email, link) => {
//   try {
// console.log("Attempting to send email to:", email);
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Verify Email",
//       html: `<a href="${link}">Verify Email</a>`
//     });

//     console.log("Mail sent successfully");

//   } catch (err) {
//     console.log("MAIL ERROR:", err);
//   }
// };

