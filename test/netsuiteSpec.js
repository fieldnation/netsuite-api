const netsuite = require('../lib/netsuite');
const should = require('chai').should();

describe('Netsuite API', () => {
  it('should export TokenPassport', () => netsuite.should.have.property('TokenPassport'));
  it('should export TokenPassportSignature', () => netsuite.should.have.property('TokenPassportSignature'));
});