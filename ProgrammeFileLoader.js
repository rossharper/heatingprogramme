var fs          = require('fs'),
    Programme   = require('./Programme').Programme,
    ProgrammeFile = require('./ProgrammeFile'),
    FileWatcher = require('./FileWatcher');

function readProgrammeFile(programmeFilePath, callback) {
    fs.readFile(programmeFilePath, function (err, data) {
        if(err) {
            callback(err, null);
        }
        else {
            callback(null, JSON.parse(data));
        }
    });
}

function loadProgrammeFile(programmeFilePath, callback) {
    readProgrammeFile(programmeFilePath, function(err, programmeData) {
        if(err) {
            if(err.code === 'ENOENT') {
                console.log("Programme data file missing: " + programmeFilePath);
                readProgrammeFile(ProgrammeFile.getDefaultProgrammeDataFilePath(), function(err, defaultProgrammeData) {
                    if(err) throw err;
                    callback(defaultProgrammeData);
                });
            }
            else {
                throw err;
            }
        }
        else {
            callback(programmeData);
        }
    });
}

module.exports = {
    loadProgramme : function(programmeDataPath, callback) {
        loadProgrammeFile(ProgrammeFile.getProgrammeDataFilePath(programmeDataPath), function(programmeData) {
            callback(new Programme(programmeData));
        });
    }
}
