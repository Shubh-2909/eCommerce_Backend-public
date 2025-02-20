"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
router.post("/register", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email"),
    (0, express_validator_1.body)("fullName")
        .isLength({ min: 3 })
        .withMessage("First name should be minimum of 3 characters long."),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be of atleast 6 characters."),
], user_controller_1.registerUser);
router.post("/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be of atleast 6 characters."),
], user_controller_1.loginUser);
router.post("/verify-otp", user_controller_1.verifyOTP);
router.post("/resend-otp", user_controller_1.resendOTP);
router.put("/:userId", user_controller_1.updateUser);
router.get("/:userId", user_controller_1.getUser);
exports.default = router;
