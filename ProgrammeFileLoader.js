var fs          = require('fs'),
    Programme   = require('./Programme').Programme,
    FileWatcher = require('./FileWatcher');

var DEFAULT_PROGRAMME_FILE = __dirname + "/defaultProgramme.json";
var PROGRAMME_FILE = "programme.json";

function getProgrammeDataFilePath(programmeDataPath) {
    return programmeDataPath + "/" + PROGRAMME_FILE;
}

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
                readProgrammeFile(DEFAULT_PROGRAMME_FILE, function(err, defaultProgrammeData) {
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
        loadProgrammeFile(getProgrammeDataFilePath(programmeDataPath), function(programmeData) {
            callback(new Programme(programmeData));
        });
    },
    getProgrammeDataFilePath : getProgrammeDataFilePath
}
