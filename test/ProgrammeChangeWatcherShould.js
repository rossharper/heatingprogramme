'use strict'

const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const programmeChangeWatcher = require('./../ProgrammeChangeWatcher')

const PATH = '.'
const FILE_NAME = 'programme.json'
const FILE_PATH = path.join(PATH, '/', FILE_NAME)

describe('ProgrammeFileWatcher', function () {
    let watcher

    beforeEach(() => {
        try {
            deleteFile()
        } catch (e) {}
        writeFile({})
    })

    afterEach(() => {
        watcher.stop()
        try {
            deleteFile()
        } catch (e) {}
    })

    function writeFile (programmeData) {
        fs.writeFile(FILE_PATH, JSON.stringify(programmeData), function (err) {
            if (err) {
                console.log(`Error writing programme file: ${err}`)
                throw err
            }

            console.log('Programme data file saved.')
        })
    }

    function deleteFile () {
        fs.unlinkSync(FILE_PATH)
    }
    it('should callback with new programme when new file written', function (done) {
        watcher = programmeChangeWatcher.watchForChanges(PATH, function (programme) {
            expect(programme.getComfortSetPoint()).to.equal(21)
            watcher.stop()
            done()
        })

        writeFile({ comfortTemp: 21 })
    })

    it('should callback a second time when written again', function (done) {
        let calls = 0
        watcher = programmeChangeWatcher.watchForChanges(PATH, function (programme) {
            calls++
            if (calls < 2) {
                expect(programme.getComfortSetPoint()).to.equal(21)
                writeFile({ comfortTemp: 22 })
            } else {
                expect(programme.getComfortSetPoint()).to.equal(22)
                watcher.stop()
                done()
            }
        })

        writeFile({ comfortTemp: 21 })
    })
})
