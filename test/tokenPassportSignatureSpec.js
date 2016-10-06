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

  context('#createSignature', () => {
    let key;
    let passport;
    beforeEach(() => {
      key = TokenPassportSignature.createKey('abc', '123');
      passport = new TokenPassport();
      sig.algorithm = 'SHA256';
    });

    it('should throw an error if the hashing algorithm is not supported', () => {
      sig.algorithm = undefined;
      expect(sig.createSignature).to.throw(Error);

      try {
        const nonce = TokenPassport.getNonce();
        const timestamp = TokenPassport.getTimestamp();
        const baseString = passport.getBaseString(nonce, timestamp);
        sig.createSignature(baseString, key, null);
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
        const nonce = TokenPassport.getNonce();
        const timestamp = TokenPassport.getTimestamp();
        const baseString = passport.getBaseString(nonce, timestamp);
        sig.createSignature(baseString, null);
        (true).should.be.false; // always throw
      } catch (err) {
        err.message.should.contain('key is required');
      }
    });

    it('should return a base64 encoded string', () => {
      const nonce = TokenPassport.getNonce();
      const timestamp = TokenPassport.getTimestamp();
      const baseString = passport.getBaseString(nonce, timestamp);
      const signature = sig.createSignature(baseString, key);
      const actual = signature[signature.length - 1];
      actual.should.equal('=');
    });

    it('should create a signature with SHA256', () => {
      sig.algorithm = 'SHA256';
      const nonce = TokenPassport.getNonce();
      const timestamp = TokenPassport.getTimestamp();
      const baseString = passport.getBaseString(nonce, timestamp);
      expect(sig.createSignature(baseString, key)).to.exist;
    });

    it('should create a signature with SHA1', () => {
      const nonce = TokenPassport.getNonce();
      const timestamp = TokenPassport.getTimestamp();
      const baseString = passport.getBaseString(nonce, timestamp);
      sig.algorithm = 'SHA1';
      expect(sig.createSignature(baseString, key)).to.exist;
    });

    it('should return a known hash when the inputs are known', () => {
      const nonce ='6obMKq0tmY8ylVOdEkA1';
      const timestamp = 1439829974;

      const consumerSecret = '7278da58caf07f5c336301a601203d10a58e948efa280f0618e25fcee1ef2abd';
      const tokenSecret = '060cd9ab3ffbbe1e3d3918e90165ffd37ab12acc76b4691046e2d29c7d7674c2';

      const passport = new TokenPassport();
      passport.account = '1234567';
      passport.consumerKey = '71cc02b731f05895561ef0862d71553a3ac99498a947c3b7beaf4a1e4a29f7c4';
      passport.token = '89e08d9767c5ac85b374415725567d05b54ecf0960ad2470894a52f741020d82';

      const baseString = passport.getBaseString(nonce, timestamp);
      const key = TokenPassportSignature.createKey(consumerSecret, tokenSecret);

      const signature = sig.createSignature(baseString, key)
      signature.should.equal('FCghIZqXNetuZY8ILWOFH0ucdfzQOmAuL+q+kF21zPs=');
    });
  });
});
