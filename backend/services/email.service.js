import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendVerificationEmail = async (email, link) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        name: "Automation System",
        email: "rahultadvi8143@gmail.com", // verified sender
      },
      to: [{ email }],
      subject: "Verify Email",
      htmlContent: `
        <h2>Email Verification</h2>
        <p>Click below to verify:</p>
        <a href="${link}">Verify Email</a>
      `,
    });

    console.log("Email sent successfully");

  } catch (err) {
    console.error(
      "BREVO ERROR:",
      err.response?.body || err.message
    );
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

