

/**
 * Get a number within a range
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
exports.getRandomNumberBetween = getRandomNumberBetween;
function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get a number
 * @return {Number}
 */
exports.getRandomNumber = getRandomNumber;
function getRandomNumber() {
  return Math.floor(Math.random() * 999999999);
}
