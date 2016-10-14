const should = require('chai').should();
const expect = require('chai').expect;
const libxml = require('libxmljs');
const TokenPassport = require('../lib/tokenPassport');


describe('TokenPassport', () => {
  let passport;

  beforeEach(() => {
    passport = new TokenPassport();
  });

  context('properties', () => {
    it('should have an account', () => passport.should.have.property('account'));
    it('should have a consumerKey', () => passport.should.have.property('consumerKey'));
    it('should have a token', () => passport.should.have.property('token'));
    it('should have a signature', () => passport.should.have.property('signature'));
    it('should have a timestamp', () => passport.should.have.property('timestamp').and.should.be.a.Number);
    it('should have a nonce', () => passport.should.have.property('nonce').and.should.be.a.String);
  });

  context('#nonce', () => {
    it('should be between 6 and 64 characters', () => passport.nonce.length.should.be.least(6).and.most(64));
    it('should not contain the word "undefined"', () => passport.nonce.should.not.contain('undefined'));
  });

  context('#getBaseString', () => {
    it('should ampersand delimit the NetSuite Account ID, Consumer Key, Token, Nonce, and Timestamp', () => {
      // random values created from md5 hashes
      passport.account = '1234567';
      passport.consumerKey = 'eb72c61b011a80c870ba44cfc5fb5c13';
      passport.token = '4925397c4fde92c3ccefd398948e0758';
      const expected = `${passport.account}&${passport.consumerKey}&${passport.token}&${passport.nonce}&${passport.timestamp}`;
      passport.getBaseString().should.equal(expected);
    });
  });

  context('#generateHeaders', () => {
    it('should be valid XML', () => {
      try {
        passport.account = '123';
        passport.consumerKey = '0987a';
        passport.token = 'foobar';
        passport.signature = { algorithm: 'sha1', value: 'abcd=' };

        const headers = passport.generateHeaders('mustbe6chars', Date.now());
        
        libxml.parseXml(headers);
      } catch (err) {
        expect(err).to.be.null;
      }
    });
  })
});
