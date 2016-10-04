const should = require('chai').should();
const numberUtil = require('../../lib/utils/numberUtil');

describe('numberUtil', () => {

  context('#getRandomNumber', () => {
    it('should not return NaN', () => {
      numberUtil.getRandomNumber().should.not.be.NaN;
    });

    it('should return a Number', () => {
      numberUtil.getRandomNumber().should.be.a.Number;
    });
  });

  context('#getRandomNumberBetween', () => {
    it('should not return NaN', () => {
      numberUtil.getRandomNumberBetween(0, 10).should.not.be.NaN;
    });

    it('should return a Number between a range', () => {
      const n = numberUtil.getRandomNumberBetween(1, 10);
      n.should.be.least(1).and.most(10);
    });
  });
});
