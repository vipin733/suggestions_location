/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

/**
 * @method isNumber
 * @param {String} value
 * @returns {Boolean} true & false
 * @description this value is number Check
 */
export const isNumber = (value: string): boolean => {
  if (value === null) {
    return false;
  }
  if (isNaN(Number(value))) {
    return false;
  }
  return true;
};

export const SortingEnum = {
  Distance: 'distance',
  Name: 'name',
};
