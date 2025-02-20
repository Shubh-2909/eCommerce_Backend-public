import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shubhshubhanjal00@gmail.com",
    pass: "nkkz pjzw gnua rxnl",
  },
});

console.log("Email User:", process.env.EMAIL_USER);

export const sendOTPEmail = async (email: any, otp: any) => {
  const mailOptions = {
    from: "shubhshubhanjal00@gmail.com",
    to: email,
    subject: "Account Verification OTP",
    html: `
      <h1>Email Verification</h1>
      <p>Your OTP for account verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
