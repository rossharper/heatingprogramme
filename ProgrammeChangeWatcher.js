'use strict'

const ProgrammeFileLoader = require('./ProgrammeFileLoader')
const ProgrammeFile = require('./ProgrammeFile')
const Chokidar = require('chokidar')

function loadProgramme (programmeDataPath, callback) {
    ProgrammeFileLoader.loadProgramme(programmeDataPath, function (loadedProgramme) {
        const programme = loadedProgramme
        callback(programme)
    })
}

function watchProgrammeFile (programmeDataPath, onProgrammeChange) {
    const file = ProgrammeFile.getProgrammeDataFilePath(programmeDataPath)
    const watcher = Chokidar.watch(file)
    const log = console.log.bind(console)

    watcher
        .on('error', function (error) {
            log('Error happened', error)
            onProgrammeChange(null, error)
        })

    function onChange () {
        console.log('Programme file changed. Reloading.')
        loadProgramme(programmeDataPath, onProgrammeChange)
    }

    watcher.on('ready', function () {
        log('Watching ' + file + ' for changes...')
        watcher
            .on('add', onChange)
            .on('change', onChange)
    })

    return {
        stop: function () {
            watcher.close()
        }
    }
}

module.exports = {
    watchForChanges: function (programmeDataPath, onProgrammeChange) {
        return watchProgrammeFile(programmeDataPath, onProgrammeChange)
    }
}
