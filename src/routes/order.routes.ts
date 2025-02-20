import express from "express";
const router = express.Router();
import { placeOrder, deleteOrder } from "../controllers/order.controller";

router.put("/:orderId/:userId", deleteOrder);

router.post("/:cartId", placeOrder);

export default router;
