import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email, link) => {
  try {

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

// export const sendVerificationEmail = async (email, link) => {
//   await transporter.sendMail({
  //     from: process.env.EMAIL_USER,
  //     to: email,
  //     subject: "Verify Email",
//     html: `
//       <h2>Verify your email</h2>
//       <a href="${link}">Click here</a>
//     `
//   });
// };
// export const sendVerificationEmail = async (email, link) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify Email",

//     text: `Verify your email using this link: ${link}`,

//     html: `
//       <div style="font-family:Arial;padding:20px">
//         <h2>Email Verification</h2>
//         <p>Please click the button below:</p>

//         <a href="${link}" 
//            style="
//               display:inline-block;
//               padding:10px 20px;
//               background:#2563eb;
//               color:white;
//               text-decoration:none;
//               border-radius:5px;">
//            Verify Email
//         </a>

//         <p>If button doesn't work, copy this link:</p>
//         <p>${link}</p>
//       </div>
//     `
//   });
// };
