var DateUtil = require('dateutil');

function Programme(programme) {

    var self = this;

    this.getCurrentTargetTemperature = function(date) {
        if(!self.isHeatingEnabled()) {
            return programme.frostProtectTemp;
        }
        return getOverriddenTemperature(date) || getProgrammeTemperature(date);
    }

    this.isHeatingEnabled = function() {
        return programme.heatingOn;
    }

    this.isInComfortMode = function(date) {
        if(self.inOverridePeriod(date)) {
            return programme.override.comfortState;
        }
        else {
            return inAnyComfortPeriodForDate(date);
        }
    }

    this.inOverridePeriod = function(date) {
        return programme.override && programme.override.until && beforeOverrideEnd(date, programme.override.until);
    }

    function getOverriddenTemperature(date) {
        if(self.inOverridePeriod(date)) {
            return getTemperatureForComfortState(programme.override.comfortState);
        }
        return NaN;
    }

    function beforeOverrideEnd(date, overrideEndTimeMs) {
        return date.getTime() < overrideEndTimeMs;
    }

    function getProgrammeTemperature(date) {
        return getTemperatureForComfortState(inAnyComfortPeriodForDate(date));
    }

    function getTemperatureForComfortState(comfortState) {
        return comfortState ? programme.comfortTemp : programme.setbackTemp;
    }

    function laterThanComfortPeriodStart(date, period) {
        var start = DateUtil.getDateFromTimeStr(date, period.startTime);
        return DateUtil.isFirstDateBeforeSecondDate(start, date);
    }

    function earlierThanComfortPeriodEnd(date, period) {
        var end = DateUtil.getDateFromTimeStr(date, period.endTime);
        return DateUtil.isFirstDateBeforeSecondDate(date, end);
    }

    function inComfortPeriod(date, comfortPeriod) {
        return laterThanComfortPeriodStart(date, comfortPeriod) && earlierThanComfortPeriodEnd(date, comfortPeriod);
    }

    function inAnyComfortPeriodForDate(date) {
        var periodsForToday = programme.schedule[DateUtil.getDayOfWeek(date)].comfortPeriods;
        for(var i = 0; i < periodsForToday.length; ++i) {
            if(inComfortPeriod(date, periodsForToday[i])) {
                return true;
            }
        }
        return false;
    }
}

module.exports = {
    Programme : Programme
}
