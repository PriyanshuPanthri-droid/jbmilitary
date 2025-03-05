import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

export const validateBody = (validator) => {
    return (req, res, next) => {
        const { isValid, errors } = validator(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                errors
            });
        }
        next();
    };
};