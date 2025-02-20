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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = exports.singleUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: ((_a = process.env.CLOUDINARY_API_SECRET) === null || _a === void 0 ? void 0 : _a.slice(0, 5)) + "...", // Only log first few characters of secret
});
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Multer Storage for Cloudinary
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            folder: "uploads",
            format: file.mimetype.split("/")[1],
            public_id: (0, uuid_1.v4)(),
        });
    }),
});
// Multer Middleware
exports.singleUpload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image")) {
            cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
}).single("photo");
// Wrapped upload middleware to handle errors
const uploadMiddleware = (req, res, next) => {
    (0, exports.singleUpload)(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({
                success: false,
                message: `Multer error: ${err.message}`,
            });
        }
        else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "An error occurred during file upload",
            });
        }
        next();
    });
};
exports.uploadMiddleware = uploadMiddleware;
