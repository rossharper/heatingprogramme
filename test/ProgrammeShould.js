'use strict'

const chai = require('chai')
const Programme = require('../Programme').Programme
const expect = chai.expect // we are using the "expect" style of Chai

describe('Programme', function () {
    it('should return programmeData that it was init with', function () {
        const programmeData = {
            frostProtectTemp: 1,
            setbackTemp: 15,
            comfortTemp: 25,
            heatingOn: false
        }
        const programme = new Programme(programmeData)

        const returnedProgramme = programme.getProgrammeData()

        expect(returnedProgramme).to.deep.equal(programmeData)
    })

    it('should return default setpoint', function () {
        const programme = new Programme({
            comfortTemp: 20
        })

        expect(programme.getComfortSetPoint()).to.equal(20)
    })

    it('should allow programme setpoint to change', function () {
        const programme = new Programme({
            comfortTemp: 20
        })

        programme.setComfortSetPoint(30)

        expect(programme.getComfortSetPoint()).to.equal(30)
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
        const programme = new Programme({
            schedule: {
                Monday: {},
                Tuesday: {},
                Wednesday: {},
                Thursday: {},
                Friday: {},
                Saturday: {
                    comfortPeriods: expected
                },
                Sunday: {}
            }
        })

        expect(programme.getComfortPeriodsForDate(date)).to.deep.have.same.members(expected)
        done()
    })
})
