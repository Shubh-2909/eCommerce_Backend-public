import express from "express";
import { adminOnly } from "../middlewares/admin";
import {
  deleteProduct,
  getAllCategories,
  getAllProducts,
  getSingleProduct,
  getlatestProducts,
  newProduct,
  updateProduct,
} from "../controllers/product.controller";
import { singleUpload, uploadMiddleware } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", adminOnly, uploadMiddleware, newProduct);
router.get("/latest", getlatestProducts);
router.get("/categories", getAllCategories);
router.get("/all", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", adminOnly, uploadMiddleware, updateProduct);
router.delete("/:id", adminOnly, deleteProduct);
export default router;
