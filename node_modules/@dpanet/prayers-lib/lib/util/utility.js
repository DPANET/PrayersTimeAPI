"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const momentTZ = require("moment-timezone");
class DateUtil {
    static getEndofDate(endDate) {
        return moment.utc(endDate).endOf('D').toDate();
    }
    static addDay(days, dateNow) {
        return moment.utc(dateNow).add(1, 'd').toDate();
    }
    static addMinutes(date, minutes) {
        return moment.utc(date).add(minutes, 'minute').toDate();
    }
    static getTime(date, time) {
        return new Date(date + ' ' + time);
    }
    static getNowDate() {
        return moment.utc(new Date(), this.format).startOf('day').toDate();
    }
    static getNowTime() {
        return new Date();
    }
    static getYear(date) {
        return date.getUTCFullYear();
    }
    static getMonth(date) {
        return date.getUTCMonth() + 1;
    }
    static addMonth(months, date) {
        return moment(date, this.format).add(1, 'month').toDate();
    }
    static dayMatch(dateLeft, dateRight) {
        let value = (dateLeft.getUTCFullYear() === dateRight.getUTCFullYear()) &&
            (dateLeft.getUTCMonth() === dateRight.getUTCMonth()) &&
            (dateLeft.getUTCDate() === dateRight.getUTCDate());
        return value;
    }
    static formatDate(date) {
        return moment.utc(date, 'DD MMM YYYY').toDate();
    }
    static getDateByTimeZone(date, timeZone) {
        return momentTZ(date).tz(timeZone).format();
    }
    static getStartOfDay(date) {
        return moment.utc(date, this.format).startOf('day').toDate();
    }
    static getMonthsDifference(startDate, endDate) {
        let startMoment = moment.utc(startDate, this.format).startOf('month');
        let endMoment = moment.utc(endDate, this.format).startOf('day');
        return endMoment.diff(startMoment, 'M', false);
    }
}
DateUtil.format = 'YYYY-MM-DD';
exports.DateUtil = DateUtil;
//# sourceMappingURL=utility.js.map