import { isValidEmail, isValidPhone } from './commonValidations.js';

export const validateSellRequest = (data) => {
  const errors = [];

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters long'
    });
  }

  // Email validation
  if (!isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Please provide a valid email address'
    });
  }

  // Phone validation
  if (!isValidPhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Please provide a valid phone number'
    });
  }

  // Product name validation
  if (!data.productName || data.productName.trim().length < 3) {
    errors.push({
      field: 'productName',
      message: 'Product name must be at least 3 characters long'
    });
  }

  // Price validation
  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    errors.push({
      field: 'price',
      message: 'Please provide a valid price'
    });
  }

  // Description validation
  if (!data.description || data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 10 characters long'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};