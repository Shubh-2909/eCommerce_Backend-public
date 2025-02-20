"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "shubhshubhanjal00@gmail.com",
        pass: "nkkz pjzw gnua rxnl",
    },
});
console.log("Email User:", process.env.EMAIL_USER);
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield transporter.sendMail(mailOptions);
});
exports.sendOTPEmail = sendOTPEmail;
