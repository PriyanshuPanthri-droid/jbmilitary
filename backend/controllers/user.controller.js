import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateToken } from "../utils/generateToken.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../services/email.service.js";
import { validateLogin, ValidateSignup } from "../utils/validations/userValidations.js";


export const signup = async (req, res) => {
    try {
        const validation = ValidateSignup(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        const { fullName, email, password } = req.body;
        if ( !fullName || !email || !password ) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required"
            });
        }

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();
        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() +24*60*60*1000
        })
        generateToken(res, user);
        await sendVerificationEmail(email, verificationToken);
        // const userWithoutPassword = await user.findOne({email}).select("-password");
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userWithoutPassword
        })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const login = async (req, res) => {
    try {
        const validation = validateLogin(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
                });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
            });
        }
        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();
        //send user without password
        // const userWithoutPassword = await user.findOne({email}).select("-password");
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullName}`,
            user: userWithoutPassword
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { verificationCode } = req.body;
       
        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined
        await user.save();

        // send welcome email
        await sendWelcomeEmail(user.email, user.fullName);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const logout = async (req, res) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        // send success reset email
        await sendResetSuccessEmail(user.email);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const checkAuth = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        };
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getUserDetails = async (req, res) => {
    try {
      const userId = req.id;
      const user = await User.findById(userId).select("-password");
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };



export const updateProfile = async (req, res) => {
    try {
        const userId = req.id; 
        const { fullName, email } = req.body;

        // Validate input
        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: "Fullname and email are required",
            });
        }

        // Prepare updated data
        const updatedData = { fullName, email };

        // Update the user in the database
        const user = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        }).select("-password"); 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        return res.status(200).json({
            success: true,
            user:user,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};