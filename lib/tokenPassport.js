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
    return Date.now();
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

    const headers = [
      '<ns:tokenPassport soap:actor="http://schemas.xmlsoap.org/soap/actor/next" soap:mustUnderstand="0" xmlns:ns="urn:messages_2016_1.platform.webservices.netsuite.com">',
        `<ns:account>${this.account}</ns:account>`,
        `<ns:consumerKey>${this.consumerKey}</ns:consumerKey>`,
        `<ns:token>${this.token}</ns:token>`,
        `<ns:nonce>${nonce}</ns:nonce>`,
        `<ns:timestamp>${timestamp}</ns:timestamp>`,
        `<ns:signature algorithm="HMAC_${this.signature.algorithm}">${this.signature.value}</ns:signature>`,
      '</ns:tokenPassport>'
    ];

    return headers.join('');
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
