"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const order_controller_1 = require("../controllers/order.controller");
router.put("/:orderId/:userId", order_controller_1.deleteOrder);
router.post("/:cartId", order_controller_1.placeOrder);
exports.default = router;
