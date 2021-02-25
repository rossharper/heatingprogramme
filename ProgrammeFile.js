'use strict'

const path = require('path')

const DEFAULT_PROGRAMME_FILE = path.join(__dirname, '/defaultProgramme.json')
const PROGRAMME_FILE = 'programme.json'

function getProgrammeDataFilePath (programmeDataPath) {
    return path.join(programmeDataPath, PROGRAMME_FILE)
}

module.exports = {
    getProgrammeDataFilePath: getProgrammeDataFilePath,
    getDefaultProgrammeDataFilePath: function () {
        return DEFAULT_PROGRAMME_FILE
    }
}
