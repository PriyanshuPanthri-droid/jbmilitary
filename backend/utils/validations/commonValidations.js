import mongoose from 'mongoose'
export const isPositiveNumber = (value) => {
    return typeof value === 'number' && value > 0;
};

export const isNonNegativeNumber = (value) => {
    return typeof value === 'number' && value >= 0;
};

export const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

export const isValidCategoryName = (name) => {
    return typeof name === 'string' && name.trim().length >= 3 && name.trim().length <= 100;
};

export const isString = (value) => typeof value === 'string';

export const isNonEmptyString = (value) => isString(value) && value.trim().length > 0;
export const isValidLength = (value, min, max) => {
    if (!isString(value)) return false;
    const length = value.trim().length;
    return length >= min && length <= max;
};

export const isValidEmail = (email) => {
    if (!isString(email)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
    if (!isString(phone)) return false;
    const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\-.\s]{7,15}$/;
    return phoneRegex.test(phone);
};

export const isValidDate = (date) => {
    if (!date) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };