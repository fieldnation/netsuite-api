const netsuite = require('../lib/netsuite');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Netsuite API', () => {
  it('should export TokenPassport', () => netsuite.should.have.property('TokenPassport'));
  it('should export TokenPassportSignature', () => netsuite.should.have.property('TokenPassportSignature'));
  it('should export getWSDL', () => netsuite.should.have.property('getWSDL'));
  it('should export getSoapClient', () => netsuite.should.have.property('getSoapClient'));

  context('#getWSDL', () => {
    let host, version;
    beforeEach(() => {
      host = 'https://webservices.netsuite.com';
      version = '2016_1';
    });

    it('should return a wsdl when given a host and a version', () => {
      const wsdl = netsuite.getWSDL(host, version);
      
      expect(wsdl).to.contain(host).and.to.contain(version);
    });

    it('should sanitize the hostname to remove trailing "/"', () => {
      host += '/';
      const wsdl = netsuite.getWSDL(host, version);

      /*
       * Match all instances of '//' within the uri.
       * The only match that should be found is from http://
       */
      const matches = wsdl.match(/\/\//g);
      matches.length.should.equal(1);
    });

    it('should throw an error if a hostname is not provided', () => {
      try {
        netsuite.getWSDL(null, version);
        (true).should.be.false;
      } catch (err) {
        err.message.should.contain('hostname is required');
      }
    });

    it('should throw an error if a version is not provided', () => {
      try {
        netsuite.getWSDL(host, null);
        (true).should.be.false;
      } catch (err) {
        err.message.should.contain('version is required');
      }
    });
  });

  context('#getSoapClient', () => {
    let wsdl = `${__dirname}/fixtures/dummy.wsdl`;

    it('should return a promise', () => {
      expect(netsuite.getSoapClient(wsdl)).to.be.a('promise');
    });

    it('should return a client', () => {
      return netsuite.getSoapClient(wsdl)
        .then(client => expect(client).to.be.defined)
        .catch(err => expect(err).to.be.undefined);
    });

    it('should return an error if the wsdl cannot be resolved', () => {
      return netsuite.getSoapClient('super_awesome_wsdl')
        .then(client => expect(client).to.be.undefined)
        .catch(err => expect(err).to.be.defined);
    });
  });
});