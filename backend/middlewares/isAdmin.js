import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.id; 
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default isAdmin;