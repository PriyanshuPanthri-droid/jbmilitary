import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  });

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/.+\@.+\..+/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        addresses: [addressSchema],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: false,
        },
        verificationTokenExpiresAt: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenExpiresAt: {
            type: Date,
        },
        lastLogin: {
            type: Date,
            default:Date.now
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export { User };
