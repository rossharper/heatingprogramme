var fs          = require('fs'),
    Programme   = require('./Programme').Programme,
    FileWatcher = require('./FileWatcher');

var DEFAULT_PROGRAMME_FILE = __dirname + "/defaultProgramme.json";
var PROGRAMME_FILE = "programme.json";

function ProgrammeProvider(programmeDataPath) {

    var programme = new Programme(loadProgrammeFileSync());
    watchProgrammeFile();

    this.getProgramme = function() {
        return programme;
    }

    function getProgrammeDataFilePath() {
        return programmeDataPath + "/" + PROGRAMME_FILE;
    }

    function readProgrammeFileSync(programmeFilePath) {
        var file = fs.readFileSync(programmeFilePath, "utf8");
        return JSON.parse(file);
    }

    function loadProgrammeFileSync() {
        var programmeFilePath = getProgrammeDataFilePath();
        try{
            return readProgrammeFileSync(programmeFilePath);
        }
        catch(e) {
            if (e.code === 'ENOENT') {
                console.log("Programme data file missing: " + programmeFilePath);
                return readProgrammeFileSync(DEFAULT_PROGRAMME_FILE);
            } else {
                throw e;
            }
        }
    }

    function readProgrammeFile(programmeFilePath, callback) {
        fs.readFile(programmeFilePath, function (err, data) {
            if (err) throw err;
            callback(JSON.parse(data));
        });
    }

    function loadProgrammeFile(callback) {
        var programmeFilePath = getProgrammeDataFilePath();
        try{
            readProgrammeFile(programmeFilePath, callback);
        }
        catch(e) {
            if (e.code === 'ENOENT') {
                console.log("Programme data file missing: " + programmeFilePath);
                readProgrammeFile(DEFAULT_PROGRAMME_FILE, callback);
            } else {
                throw e;
            }
        }
    }

    function onProgrammeFileChange() {
        console.log("Programme file changed. Reloading.");
        //programme = new Programme(loadProgrammeFileSync());
        loadProgrammeFile(function(programmeJson) {
            programme = new Programme(programmeJson);
        });
    }

    function watchProgrammeFile() {
        FileWatcher.watchFile(getProgrammeDataFilePath(), onProgrammeFileChange);
    }
}

module.exports = {
    ProgrammeProvider : ProgrammeProvider
}
