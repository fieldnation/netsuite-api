const numberUtil = require('./utils/numberUtil');

class TokenPassport {
  constructor() {

    /**
     * NetSuite account ID.
     * Find this number in Setup > Integration > Web Services Preferences
     * @type {String}
     */
    this.account = '';

    /**
     * The consumer key for the integration record
     * @type {String}
     */
    this.consumerKey = '';

    /**
     * Generated token from a combination of a user and an integration record
     * @type {String}
     */
    this.token = '';

    /**
     * A hashed value.
     * Created by using all of the other values in the TokenPassport,
     * plus the appropriate token secret and consumer secret.
     * Along with the signature, you must identify the algorithm used to
     * create the signature.
     * @type {String}
     */
    this.signature = '';
    
  }

  /**
   * Get the base string - An ampersand delimited value string 
   * made from the account, consumerKey, token, nonce, and timestamp.
   * @return {String}
   */
  getBaseString(nonce, timestamp) {
    return encodeURI(`${this.account}&${this.consumerKey}&${this.token}&${nonce}&${timestamp}`);
  }

  /**
   * Current timestamp in Unix format
   * @description Always return a new time stamp to use when making a request
   * @return {Number}
   */
  static getTimestamp() {
    return Math.floor(new Date() / 1000);
  }

  /**
   * A unique, randomly generated alphanumeric string of 6-64 characters.
   * @type {String}
   */
  static getNonce() {
    return generateNonce();
  }

  /**
   * Generate the headers required to use TBA
   * @param  {String} nonce
   * @param  {Number} timestamp
   * @return {String}
   */
  generateHeaders(nonce, timestamp) {
    return [
      `<ns:tokenPassport xsi:type="core:TokenPassport">`,
        `<core:account>${this.account}</core:account>`,
        `<core:consumerKey>${this.consumerKey}</core:consumerKey>`,
        `<core:token>${this.token}</core:token>`,
        `<core:nonce>${nonce}</core:nonce>`,
        `<core:timestamp>${timestamp}</core:timestamp>`,
        `<core:signature algorithm="HMAC_${this.signature.algorithm}">${this.signature.value}</core:signature>`,
      `</ns:tokenPassport>`
    ].join('');
  }
}

/**
 * Generate an alphanumeric string between 6 and 64 chars long
 * @private
 * @return {String}
 */
function generateNonce() {
  const floor = 6;
  const ceiling = 64;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lengthOfNonce = numberUtil.getRandomNumberBetween(floor, ceiling);

  let nonceString = '';

  for (var i = 0; i < lengthOfNonce; i++) {
    const rand = numberUtil.getRandomNumberBetween(0, characters.length - 1);
    nonceString += characters[rand];
  }

  return nonceString;
}

module.exports = TokenPassport;
