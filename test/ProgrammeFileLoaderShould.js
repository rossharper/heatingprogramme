'use strict'

const chai = require('chai')
const expect = chai.expect // we are using the "expect" style of Chai
const ProgrammeFileLoader = require('./../ProgrammeFileLoader')

describe('ProgrammeFileLoader should', function () {
    it('should load default programme when no programme data available', function (done) {
        ProgrammeFileLoader.loadProgramme('test/fixtures/loader_noprogramme', function (programme) {
            expect(programme.getComfortSetPoint()).to.equal(20)
            expect(programme.isHeatingEnabled()).to.equal(true)
            done()
        })
    })

    it('should return error if no default programme available', function () {
        // need to refactor the loader to do this, which will change its api
    })

    it('should return programme data when available', function (done) {
        ProgrammeFileLoader.loadProgramme('test/fixtures/loader_programme', function (programme) {
            expect(programme.getComfortSetPoint()).to.equal(21)
            expect(programme.isHeatingEnabled()).to.equal(false)
            done()
        })
    })
})
