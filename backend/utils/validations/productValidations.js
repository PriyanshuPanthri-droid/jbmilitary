import { isPositiveNumber, isNonNegativeNumber, isValidObjectId } from './commonValidations.js';

export const validateCreateProduct = (data) => {
  const errors = [];

  // Name validation
  if (!data.name || data.name.trim().length < 3) {
    errors.push({
      field: 'name',
      message: 'Product name must be at least 3 characters long'
    });
  }

  // Description validation
  if (!data.description || data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 10 characters long'
    });
  }

  // Price validation
  if (!isPositiveNumber(data.price)) {
    errors.push({
      field: 'price',
      message: 'Price must be a positive number'
    });
  }

  // Category validation
  if (!data.categoryName || data.categoryName.trim().length < 2) {
    errors.push({
      field: 'categoryName',
      message: 'Category name must be at least 2 characters long'
    });
  }

  // Stock validation
  if (!isNonNegativeNumber(data.stock)) {
    errors.push({
      field: 'stock',
      message: 'Stock must be a non-negative number'
    });
  }

  // Images validation
  if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
    errors.push({
      field: 'images',
      message: 'At least one image is required'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateProduct = (data) => {
  const errors = [];

  // Only validate fields that are present in the update
  if (data.name !== undefined && data.name.trim().length < 3) {
    errors.push({
      field: 'name',
      message: 'Product name must be at least 3 characters long'
    });
  }

  if (data.description !== undefined && data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 10 characters long'
    });
  }

  if (data.price !== undefined && !isPositiveNumber(data.price)) {
    errors.push({
      field: 'price',
      message: 'Price must be a positive number'
    });
  }

  if (data.stock !== undefined && !isNonNegativeNumber(data.stock)) {
    errors.push({
      field: 'stock',
      message: 'Stock must be a non-negative number'
    });
  }

  if (data.categoryName !== undefined && data.categoryName.trim().length < 2) {
    errors.push({
      field: 'categoryName',
      message: 'Category name must be at least 2 characters long'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};