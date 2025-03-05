import { isValidEmail, isValidLength, isNonEmptyString } from "./commonValidations.js";

export const ValidateSignup = (data) => {
    const errors = [];

     // Full Name validation
    if (!isNonEmptyString(data.fullName) || !isValidLength(data.fullName, 2, 50)) {
        errors.push({
            field: 'fullName',
            message: 'Full name must be between 2 and 50 characters'
        });
    }

    // Email validation
    if (!isValidEmail(data.email)) {
        errors.push({
            field: 'email',
            message: 'Please provide a valid email address'
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export const validateLogin = (data) => {

    if (!isValidEmail(data.email)) {
        errors.push({
          field: 'email',
          message: 'Please provide a valid email address'
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
