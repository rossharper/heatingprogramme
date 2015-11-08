var fs          = require('fs'),
    Programme   = require('./Programme').Programme,
    FileWatcher = require('./FileWatcher');

var DEFAULT_PROGRAMME_FILE = __dirname + "/defaultProgramme.json";
var PROGRAMME_FILE = "programme.json";

function ProgrammeProvider(programmeDataPath) {

    var programme;
    watchProgrammeFile();

    this.getProgramme = function(callback) {
        if(programme !== undefined) {
            callback(programme);
        }
        else {
            loadProgrammeFile(function(programmeData) {
                programme = new Programme(programmeData);
                callback(programme);
            });
        }
    }

    function getProgrammeDataFilePath() {
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

    function loadProgrammeFile(callback) {
        var programmeFilePath = getProgrammeDataFilePath();

        readProgrammeFile(programmeFilePath, function(err, programmeData) {
            if(err) {
                if(err.code === 'ENOENT') {
                    console.log("Programme data file missing: " + programmeFilePath);
                    readProgrammeFile(DEFAULT_PROGRAMME_FILE, function(err, programmeData) {
                        if(err) throw err;
                        callback(programmeData);
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

    function onProgrammeFileChange() {
        console.log("Programme file changed. Reloading.");
        loadProgrammeFile(function(programmeData) {
            programme = new Programme(programmeData);
        });
    }

    function watchProgrammeFile() {
        FileWatcher.watchFile(getProgrammeDataFilePath(), onProgrammeFileChange);
    }
}

module.exports = {
    ProgrammeProvider : ProgrammeProvider
}
