import { isValidEmail, isNonEmptyString, isValidLength } from './commonValidations.js';

export const validateNewsletterSubscription = (data) => {
    const errors = [];

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
};

export const validateNewsletterContent = (data) => {
    const errors = [];

    if (!isNonEmptyString(data.subject) || !isValidLength(data.subject, 3, 200)) {
        errors.push({
            field: 'subject',
            message: 'Newsletter subject must be between 3 and 200 characters'
        });
    }

    if (!isNonEmptyString(data.content) || !isValidLength(data.content, 10, 50000)) {
        errors.push({
            field: 'content',
            message: 'Newsletter content must be between 10 and 50000 characters'
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};