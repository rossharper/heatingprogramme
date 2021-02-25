'use strict'

const fs = require('fs')
const ProgrammeFile = require('./ProgrammeFile')

module.exports = {
    writeProgramme: function (programmeDataPath, programme, callback) {
        fs.writeFile(ProgrammeFile.getProgrammeDataFilePath(programmeDataPath), JSON.stringify(programme.getProgrammeData()), function (err) {
            if (err) {
                console.log(`Error writing programme file: ${err}`)
                callback(err)
                return
            }

            console.log('Programme data file saved.')

            callback()
        })
    }
}
