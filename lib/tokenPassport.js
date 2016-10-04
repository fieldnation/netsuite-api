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
     * A unique, randomly generated alphanumeric string of 6-64 characters.
     * @type {String}
     */
    this.nonce = generateNonce();

    /**
     * Current timestamp in Unix format
     */
    this.timestamp = Date.now();

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
  get baseString() {
    return `${this.account}&${this.consumerKey}&${this.token}&${this.nonce}&${this.timestamp}`;
  }
}

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
