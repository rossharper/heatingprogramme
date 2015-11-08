var FileWatcher = require('./FileWatcher');

var ProgrammeFileLoader = require('./ProgrammeFileLoader');

var PROGRAMME_FILE = "programme.json";

function ProgrammeProvider(programmeDataPath) {

    var programme;
    watchProgrammeFile();

    this.getProgramme = function(callback) {
        if(programme !== undefined) {
            callback(programme);
        }
        else {
            loadProgramme(callback);
        }
    }

    function loadProgramme(callback) {
        ProgrammeFileLoader.loadProgramme(programmeDataPath, function(loadedProgramme) {
            programme = loadedProgramme;
            callback(programme);
        });
    }

    function onProgrammeFileChange() {
        console.log("Programme file changed. Reloading.");

        loadProgramme();
    }

    function watchProgrammeFile() {
        FileWatcher.watchFile(ProgrammeFileLoader.getProgrammeDataFilePath(programmeDataPath), onProgrammeFileChange);
    }
}

module.exports = {
    ProgrammeProvider : ProgrammeProvider
}
