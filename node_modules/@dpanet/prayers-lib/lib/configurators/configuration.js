"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const nconf_1 = __importDefault(require("nconf"));
const debug = Debug("app:router");
const to = require('await-to-js').default;
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const utility_1 = require("../util/utility");
//import _ = require('lodash');
const ramda = require("ramda");
const path_1 = __importDefault(require("path"));
const configPaths = {
    prayerConfig: 'config.prayerConfig.calculations',
    locationConfig: 'config.locationConfig'
};
const ConfigErrorMessages = {
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to data provider, please try again after a while',
    FILE_NOT_FOUND: 'Config file not found, please try again',
    SAVE_FAILED: 'Confile file saving failed'
};
class Configurator {
    constructor(fileName) {
        if (!isNullOrUndefined_1.isNullOrUndefined(fileName))
            this._fileName = fileName;
        else
            this._fileName = path_1.default.join(nconf_1.default.get("CONFIG_FOLDER_PATH"), nconf_1.default.get("PRAYER_CONFIG"));
    }
    async saveLocationConfig(locationConfig) {
        try {
            let original = await this.getLocationConfig();
            let updated;
            updated = ramda.merge(original, locationConfig);
            console.log(updated);
            let result = await this.getDB()
                .then(async (result) => {
                let action = await result.get(configPaths.locationConfig);
                return await action.assign(updated)
                    .write();
            });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(ConfigErrorMessages.SAVE_FAILED);
            if (result)
                return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
        }
    }
    async getLocationConfig() {
        let err, result;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.locationConfig).value()));
        if (err || isNullOrUndefined_1.isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            location: {
                latitude: result.location.latitude,
                longtitude: result.location.longtitude,
                city: result.location.city,
                countryCode: result.location.countryCode,
                countryName: result.location.countryName,
                address: result.location.address
            },
            timezone: {
                timeZoneId: result.timezone.timeZoneId,
                timeZoneName: result.timezone.timeZoneName,
                dstOffset: result.timezone.dstOffset,
                rawOffset: result.timezone.rawOffset
            }
        };
    }
    async savePrayerConfig(prayerConfigs) {
        try {
            let err, result;
            let original = await this.getPrayerConfig();
            let updated;
            let originalIndexBy = ramda.indexBy(ramda.prop('prayerName'));
            let updateIndexBy = ramda.indexBy(ramda.prop('prayerName'));
            let concatPrayers = (k, l, r) => l.prayerName == r.prayerName ? r : l;
            let concatValues = (k, l, r) => k === "adjustments" ? (ramda.values(ramda.mergeDeepWithKey(concatPrayers, originalIndexBy(l), updateIndexBy(r)))) : r;
            let mergedList = ramda.mergeDeepWithKey(concatValues, original, prayerConfigs);
            updated = ramda.omit(['startDate', 'endDate'], mergedList);
            //updated= _.merge<any,any>(ramda.omit(['startDate','endDate'],original),ramda.omit(['startDate','endDate'],prayerConfigs));
            //  console.log(updated);
            result = await this.getDB()
                .then(async (result) => {
                let action = result.get(configPaths.prayerConfig);
                return await action.assign(updated)
                    .write();
            });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(ConfigErrorMessages.SAVE_FAILED);
            if (result)
                return Promise.resolve(true);
            //.then((value)=>console.log(`save success: ${value}`))
            //.catch((err)=> Promise.reject(err));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async getPrayerConfig() {
        let err, result;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.prayerConfig).value()));
        if (err || isNullOrUndefined_1.isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            method: result.method,
            midnight: result.midnight,
            school: result.school,
            latitudeAdjustment: result.latitudeAdjustment,
            adjustmentMethod: result.adjustmentMethod,
            startDate: isNullOrUndefined_1.isNullOrUndefined(result.startDate) ? utility_1.DateUtil.getNowDate() : utility_1.DateUtil.formatDate(result.startDate),
            endDate: isNullOrUndefined_1.isNullOrUndefined(result.endDate) ? utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate()) : utility_1.DateUtil.formatDate(result.endDate),
            adjustments: result.adjustments,
        };
    }
    async getDB() {
        if (isNullOrUndefined_1.isNullOrUndefined(this._db))
            return this._db = await lowdb_1.default(new FileAsync_1.default(this._fileName));
        else
            return this._db;
    }
}
exports.Configurator = Configurator;
//# sourceMappingURL=configuration.js.map