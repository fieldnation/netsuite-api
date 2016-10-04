const should = require('chai').should();
const expect = require('chai').expect;
const TokenPassportSignature = require('../lib/tokenPassportSignature');
const TokenPassport = require('../lib/tokenPassport');

describe('TokenPassportSignature Type', () => {
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

  context('#isAlgorithmSupported', () => {
    it('should support SHA1', () => sig.isAlgorithmSupported('SHA1').should.be.true);
    it('should support SHA256', () => sig.isAlgorithmSupported('SHA256').should.be.true);
    it('should not support MD5', () => sig.isAlgorithmSupported('MD5').should.be.false);
    it('should read the algorithm property from the TokenPassportSignature object', () => {
      sig.algorithm = 'hmac-sha1';
      sig.isAlgorithmSupported().should.be.true;
    });
  });

  context('#createSignature', () => {
    let key;
    let passport;
    beforeEach(() => {
      key = TokenPassportSignature.createKey('abc');
      passport = new TokenPassport();
      sig.algorithm = 'SHA256';
    });

    it('should throw an error if the hashing algorithm is not supported', () => {
      sig.algorithm = undefined;
      expect(sig.createSignature).to.throw(Error);

      try {
        sig.createSignature(passport.baseString, key);
        (true).should.be.false; // always throw
      } catch (err) {
        err.message.should.contain('Hashing algorithm is not supported');
      }
    });

    it('should throw an error if the baseString is not provided', () => {
      expect(sig.createSignature).to.throw(Error);

      try {
        sig.createSignature(null, key);
        (true).should.be.false; // always throw
      } catch (err) {
        err.message.should.contain('base string is required');
      }
    });

    it('should throw an error if the key is not provided', () => {
      expect(sig.createSignature).to.throw(Error);

      try {
        sig.createSignature(passport.baseString, null);
        (true).should.be.false; // always throw
      } catch (err) {
        err.message.should.contain('key is required');
      }
    });

    it('should return a base64 encoded string', () => {
      const signature = sig.createSignature(passport.baseString, key);
      const actual = signature[signature.length - 1];
      actual.should.equal('=');
    });
  });
});
