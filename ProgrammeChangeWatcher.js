'use strict'

const FileWatcher = require('./FileWatcher')
const ProgrammeFileLoader = require('./ProgrammeFileLoader')
const ProgrammeFile = require('./ProgrammeFile')

function loadProgramme (programmeDataPath, callback) {
    ProgrammeFileLoader.loadProgramme(programmeDataPath, function (loadedProgramme) {
        const programme = loadedProgramme
        callback(programme)
    })
}

function watchProgrammeFile (programmeDataPath, onProgrammeChange) {
    FileWatcher.watchFile(ProgrammeFile.getProgrammeDataFilePath(programmeDataPath), function () {
        console.log('Programme file changed. Reloading.')
        loadProgramme(programmeDataPath, onProgrammeChange)
    })
}

module.exports = {
    watchForChanges: function (programmeDataPath, onProgrammeChange) {
        watchProgrammeFile(programmeDataPath, onProgrammeChange)
    }
}
