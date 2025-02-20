import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDb } from "./src/utils/db";
import userRoutes from "./src/routes/user.routes";
import productRoutes from "./src/routes/product.routes";
import cartRoutes from "./src/routes/cart.routes";
import orderRoutes from "./src/routes/order.routes";

dotenv.config();

const application = express();
connectToDb();

application.use(cors());
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

application.use("/users", userRoutes);
application.use("/products", productRoutes);
application.use("/cart", cartRoutes);
application.use("/orders", orderRoutes);

application.listen(process.env.PORT, () => {
  console.log("Server is running on:", process.env.PORT);
});
