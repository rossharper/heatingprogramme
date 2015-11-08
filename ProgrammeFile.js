var DEFAULT_PROGRAMME_FILE = __dirname + "/defaultProgramme.json";
var PROGRAMME_FILE = "programme.json";

function getProgrammeDataFilePath(programmeDataPath) {
    return programmeDataPath + "/" + PROGRAMME_FILE;
}

module.exports = {
    getProgrammeDataFilePath : getProgrammeDataFilePath,
    getDefaultProgrammeDataFilePath : function() {
        return DEFAULT_PROGRAMME_FILE;
    }
}
