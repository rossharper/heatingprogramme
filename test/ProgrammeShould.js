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

    describe('comfort setpoint', function () {
        it('should return programmed setpoint', function () {
            const programme = new Programme({
                comfortTemp: 19
            })

            expect(programme.getComfortSetPoint()).to.equal(19)
        })

        it('should return default setpoint of 20 when no programme', function () {
            const programme = new Programme()

            expect(programme.getComfortSetPoint()).to.equal(20)
        })

        it('should allow programme setpoint to change', function () {
            const programme = new Programme({
                comfortTemp: 20
            })

            programme.setComfortSetPoint(30)

            expect(programme.getComfortSetPoint()).to.equal(30)
        })
    })

    describe('isHeatingEnabled()', function () {
        it('should return false when disabled in programme', function () {
            const programme = new Programme({
                heatingOn: false
            })

            expect(programme.isHeatingEnabled()).to.equal(false)
        })

        it('should return true when enabled in programme', function () {
            const programme = new Programme({
                heatingOn: true
            })

            expect(programme.isHeatingEnabled()).to.equal(true)
        })

        it('should return true as default when not in programme', function () {
            const programme = new Programme()

            expect(programme.isHeatingEnabled()).to.equal(true)
        })

        it('should allow heating to be set on', function () {
            const programme = new Programme({
                heatingOn: false
            })

            programme.setHeatingOn()

            expect(programme.isHeatingEnabled()).to.equal(true)
        })

        it('should allow heating to be set off', function () {
            const programme = new Programme({
                heatingOn: true
            })

            programme.setHeatingOff()

            expect(programme.isHeatingEnabled()).to.equal(false)
        })
    })

    describe('current target temperature', function () {
        it('should return frost protect temperature when heating disabled', function () {
            const programme = new Programme({
                frostProtectTemp: 4,
                heatingOn: false
            })

            expect(programme.getCurrentTargetTemperature(new Date())).to.equal(4)
        })

        it('should return default frost protect temperature of 5 when heating disabled and no temp programmed', function () {
            const programme = new Programme({
                heatingOn: false
            })

            expect(programme.getCurrentTargetTemperature(new Date())).to.equal(5)
        })

        it('should return setback temperature if not in a comfort period', function () {
            const programme = new Programme({
                setbackTemp: 11,
                schedule: defaultSchedule()
            })
            const date = new Date('12 Dec 1980 00:00:00')

            expect(programme.getCurrentTargetTemperature(date)).to.equal(11)
        })

        it('should return default setback temperature of 10 if not in a comfort period and not programmed', function () {
            const programme = new Programme({
                schedule: defaultSchedule()
            })
            const date = new Date('12 Dec 1980 00:00:00')

            expect(programme.getCurrentTargetTemperature(date)).to.equal(10)
        })

        it('should return comfort temperature if in first comfort period', function () {
            const programme = new Programme({
                comfortTemp: 21,
                schedule: defaultSchedule()
            })
            const date = new Date('12 Dec 1980 07:00:00')

            expect(programme.getCurrentTargetTemperature(date)).to.equal(21)
        })

        it('should return comfort temperature if in second comfort period', function () {
            const programme = new Programme({
                comfortTemp: 21,
                schedule: defaultSchedule()
            })
            const date = new Date('12 Dec 1980 18:00:00')

            expect(programme.getCurrentTargetTemperature(date)).to.equal(21)
        })

        it('should return default comfort temperature of 20 if in a comfort period and not programmed', function () {
            const programme = new Programme({
                schedule: defaultSchedule()
            })
            const date = new Date('12 Dec 1980 18:00:00')

            expect(programme.getCurrentTargetTemperature(date)).to.equal(20)
        })

        it.skip('should get correct temps when in override periods', function () {})
    })

    describe('comfort periods', function () {
        it('should return comfort periods for a date in the future', function () {
            const date = new Date()
            date.setTime(new Date().getTime() + 7 * 86400000)

            const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)

            assertReturnsComfortPeriodsForDay(day, date)
        })

        describe('should return comfort periods for days of week', function () {
            const tests = [
                { day: 'Monday', date: new Date('December 7, 2020 00:00:00') },
                { day: 'Tuesday', date: new Date('July 3, 2018 00:00:00') },
                { day: 'Wednesday', date: new Date('August 15, 2018 00:00:00') },
                { day: 'Thursday', date: new Date('September 12, 2019 00:00:00') },
                { day: 'Friday', date: new Date('November 13, 2020 00:00:00') },
                { day: 'Saturday', date: new Date('December 12, 2020 00:00:00') },
                { day: 'Sunday', date: new Date('March 7, 2021 00:00:00') }
            ]

            tests.forEach(({ day, date }) => {
                it(`should return comfort periods for ${day}`, function () {
                    assertReturnsComfortPeriodsForDay(day, date)
                })
            })
        })

        function assertReturnsComfortPeriodsForDay (day, date) {
            const expected = defaultComfortPeriods()
            const programme = programmeWithComfortPeriodsForDay(day, expected)

            expect(programme.getComfortPeriodsForDate(date)).to.deep.have.same.members(expected)
        }

        function programmeWithComfortPeriodsForDay (day, comfortPeriodsForDay) {
            const programmeData = skeletonSchedule()
            programmeData.schedule[day].comfortPeriods = comfortPeriodsForDay
            return new Programme(programmeData)
        }

        function skeletonSchedule () {
            return {
                schedule: {
                    Monday: {},
                    Tuesday: {},
                    Wednesday: {},
                    Thursday: {},
                    Friday: {},
                    Saturday: {},
                    Sunday: {}
                }
            }
        }
    })

    function defaultSchedule () {
        return {
            Monday: defaultScheduleDay(),
            Tuesday: defaultScheduleDay(),
            Wednesday: defaultScheduleDay(),
            Thursday: defaultScheduleDay(),
            Friday: defaultScheduleDay(),
            Saturday: defaultScheduleDay(),
            Sunday: defaultScheduleDay()
        }
    }

    function defaultScheduleDay () {
        return {
            comfortPeriods: defaultComfortPeriods()
        }
    }

    function defaultComfortPeriods () {
        return [
            {
                startTime: '06:30',
                endTime: '10:30'
            },
            {
                startTime: '17:30',
                endTime: '23:30'
            }
        ]
    }
})
