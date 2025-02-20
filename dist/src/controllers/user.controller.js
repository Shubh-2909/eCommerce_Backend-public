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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.updateUser = exports.loginUser = exports.resendOTP = exports.verifyOTP = exports.registerUser = void 0;
const { userModel } = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const cart_models_1 = require("../models/cart.models");
const email_service_1 = require("../services/email.service");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { fullName, email, password, role } = req.body;
        console.log(fullName);
        // Check if user already exists
        const existingUser = yield userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = yield userModel.hashPassword(password);
        const otp = userModel.generateOTP();
        // Create user with OTP
        const user = yield userService.createUser({
            fullName,
            email,
            password: hashedPassword,
            role,
            otp: {
                code: otp,
                expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
            },
        });
        console.log({
            code: otp,
            expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
        });
        console.log(user);
        const newCart = new cart_models_1.Cart({ user: user._id, items: [] });
        yield newCart.save();
        // Send OTP email
        yield (0, email_service_1.sendOTPEmail)(email, otp);
        res.status(201).json({
            message: "Registration successful. Please verify your email with the OTP sent.",
            userId: user._id,
        });
    }
    catch (error) {
        // next(error);
        console.log(error);
    }
});
exports.registerUser = registerUser;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, otp } = req.body;
        const user = yield userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }
        if (!user.otp || !user.otp.code || !user.otp.expiry) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }
        if (new Date() > user.otp.expiry) {
            return res.status(400).json({ message: "OTP expired" });
        }
        if (user.otp.code !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Verify user and remove OTP
        user.isVerified = true;
        user.otp = undefined;
        yield user.save();
        const token = user.generateAuthToken();
        res.status(200).json({
            message: "Email verified successfully",
            token,
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOTP = verifyOTP;
// Add new controller method for resending OTP
const resendOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }
        const otp = userModel.generateOTP();
        user.otp = {
            code: otp,
            expiry: new Date(Date.now() + 10 * 60 * 1000),
        };
        yield user.save();
        yield (0, email_service_1.sendOTPEmail)(user.email, otp);
        res.status(200).json({
            message: "OTP resent successfully",
            userId: user._id,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resendOTP = resendOTP;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = yield userModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.isVerified === false) {
        return res
            .status(401)
            .json({ message: "Login Access Denied: User not verified" });
    }
    const isMatch = yield user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = user.generateAuthToken();
    return res.status(200).json({ token, user });
});
exports.loginUser = loginUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userId } = req.params;
        const { fullName, email } = req.body;
        const user = yield userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (email && email !== user.email) {
            const existingUser = yield userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }
        if (fullName) {
            user.fullName = fullName;
        }
        yield user.save();
        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log(userId);
        const user = yield userModel.findById(userId).select("-password -otp");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User retrieved successfully",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
