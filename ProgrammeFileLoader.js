'use strict'

const fs = require('fs')
const Programme = require('./Programme').Programme
const ProgrammeFile = require('./ProgrammeFile')

function readProgrammeFile (programmeFilePath, callback) {
    fs.readFile(programmeFilePath, function (err, data) {
        if (err) {
            callback(err, null)
        } else {
            callback(null, JSON.parse(data))
        }
    })
}

function loadProgrammeFile (programmeFilePath, callback) {
    readProgrammeFile(programmeFilePath, function (err, programmeData) {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('Programme data file missing: ' + programmeFilePath)
                readProgrammeFile(ProgrammeFile.getDefaultProgrammeDataFilePath(), function (err, defaultProgrammeData) {
                    if (err) throw err
                    callback(defaultProgrammeData)
                })
            } else {
                throw err
            }
        } else {
            callback(programmeData)
        }
    })
}

module.exports = {
    loadProgramme: function (programmeDataPath, callback) {
        loadProgrammeFile(ProgrammeFile.getProgrammeDataFilePath(programmeDataPath), function (programmeData) {
            callback(new Programme(programmeData))
        })
    }
}
