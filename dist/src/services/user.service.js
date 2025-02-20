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
exports.createUser = void 0;
const user_model_1 = require("../models/user.model");
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fullName, email, password, role, otp, }) {
    if (!fullName || !email || !password) {
        throw new Error("All fields are required.");
    }
    const user = user_model_1.userModel.create({
        fullName,
        email,
        password,
        role,
        otp,
    });
    return user;
});
exports.createUser = createUser;
