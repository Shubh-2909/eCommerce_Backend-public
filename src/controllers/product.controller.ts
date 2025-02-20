import { Product } from "../models/product.model";
import { rm } from "fs";
import { v2 as cloudinary } from "cloudinary";

export const newProduct = async (req, res) => {
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
    const product = await Product.create({
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
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

export const getlatestProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in retrieval of latest products",
    });
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in retrieval of categories" });
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in retrieval of product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;

    // Find product and handle invalid ID
    const product = await Product.findById(id);
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

          await cloudinary.uploader.destroy(fullPublicId);
        }

        // Update with new photo URL
        product.photo = req.file.path;
      } catch (cloudinaryError) {
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
    await product.save();

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
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    rm(product.photo, () => {
      console.log("Old photo Deleted");
    });

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in deletion of product" });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    interface BaseQuery {
      name?: { $regex: string; $options: string };
      price?: { $lte: number };
      category?: string;
    }

    const baseQuery: BaseQuery = {};

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

    const [products, filteredOnlyProduct] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in retrieval of products" });
  }
};
