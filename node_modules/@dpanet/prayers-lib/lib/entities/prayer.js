"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
var PrayersName;
(function (PrayersName) {
    PrayersName["IMSAK"] = "Imsak";
    PrayersName["FAJR"] = "Fajr";
    PrayersName["SUNRISE"] = "Sunrise";
    PrayersName["DHUHR"] = "Dhuhr";
    PrayersName["ASR"] = "Asr";
    PrayersName["MAGHRIB"] = "Maghrib";
    PrayersName["SUNSET"] = "Sunset";
    PrayersName["ISHA"] = "Isha";
    PrayersName["MIDNIGHT"] = "Midnight";
})(PrayersName = exports.PrayersName || (exports.PrayersName = {}));
;
var Schools;
(function (Schools) {
    Schools[Schools["Shafi"] = 0] = "Shafi";
    Schools[Schools["Hanafi"] = 1] = "Hanafi";
})(Schools = exports.Schools || (exports.Schools = {}));
;
var MidnightMode;
(function (MidnightMode) {
    MidnightMode[MidnightMode["Standard"] = 0] = "Standard";
    MidnightMode[MidnightMode["Jafari"] = 1] = "Jafari";
})(MidnightMode = exports.MidnightMode || (exports.MidnightMode = {}));
;
var AdjsutmentMethod;
(function (AdjsutmentMethod) {
    AdjsutmentMethod[AdjsutmentMethod["Provider"] = 0] = "Provider";
    AdjsutmentMethod[AdjsutmentMethod["Server"] = 1] = "Server";
    AdjsutmentMethod[AdjsutmentMethod["Client"] = 2] = "Client";
})(AdjsutmentMethod = exports.AdjsutmentMethod || (exports.AdjsutmentMethod = {}));
var LatitudeMethod;
(function (LatitudeMethod) {
    LatitudeMethod[LatitudeMethod["MidNight"] = 1] = "MidNight";
    LatitudeMethod[LatitudeMethod["Seventh"] = 2] = "Seventh";
    LatitudeMethod[LatitudeMethod["Angle"] = 3] = "Angle";
})(LatitudeMethod = exports.LatitudeMethod || (exports.LatitudeMethod = {}));
;
var Methods;
(function (Methods) {
    Methods[Methods["Shia"] = 0] = "Shia";
    Methods[Methods["Karachi"] = 1] = "Karachi";
    Methods[Methods["America"] = 2] = "America";
    Methods[Methods["MuslimLeague"] = 3] = "MuslimLeague";
    Methods[Methods["Mecca"] = 4] = "Mecca";
    Methods[Methods["Egypt"] = 5] = "Egypt";
    Methods[Methods["Iran"] = 7] = "Iran";
    Methods[Methods["Gulf"] = 8] = "Gulf";
    Methods[Methods["Kuwait"] = 9] = "Kuwait";
    Methods[Methods["Qatar"] = 10] = "Qatar";
    Methods[Methods["Singapore"] = 11] = "Singapore";
    Methods[Methods["France"] = 12] = "France";
    Methods[Methods["Turkey"] = 13] = "Turkey";
    Methods[Methods["Custom"] = 99] = "Custom";
})(Methods = exports.Methods || (exports.Methods = {}));
;
var PrayerType;
(function (PrayerType) {
    PrayerType["Fardh"] = "Fardh";
    PrayerType["Sunna"] = "Sunna";
})(PrayerType = exports.PrayerType || (exports.PrayerType = {}));
exports.PrayersTypes = [
    { prayerName: PrayersName.FAJR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.DHUHR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.ASR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.MAGHRIB, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.ISHA, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.SUNRISE, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.SUNSET, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.IMSAK, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.MIDNIGHT, prayerType: PrayerType.Sunna },
];
class PrayerAdjustment {
    get prayerName() {
        return this._prayerName;
    }
    set prayerName(value) {
        this._prayerName = value;
    }
    get adjustments() {
        return this._adjustments;
    }
    set adjustments(value) {
        this._adjustments = value;
    }
}
exports.PrayerAdjustment = PrayerAdjustment;
class PrayersMidnight {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get midnight() {
        return this._midnight;
    }
    set midnight(value) {
        this._midnight = value;
    }
}
class PrayerAdjustmentMethod {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get adjustmentMethod() {
        return this._adjustmentMethod;
    }
    set adjustmentMethod(value) {
        this._adjustmentMethod = value;
    }
}
class PrayerLatitude {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get latitudeMethod() {
        return this._latitudeMethod;
    }
    set latitudeMethod(value) {
        this._latitudeMethod = value;
    }
}
class PrayerSchools {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get school() {
        return this._school;
    }
    set school(value) {
        this._school = value;
    }
}
class PrayersMethods {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get methodName() {
        return this._methodName;
    }
    set methodName(value) {
        this._methodName = value;
    }
}
class Prayers {
    constructor() {
        this._prayerTime = new Array();
    }
    get prayerTime() {
        return this._prayerTime;
    }
    set prayerTime(value) {
        this._prayerTime = value;
    }
    get prayersDate() {
        return this._prayersDate;
    }
    set prayersDate(value) {
        this._prayersDate = value;
    }
    toJSON() {
        return {
            prayerTime: this._prayerTime,
            prayersDate: this._prayersDate
        };
    }
}
exports.Prayers = Prayers;
class PrayersTime {
    //prayer constructors, with timing,
    constructor(prayers, locationSettings, prayerConfig) {
        this._location = locationSettings;
        this._prayers = prayers;
        this._pareyerSettings = prayerConfig;
    }
    get location() {
        return this._location;
    }
    set location(value) {
        this._location = value;
    }
    get pareyerSettings() {
        return this._pareyerSettings;
    }
    set pareyerSettings(value) {
        this._pareyerSettings = value;
    }
    get prayers() {
        return this._prayers;
    }
    set prayers(value) {
        this._prayers = value;
    }
}
exports.PrayersTime = PrayersTime;
class PrayersSettings {
    get adjustmentMethod() {
        return this._adjustmentMethod;
    }
    set adjustmentMethod(value) {
        this._adjustmentMethod = value;
    }
    get startDate() {
        return this._startDate;
    }
    set startDate(value) {
        this._startDate = value;
    }
    get endDate() {
        return this._endDate;
    }
    set endDate(value) {
        this._endDate = value;
    }
    get adjustments() {
        return this._adjustments;
    }
    set adjustments(value) {
        this._adjustments = value;
    }
    get method() {
        return this._method;
    }
    set method(value) {
        this._method = value;
    }
    get school() {
        return this._school;
    }
    set school(value) {
        this._school = value;
    }
    get midnight() {
        return this._midnight;
    }
    set midnight(value) {
        this._midnight = value;
    }
    get latitudeAdjustment() {
        return this._latitudeAdjustment;
    }
    set latitudeAdjustment(value) {
        this._latitudeAdjustment = value;
    }
    toJSON() {
        return {
            midnight: this._midnight,
            school: this._school,
            latitudeAdjustment: this._latitudeAdjustment,
            method: this._method,
            startDate: this._startDate,
            adjustmentMethod: this._adjustmentMethod,
            endDate: this._endDate,
            adjustments: this._adjustments
        };
    }
    constructor(prayersSettings) {
        if (!isNullOrUndefined_1.isNullOrUndefined(prayersSettings))
            this._prayersSettings = prayersSettings;
        else {
            this._method = new PrayersMethods();
            this._adjustments = new Array();
            this._midnight = new PrayersMidnight();
            this._school = new PrayerSchools();
            this._adjustmentMethod = new PrayerAdjustmentMethod();
            this._latitudeAdjustment = new PrayerLatitude();
        }
    }
}
exports.PrayersSettings = PrayersSettings;
//# sourceMappingURL=prayer.js.map