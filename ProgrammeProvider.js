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
            ProgrammeFileLoader.loadProgramme(programmeDataPath, function(loadedProgramme) {
                programme = loadedProgramme;
                callback(programme);
            });
        }
    }

    function onProgrammeFileChange() {
        console.log("Programme file changed. Reloading.");

        ProgrammeFileLoader.loadProgramme(programmeDataPath, function(loadedProgramme) {
            programme = loadedProgramme;
        });
    }

    function watchProgrammeFile() {
        FileWatcher.watchFile(ProgrammeFileLoader.getProgrammeDataFilePath(programmeDataPath), onProgrammeFileChange);
    }
}

module.exports = {
    ProgrammeProvider : ProgrammeProvider
}
