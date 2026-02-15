import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  family: 4,
  connectionTimeout: 10000,
  socketTimeout: 10000
});

export const sendVerificationEmail = async (email, link) => {
  try {
console.log("Attempting to send email to:", email);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Email",
      html: `<a href="${link}">Verify Email</a>`
    });

    console.log("Mail sent successfully");

  } catch (err) {
    console.log("MAIL ERROR:", err);
  }
};

