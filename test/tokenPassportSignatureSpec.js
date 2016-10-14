const should = require('chai').should();
const expect = require('chai').expect;
const TokenPassportSignature = require('../lib/tokenPassportSignature');
const TokenPassport = require('../lib/tokenPassport');

describe('TokenPassportSignature', () => {
  let sig;

  beforeEach(() => {
    sig = new TokenPassportSignature();
  });

  context('properties', () => {
    it('should have an algorithm', () => sig.should.have.property('algorithm'));
    it('should have a value', () => sig.should.have.property('value'));
  });

  context('#createKey', () => {
    it('should ampersand delimit the consumerSecret and tokenSecret', () => {
      const consumerSecret = 'abcdefg';
      const tokenSecret = '0987654321';
      const key = TokenPassportSignature.createKey(consumerSecret, tokenSecret);
      key.should.equal(`${consumerSecret}&${tokenSecret}`);
    });
  });

  context('#createAndSetSignature', () => {
    let key;
    let passport;
    beforeEach(() => {
      key = TokenPassportSignature.createKey('abc', '123');
      passport = new TokenPassport();
      sig.algorithm = 'SHA256';
    });

    it('should throw an error if the hashing algorithm is not supported', () => {
      sig.algorithm = undefined;
      expect(sig.createAndSetSignature).to.throw(Error);

      try {
        const baseString = passport.getBaseString();
        sig.createAndSetSignature(baseString, key, null);
        (true).should.be.false; // always throw
      } catch (err) {
        err.message.should.contain('Hashing algorithm is not supported');
      }
    });

    it('should throw an error if the baseString is not provided', () => {
      expect(sig.createAndSetSignature).to.throw(Error);

      try {
        sig.createAndSetSignature(null, key);
        (true).should.be.false; // always throw
      } catch (err) {
        err.message.should.contain('base string is required');
      }
    });

    it('should throw an error if the key is not provided', () => {
      expect(sig.createAndSetSignature).to.throw(Error);

      try {
        const baseString = passport.getBaseString();
        sig.createAndSetSignature(baseString, null);
        (true).should.be.false; // always throw
      } catch (err) {
        err.message.should.contain('key is required');
      }
    });

    it('should return a base64 encoded string', () => {
      const baseString = passport.getBaseString();
      sig.createAndSetSignature(baseString, key);
      const actual = sig.value[sig.value.length - 1];
      actual.should.equal('=');
    });

    it('should create a signature with SHA256', () => {
      sig.algorithm = 'SHA256';
      const baseString = passport.getBaseString();
      sig.createAndSetSignature(baseString, key)
      expect(sig.value).to.exist;
    });

    it('should create a signature with SHA1', () => {
      const baseString = passport.getBaseString();
      sig.algorithm = 'SHA1';
      sig.createAndSetSignature(baseString, key)
      expect(sig.value).to.exist;
    });

    it('should return a known hash when the inputs are known', () => {
      const consumerSecret = 'd84d638605f12d0239502d2d4ea8f4adad0c1f42d6071a511c8f15bc42040a5f';
      const tokenSecret = '6ebe22213a5f53202dbf0132f5ff94b212c7cc302b2c12c763595efa156454d1';

      const passport = new TokenPassport();
      passport.account = '3575242';
      passport.consumerKey = '18eaaa5860828b345527fc2bb0b905825b4a116011f48aac2c81b09f183d89a0';
      passport.token = '2cf707486c779d2e6610699fdd54d2a18214c881b1362d9152501b56e9f51cf9';
      passport.nonce = 'iYriqVvIoQfMQL5BpINa';
      passport.timestamp = 1476381065;

      const baseString = passport.getBaseString();
      const key = TokenPassportSignature.createKey(consumerSecret, tokenSecret);

      sig.createAndSetSignature(baseString, key);
      sig.value.should.equal('aOI0YuX+T11wGPQjyOCQZ75QfMsvAvaXmNvT5terPM0=');
    });
  });
});
