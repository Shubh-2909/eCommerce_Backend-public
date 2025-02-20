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
exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAllCategories = exports.getlatestProducts = exports.newProduct = void 0;
const product_model_1 = require("../models/product.model");
const fs_1 = require("fs");
const cloudinary_1 = require("cloudinary");
const newProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, stock, category } = req.body;
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please add a photo",
            });
        }
        // Validate required fields
        if (!name || !price || !stock || !category) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }
        // Create product with Cloudinary URL
        const product = yield product_model_1.Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: req.file.path, // Cloudinary URL
        });
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        console.error("Product creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating product",
            error: error.message,
        });
    }
});
exports.newProduct = newProduct;
const getlatestProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find({}).sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({
            success: true,
            products,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in retrieval of latest products",
        });
    }
});
exports.getlatestProducts = getlatestProducts;
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield product_model_1.Product.distinct("category");
        return res.status(200).json({
            success: true,
            categories,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Error in retrieval of categories" });
    }
});
exports.getAllCategories = getAllCategories;
const getSingleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.Product.findById(id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Error in retrieval of product" });
    }
});
exports.getSingleProduct = getSingleProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, stock, category } = req.body;
        // Find product and handle invalid ID
        const product = yield product_model_1.Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        // Handle photo update if new file is uploaded
        if (req.file) {
            try {
                // Delete old photo if it exists
                if (product.photo) {
                    // Extract public ID from Cloudinary URL
                    const publicId = product.photo.split("/").slice(-1)[0].split(".")[0];
                    // Add uploads/ folder prefix if it exists in the URL
                    const fullPublicId = product.photo.includes("uploads/")
                        ? `uploads/${publicId}`
                        : publicId;
                    yield cloudinary_1.v2.uploader.destroy(fullPublicId);
                }
                // Update with new photo URL
                product.photo = req.file.path;
            }
            catch (cloudinaryError) {
                console.error("Cloudinary error:", cloudinaryError);
                return res.status(500).json({
                    success: false,
                    message: "Error updating product image",
                });
            }
        }
        // Validate and update other fields
        if (name) {
            if (typeof name !== "string" || name.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be at least 3 characters long",
                });
            }
            product.name = name.trim();
        }
        if (price) {
            const numPrice = Number(price);
            if (isNaN(numPrice) || numPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Price must be a positive number",
                });
            }
            product.price = numPrice;
        }
        if (stock) {
            const numStock = Number(stock);
            if (isNaN(numStock) || numStock < 0 || !Number.isInteger(numStock)) {
                return res.status(400).json({
                    success: false,
                    message: "Stock must be a non-negative integer",
                });
            }
            product.stock = numStock;
        }
        if (category) {
            if (typeof category !== "string" || category.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Category must be at least 2 characters long",
                });
            }
            product.category = category.trim().toLowerCase();
        }
        // Save updates
        yield product.save();
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category,
                photo: product.photo,
            },
        });
    }
    catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating product",
            error: error.message,
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findById(req.params.id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        (0, fs_1.rm)(product.photo, () => {
            console.log("Old photo Deleted");
        });
        yield product.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Error in deletion of product" });
    }
});
exports.deleteProduct = deleteProduct;
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, sort, category, price } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        const skip = limit * (page - 1);
        const baseQuery = {};
        if (search) {
            baseQuery.name = {
                $regex: search,
                $options: "i",
            };
        }
        if (price) {
            baseQuery.price = {
                $lte: Number(price),
            };
        }
        if (category) {
            baseQuery.category = category;
        }
        const [products, filteredOnlyProduct] = yield Promise.all([
            product_model_1.Product.find(baseQuery)
                .sort(sort && { price: sort === "asc" ? 1 : -1 })
                .limit(limit)
                .skip(skip),
            product_model_1.Product.find(baseQuery),
        ]);
        const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
        return res.status(200).json({
            success: true,
            products,
            totalPage,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Error in retrieval of products" });
    }
});
exports.getAllProducts = getAllProducts;
