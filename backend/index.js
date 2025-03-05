import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import reviewRoutes from "./routes/review.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import paypalRoutes from "./routes/paypal.route.js"; 
import wishlistRoutes from "./routes/wishlist.route.js"; 
import contactRoutes from "./routes/contact.route.js";
import newsletterRoutes from "./routes/newsletter.route.js"; 
import sellRequestRoutes from "./routes/sellRequest.route.js"; 

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000;


//middleware
app.use(bodyParser.json({limit:'10mb'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin : 'http://localhost:5173',
    credentials : true
}
app.use(cors(corsOptions));

// api's--->
app.use("/api/v1/user", userRoute);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/paypal", paypalRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/contactus",contactRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);
app.use("/api/v1/sellRequest", sellRequestRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})