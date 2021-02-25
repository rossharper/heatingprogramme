'use strict'

const chai = require('chai')
const Programme = require('../Programme')
const expect = chai.expect // we are using the "expect" style of Chai
const ProgrammeFileLoader = require('./../ProgrammeFileLoader')

describe('Programme', function () {
    let programme

    beforeEach(function (done) {
        ProgrammeFileLoader.loadProgramme('.', function (it) {
            programme = it
            done()
        })
    })

    it('should return programmeData that it was init with', function () {
        const programmeData = {
            frostProtectTemp: 1,
            setbackTemp: 15,
            comfortTemp: 25,
            heatingOn: false
        }
        programme = new Programme.Programme(programmeData)

        const returnedProgramme = programme.getProgrammeData()

        expect(returnedProgramme).to.deep.equal(programmeData)
    })

    it('should return comfort periods for Saturday', function (done) {
        const date = new Date('January 9, 2016 00:00:00') // a saturday

        const expected = [
            {
                startTime: '06:30',
                endTime: '10:30'
            },
            {
                startTime: '17:30',
                endTime: '23:30'
            }
        ]

        expect(programme.getComfortPeriodsForDate(date)).to.deep.have.same.members(expected)
        done()
    })
})
