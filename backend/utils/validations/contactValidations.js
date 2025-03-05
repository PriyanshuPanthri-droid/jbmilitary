import { isNonEmptyString, isValidEmail, isValidLength } from './commonValidations.js';

export const isValidContactName = (name) => {
    if (!isNonEmptyString(name)) return false;
    return isValidLength(name, 2, 100);
};

export const isValidContactSubject = (subject) => {
    if (!isNonEmptyString(subject)) return false;
    return isValidLength(subject, 3, 200);
};

export const isValidContactMessage = (message) => {
    if (!isNonEmptyString(message)) return false;
    return isValidLength(message, 5, 5000);
};

export const validateContactInput = (data) => {
    const errors = [];

    if (!isValidContactName(data.name)) {
        errors.push({
            field: 'name',
            message: 'Name must be between 2 and 100 characters'
        });
    }

    if (!isValidEmail(data.email)) {
        errors.push({
            field: 'email',
            message: 'Please provide a valid email address'
        });
    }

    if (!isValidContactSubject(data.subject)) {
        errors.push({
            field: 'subject',
            message: 'Subject must be between 3 and 200 characters'
        });
    }

    if (!isValidContactMessage(data.message)) {
        errors.push({
            field: 'message',
            message: 'Message must be between 10 and 5000 characters'
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};