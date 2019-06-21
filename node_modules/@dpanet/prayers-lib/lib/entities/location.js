"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
var LocationTypeName;
(function (LocationTypeName) {
    LocationTypeName["LocationBuilder"] = "Location Builder";
})(LocationTypeName = exports.LocationTypeName || (exports.LocationTypeName = {}));
;
class Location {
    constructor(location, timeZone) {
        if (!isNullOrUndefined_1.isNullOrUndefined(location)) {
            this._latitude = location.latitude;
            this._longtitude = location.longtitude;
            this._countryCode = location.countryCode;
            this._countryName = location.countryName;
            this._address = location.address;
        }
        if (!isNullOrUndefined_1.isNullOrUndefined(timeZone)) {
            this._timeZoneId = timeZone.timeZoneId;
            this._timeZoneName = timeZone.timeZoneName;
            this._dstOffset = timeZone.dstOffset;
            this._rawOffset = timeZone.rawOffset;
        }
    }
    get latitude() {
        return this._latitude;
    }
    set latitude(value) {
        this._latitude = value;
    }
    get longtitude() {
        return this._longtitude;
    }
    set longtitude(value) {
        this._longtitude = value;
    }
    get city() {
        return this._city;
    }
    set city(value) {
        this._city = value;
    }
    get countryCode() {
        return this._countryCode;
    }
    set countryCode(value) {
        this._countryCode = value;
    }
    get countryName() {
        return this._countryName;
    }
    set countryName(value) {
        this._countryName = value;
    }
    get address() {
        return this._address;
    }
    set address(value) {
        this._address = value;
    }
    get timeZoneId() {
        return this._timeZoneId;
    }
    set timeZoneId(value) {
        this._timeZoneId = value;
    }
    get timeZoneName() {
        return this._timeZoneName;
    }
    set timeZoneName(value) {
        this._timeZoneName = value;
    }
    get rawOffset() {
        return this._rawOffset;
    }
    set rawOffset(value) {
        this._rawOffset = value;
    }
    get dstOffset() {
        return this._dstOffset;
    }
    set dstOffset(value) {
        this._dstOffset = value;
    }
}
exports.Location = Location;
//# sourceMappingURL=location.js.map