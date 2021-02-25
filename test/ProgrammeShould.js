var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Programme = require('./../Programme');
var ProgrammeFileLoader = require('./../ProgrammeFileLoader');

describe.skip('Programme', function() {
    it('should do something', function(done) {
        done();
    });

    it('should return comfort periods for Saturday', function(done) {
      // TODO: inject fixture
      ProgrammeFileLoader.loadProgramme('.', function(programme) {
          var date = new Date('January 9, 2016 00:00:00'); // a saturday
  
          var expected = [
              {
                  "startTime" : "06:30",
                  "endTime" : "10:30"
              },
              {
                  "startTime" : "17:30",
                  "endTime" : "23:30"
              }
          ];
  
          expect(programme.getComfortPeriodsForDate(date)).to.deep.have.same.members(expected);
          done();
      });
    });
});
