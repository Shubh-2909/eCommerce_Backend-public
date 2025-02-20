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
exports.adminOnly = void 0;
const { userModel } = require("../models/user.model");
const adminOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(401).json({ message: "Do Login first" });
        }
        const userData = yield userModel.findById(id);
        if (!userData) {
            return res
                .status(404)
                .json({ message: "Id is not matching with our databases" });
        }
        if (userData.role !== "admin") {
            return res.status(403).json({ message: "You are not an Admin" });
        }
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Problem in verifying that you are admin or not" });
    }
});
exports.adminOnly = adminOnly;
