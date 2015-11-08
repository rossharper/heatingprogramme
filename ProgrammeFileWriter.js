var fs = require('fs');
var ProgrammeFile = require('./ProgrammeFile');

module.exports = {
    writeProgramme : function(programmeDataPath, programme, callback) {
        fs.writeFile(ProgrammeFile.getProgrammeDataFilePath(programmeDataPath), programme.getProgrammeData(), function(err) {
            if(err) {
                return console.log(err);
                callback(err);
            }

            console.log("Programme data file saved.");

            callback();
        });
    }
}
