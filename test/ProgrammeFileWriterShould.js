'use strict'

const fs = require('fs')
const path = require('path')
const chai = require('chai')
const ProgrammeFileWriter = require('../ProgrammeFileWriter')
const expect = chai.expect // we are using the "expect" style of Chai
const ProgrammeFileLoader = require('./../ProgrammeFileLoader')

const PATH = '.'
const FILE_NAME = 'programme.json'
const FILE_PATH = path.join(PATH, '/', FILE_NAME)

describe('ProgrammeFileWriter', function () {
    beforeEach(() => {
        try {
            deleteFile()
        } catch (e) {}
    })

    afterEach(() => {
        try {
            deleteFile()
        } catch (e) {}
    })

    function deleteFile () {
        fs.unlinkSync(FILE_PATH)
    }

    it('should successfully write programme file', function (done) {
        ProgrammeFileLoader.loadProgramme(PATH, function (programme) {
            programme.setComfortSetPoint(30)
            programme.setHeatingOff()
            ProgrammeFileWriter.writeProgramme(PATH, programme, function (err) {
                ProgrammeFileLoader.loadProgramme(PATH, function (writtenProgramme) {
                    expect(err).is.undefined
                    expect(programme.getComfortSetPoint()).to.equal(30)
                    expect(programme.isHeatingEnabled()).to.equal(false)
                    done()
                })
            })
        })
    })

    it('should throw error writing file when path does not exist', function (done) {
        ProgrammeFileLoader.loadProgramme(PATH, function (programme) {
            ProgrammeFileWriter.writeProgramme('doesnotexist', programme, function (err) {
                expect(err).to.not.be.undefined
                done()
            })
        })
    })
})
