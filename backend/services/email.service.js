import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY
  }
});

export const sendVerificationEmail = async (email, link) => {
  try {
    console.log("Attempting to send email to:", email);

    const info = await transporter.sendMail({
      from: `"Automation System" <rahultadvi8143@gmail.com>`, // verified sender
      to: email,
      subject: "Verify Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${link}" 
           style="padding:10px 20px; background:#2563eb; color:white; text-decoration:none; border-radius:5px;">
           Verify Email
        </a>
      `
    });

    console.log("Mail sent successfully:", info.messageId);

  } catch (err) {
    console.error("MAIL ERROR:", err.response?.data || err.message);
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

