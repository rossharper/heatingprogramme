var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Programme = require('./../Programme');
var ProgrammeFileLoader = require('./../ProgrammeFileLoader');

describe('Programme', function() {
    it('should return comfort setpoint', function(done) {
      ProgrammeFileLoader.loadProgramme('.', function(programme) {
        expect(programme.getComfortSetPoint()).to.equal(20);
        done();
      });
    });

    it('should update comfort setpoint correctly', function() {
      ProgrammeFileLoader.loadProgramme('.', function(programme) {
        programme.setComfortSetPoint(10);
        expect(programme.getComfortSetPoint()).to.equal(10);
        done();
      });
    });
  });