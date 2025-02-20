"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./src/utils/db");
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const product_routes_1 = __importDefault(require("./src/routes/product.routes"));
const cart_routes_1 = __importDefault(require("./src/routes/cart.routes"));
const order_routes_1 = __importDefault(require("./src/routes/order.routes"));
dotenv_1.default.config();
const application = (0, express_1.default)();
(0, db_1.connectToDb)();
application.use((0, cors_1.default)());
application.use(express_1.default.json());
application.use(express_1.default.urlencoded({ extended: true }));
application.get("/", (req, res) => {
    res.send("Hello World");
});
application.use("/users", user_routes_1.default);
application.use("/product", product_routes_1.default);
application.use("/cart", cart_routes_1.default);
application.use("/order", order_routes_1.default);
application.listen(process.env.PORT, () => {
    console.log("Server is running on:", process.env.PORT);
});
