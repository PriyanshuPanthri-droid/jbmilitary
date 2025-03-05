import { isNonEmptyString, isValidDate } from './commonValidations.js';

export const validateAuction = (data) => {
  const errors = [];

  if (!isNonEmptyString(data.title)) {
    errors.push({
      field: 'title',
      message: 'Title is required'
    });
  }

  if (!isValidDate(data.date)) {
    errors.push({
      field: 'date',
      message: 'Valid date is required'
    });
  }

  if (!isNonEmptyString(data.time)) {
    errors.push({
      field: 'time',
      message: 'Time is required'
    });
  }

  if (!isNonEmptyString(data.venue)) {
    errors.push({
      field: 'venue',
      message: 'Venue is required'
    });
  }

  if (!isNonEmptyString(data.description)) {
    errors.push({
      field: 'description',
      message: 'Description is required'
    });
  }

//   if (!isNonEmptyString(data.catalogueUrl)) {
//     errors.push({
//       field: 'catalogueUrl',
//       message: 'Catalogue URL is required'
//     });
//   }

  return {
    isValid: errors.length === 0,
    errors
  };
};