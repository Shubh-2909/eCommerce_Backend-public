"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../middlewares/admin");
const product_controller_1 = require("../controllers/product.controller");
const multer_js_1 = require("../middlewares/multer.js");
const router = express_1.default.Router();
router.post("/new", admin_1.adminOnly, multer_js_1.uploadMiddleware, product_controller_1.newProduct);
router.get("/latest", product_controller_1.getlatestProducts);
router.get("/categories", product_controller_1.getAllCategories);
router.get("/all", product_controller_1.getAllProducts);
router.get("/:id", product_controller_1.getSingleProduct);
router.put("/:id", admin_1.adminOnly, multer_js_1.uploadMiddleware, product_controller_1.updateProduct);
router.delete("/:id", admin_1.adminOnly, product_controller_1.deleteProduct);
exports.default = router;
