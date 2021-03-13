'use strict'

const DateUtil = require('dateutil')

function Programme (programme) {
    const self = this
    programme = (programme === undefined) ? {} : programme

    this.getProgrammeData = function () {
        return programme
    }

    this.getComfortSetPoint = function () {
        return getComfortTemperature()
    }

    this.setComfortSetPoint = function (setPoint) {
        programme.comfortTemp = setPoint
    }

    this.getComfortPeriodsForDate = function (date) {
        return programme.schedule[DateUtil.getDayOfWeek(date)].comfortPeriods
    }

    this.getCurrentTargetTemperature = function (date) {
        if (!self.isHeatingEnabled()) {
            return getFrostProtectTemp()
        }
        return getOverriddenTemperature(date) || getProgrammeTemperature(date)
    }

    this.isHeatingEnabled = function () {
        return (programme.heatingOn === undefined) ? true : programme.heatingOn
    }

    this.setHeatingOn = function () {
        programme.heatingOn = true
    }

    this.setHeatingOff = function () {
        programme.heatingOn = false
    }

    this.setComfortOverride = function (untilDate) {
        self.setHeatingOn()
        programme.override = {}
        programme.override.comfortState = true
        programme.override.until = untilDate.getTime()
    }

    this.setSetbackOverride = function (untilDate) {
        self.setHeatingOn()
        programme.override = {}
        programme.override.comfortState = false
        programme.override.until = untilDate.getTime()
    }

    this.clearOverride = function () {
        programme.override = undefined
    }

    this.isInComfortMode = function (date) {
        if (self.isInOverridePeriod(date)) {
            return programme.override.comfortState
        } else {
            return isInAnyComfortPeriodForDate(date)
        }
    }

    this.isInOverridePeriod = function (date) {
        return (
            programme.override !== undefined &&
            programme.override.until !== undefined &&
            programme.override.comfortState !== undefined &&
            beforeOverrideEnd(date, programme.override.until))
    }

    function getOverriddenTemperature (date) {
        if (self.isInOverridePeriod(date)) {
            return programme.override.overrideTemp || getTemperatureForComfortState(programme.override.comfortState)
        }
        return NaN
    }

    function beforeOverrideEnd (date, overrideEndTimeMs) {
        return date.getTime() < overrideEndTimeMs
    }

    function getProgrammeTemperature (date) {
        const comfortPeriod = comfortPeriodForDate(date)
        if (comfortPeriod !== undefined) {
            return comfortPeriod.targetTemp || getComfortTemperature()
        }

        return getSetbackTemperature()
    }

    function getComfortTemperature () {
        return programme.comfortTemp || 20
    }

    function getSetbackTemperature () {
        return programme.setbackTemp || 10
    }

    function getFrostProtectTemp () {
        return programme.frostProtectTemp || 5
    }

    function getTemperatureForComfortState (comfortState) {
        return comfortState ? getComfortTemperature() : getSetbackTemperature()
    }

    function laterThanComfortPeriodStart (date, period) {
        const start = DateUtil.getDateFromTimeStr(date, period.startTime)
        return DateUtil.isFirstDateBeforeSecondDate(start, date)
    }

    function earlierThanComfortPeriodEnd (date, period) {
        const end = DateUtil.getDateFromTimeStr(date, period.endTime)
        return DateUtil.isFirstDateBeforeSecondDate(date, end)
    }

    function isInComfortPeriod (date, comfortPeriod) {
        return laterThanComfortPeriodStart(date, comfortPeriod) && earlierThanComfortPeriodEnd(date, comfortPeriod)
    }

    function isInAnyComfortPeriodForDate (date) {
        return comfortPeriodForDate(date) !== undefined
    }

    function comfortPeriodForDate (date) {
        const periodsForToday = programme.schedule[DateUtil.getDayOfWeek(date)].comfortPeriods
        for (const comfortPeriod of periodsForToday) {
            if (isInComfortPeriod(date, comfortPeriod)) {
                return comfortPeriod
            }
        }
        return undefined
    }
}

module.exports = {
    Programme: Programme
}
