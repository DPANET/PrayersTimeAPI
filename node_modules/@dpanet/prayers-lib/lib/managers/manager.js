"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const to = require('await-to-js').default;
const ramda = require("ramda");
const location = __importStar(require("../entities/location"));
const prayer = __importStar(require("../entities/prayer"));
const pp = __importStar(require("../providers/prayer-provider"));
const lp = __importStar(require("../providers/location-provider"));
const configuration_1 = require("../configurators/configuration");
const validator_1 = require("../validators/validator");
//import validators = val.validators;
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
const utility_1 = require("../util/utility");
class PrayerSettingsBuilder {
    constructor(prayerProvider, validator, prayerConfig) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new prayer.PrayersSettings();
        if (!isNullOrUndefined_1.isNullOrUndefined(prayerConfig)) {
            this._prayerSettings.midnight.id = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.midnight) ? prayer.MidnightMode.Standard : prayerConfig.midnight;
            this._prayerSettings.method.id = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.method) ? prayer.Methods.Mecca : prayerConfig.method;
            this._prayerSettings.adjustments = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
            this._prayerSettings.school.id = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.school) ? prayer.Schools.Shafi : prayerConfig.school;
            this._prayerSettings.latitudeAdjustment.id = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.latitudeAdjustment) ? prayer.LatitudeMethod.Angle : prayerConfig.latitudeAdjustment;
            this._prayerSettings.startDate = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.startDate) ? utility_1.DateUtil.getNowDate() : prayerConfig.startDate;
            this._prayerSettings.endDate = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.endDate) ? utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate()) : prayerConfig.endDate;
            this._prayerSettings.adjustmentMethod.id = isNullOrUndefined_1.isNullOrUndefined(prayerConfig.adjustmentMethod) ? prayer.AdjsutmentMethod.Server : prayerConfig.adjustmentMethod;
        }
        else {
            this._prayerSettings.midnight.id = prayer.MidnightMode.Standard;
            this._prayerSettings.method.id = prayer.Methods.Mecca;
            this._prayerSettings.adjustments = this._prayerSettings.adjustments;
            this._prayerSettings.school.id = prayer.Schools.Shafi;
            this._prayerSettings.adjustmentMethod.id = prayer.AdjsutmentMethod.Server;
            this._prayerSettings.latitudeAdjustment.id = prayer.LatitudeMethod.Angle;
            this._prayerSettings.startDate = utility_1.DateUtil.getNowDate();
            this._prayerSettings.endDate = utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate());
        }
    }
    setPrayerAdjustmentMethod(adjustmentMethodId) {
        this._prayerSettings.adjustmentMethod.id = adjustmentMethodId;
        return this;
    }
    setPrayerMethod(methodId) {
        this._prayerSettings.method.id = methodId;
        return this;
    }
    setPrayerSchool(schoolId) {
        this._prayerSettings.school.id = schoolId;
        return this;
    }
    setPrayerAdjustments(adjustments) {
        this._prayerSettings.adjustments = adjustments;
        return this;
    }
    setPrayerMidnight(midnightId) {
        this._prayerSettings.midnight.id = midnightId;
        return this;
    }
    setPrayerPeriod(startDate, endDate) {
        this._prayerSettings.startDate = utility_1.DateUtil.getStartOfDay(startDate);
        this._prayerSettings.endDate = endDate;
        return this;
    }
    setPrayerLatitudeAdjustment(latitudeAdjustment) {
        this._prayerSettings.latitudeAdjustment.id = latitudeAdjustment;
        return this;
    }
    async createPrayerSettings() {
        let validationErr;
        let validationResult = false;
        validationResult = this._validtor.validate(this._prayerSettings);
        if (validationResult === false)
            return Promise.reject(this._validtor.getValidationError());
        if (validationResult) {
            try {
                this._prayerSettings.method = await this._prayerProvider.getPrayerMethodsById(this._prayerSettings.method.id);
                this._prayerSettings.latitudeAdjustment = await this._prayerProvider.getPrayerLatitudeById(this._prayerSettings.latitudeAdjustment.id);
                this._prayerSettings.midnight = await this._prayerProvider.getPrayerMidnightById(this._prayerSettings.midnight.id);
                this._prayerSettings.school = await this._prayerProvider.getPrayerSchoolsById(this._prayerSettings.school.id);
                this._prayerSettings.adjustmentMethod = await this._prayerProvider.getPrayerAdjustmentMethodById(this._prayerSettings.adjustmentMethod.id);
                return this._prayerSettings;
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
    }
    static createPrayerSettingsBuilder(prayerConfig, prayerProvider) {
        let prayerProviderName = pp.PrayerProviderFactory
            .createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let validate = validator_1.PrayerSettingsValidator.createValidator();
        return new PrayerSettingsBuilder(prayerProviderName, validate, prayerConfig);
    }
}
exports.PrayerSettingsBuilder = PrayerSettingsBuilder;
;
class LocationBuilder {
    constructor(locationProvider, validator, locationConfig) {
        this._locationProvider = locationProvider;
        this._validtor = validator;
        this._location = new location.Location();
        if (!isNullOrUndefined_1.isNullOrUndefined(locationConfig)) {
            this._location.latitude = isNullOrUndefined_1.isNullOrUndefined(locationConfig.location.latitude) ? null : locationConfig.location.latitude;
            this._location.longtitude = isNullOrUndefined_1.isNullOrUndefined(locationConfig.location.longtitude) ? null : locationConfig.location.longtitude;
            this._location.countryCode = isNullOrUndefined_1.isNullOrUndefined(locationConfig.location.countryCode) ? null : locationConfig.location.countryCode;
            this._location.countryName = isNullOrUndefined_1.isNullOrUndefined(locationConfig.location.countryName) ? null : locationConfig.location.countryName;
            this._location.address = isNullOrUndefined_1.isNullOrUndefined(locationConfig.location.address) ? null : locationConfig.location.address;
            this._location.city = isNullOrUndefined_1.isNullOrUndefined(locationConfig.location.city) ? null : locationConfig.location.city;
            this._location.timeZoneId = isNullOrUndefined_1.isNullOrUndefined(locationConfig.timezone.timeZoneId) ? null : locationConfig.timezone.timeZoneId;
            this._location.timeZoneName = isNullOrUndefined_1.isNullOrUndefined(locationConfig.timezone.timeZoneName) ? null : locationConfig.timezone.timeZoneName;
            this._location.rawOffset = isNullOrUndefined_1.isNullOrUndefined(locationConfig.timezone.rawOffset) ? null : locationConfig.timezone.rawOffset;
            this._location.dstOffset = isNullOrUndefined_1.isNullOrUndefined(locationConfig.timezone.dstOffset) ? null : locationConfig.timezone.dstOffset;
        }
    }
    setLocationCoordinates(lat, lng) {
        this._location.latitude = lat;
        this._location.longtitude = lng;
        return this;
    }
    setLocationAddress(address, countryCode) {
        this._location.countryCode = countryCode;
        this._location.address = address;
        return this;
    }
    async createLocation() {
        let validationErr, validationResult = false;
        let providerErr, locationResult, timezoneResult;
        validationResult = this._validtor.validate(this._location);
        if (validationResult === false)
            return Promise.reject(this._validtor.getValidationError());
        if (!isNullOrUndefined_1.isNullOrUndefined(this._location.latitude))
            [providerErr, locationResult] = await to(this._locationProvider.getLocationByCoordinates(this._location.latitude, this._location.longtitude));
        else if ((!isNullOrUndefined_1.isNullOrUndefined(this._location.address)))
            [providerErr, locationResult] = await to(this._locationProvider.getLocationByAddress(this._location.address, this._location.countryCode));
        if (providerErr)
            return Promise.reject(providerErr);
        [providerErr, timezoneResult] = await to(this._locationProvider.getTimeZoneByCoordinates(locationResult.latitude, locationResult.longtitude));
        if (providerErr)
            return Promise.reject(providerErr);
        this._location = ramda.mergeWith(ramda.concat, locationResult, timezoneResult);
        return Promise.resolve(this._location);
    }
    static createLocationBuilder(locationConfig, ILocationProvider) {
        let providerName = lp.LocationProviderFactory.
            createLocationProviderFactory(lp.LocationProviderName.GOOGLE);
        let validate = validator_1.LocationValidator.createValidator();
        return new LocationBuilder(providerName, validate, locationConfig);
    }
}
exports.LocationBuilder = LocationBuilder;
;
class PrayerTimeBuilder {
    constructor(prayerProvider, locationBuilder, prayerSettingsBuilder) {
        this._prayerSettingsBuilder = prayerSettingsBuilder;
        this._locationBuilder = locationBuilder;
        this._prayerProvider = prayerProvider;
        this._prayers = new Array();
    }
    setPrayerMethod(methodId) {
        this._prayerSettingsBuilder.setPrayerMethod(methodId);
        return this;
    }
    setPrayerSchool(schoolId) {
        this._prayerSettingsBuilder.setPrayerSchool(schoolId);
        return this;
    }
    setPrayerAdjustments(adjustments) {
        this._prayerSettingsBuilder.setPrayerAdjustments(adjustments);
        return this;
    }
    setPrayerMidnight(midnightId) {
        this._prayerSettingsBuilder.setPrayerMidnight(midnightId);
        return this;
    }
    setPrayerLatitudeAdjustment(latitudeAdjustment) {
        this._prayerSettingsBuilder.setPrayerLatitudeAdjustment(latitudeAdjustment);
        return this;
    }
    setPrayerPeriod(startDate, endDate) {
        this._prayerSettingsBuilder.setPrayerPeriod(startDate, endDate);
        return this;
    }
    setLocationByCoordinates(lat, lng) {
        this._locationBuilder.setLocationCoordinates(lat, lng);
        return this;
    }
    setLocationByAddress(address, countryCode) {
        this._locationBuilder.setLocationAddress(address, countryCode);
        return this;
    }
    setPrayerAdjustmentMethod(adjustmentMethodId) {
        this._prayerSettingsBuilder.setPrayerAdjustmentMethod(adjustmentMethodId);
        return this;
    }
    async createPrayerTime() {
        let location, prayerSettings;
        try {
            // location = await this._locationBuilder.createLocation();
            // prayerSettings = await this._prayerSettingsBuilder.createPrayerSettings()
            await Promise.all([this._locationBuilder.createLocation(), this._prayerSettingsBuilder.createPrayerSettings()])
                .then((result) => {
                location = result[0];
                prayerSettings = result[1];
            });
            this._prayers = await this._prayerProvider.getPrayerTime(prayerSettings, location);
            this._prayers = await this.adjustPrayers(this._prayers, prayerSettings);
            return Promise.resolve(new prayer.PrayersTime(this._prayers, location, prayerSettings));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    adjustPrayers(prayers, prayerSettings) {
        //  let adjustTimingFN = ramda.find<>(n => n.prayerName === prayerName, this.getPrayerAdjsutments());
        //console.log(prayers);
        switch (prayerSettings.adjustmentMethod.id) {
            case prayer.AdjsutmentMethod.Provider:
                break;
            case prayer.AdjsutmentMethod.Server:
            case prayer.AdjsutmentMethod.Client:
                prayers = this.adjustServerPrayers(prayers, prayerSettings);
                break;
        }
        return prayers;
    }
    adjustServerPrayers(prayers, prayerSettings) {
        var prayerName = ramda.prop('prayerName');
        var prayerTime = ramda.lensProp('prayerTime');
        var indexedByAdjustment = ramda.indexBy(prayerName, prayerSettings.adjustments);
        var indexByPrayerTime = (value) => ramda.indexBy(prayerName, value.prayerTime);
        var defaultPrayersAdjustments = (o) => ramda.set(prayerTime, ramda.map(ramda.assoc('adjustments', 0), o.prayerTime), o);
        var lensPrayers = (prayerTimeObject) => ramda.set(prayerTime, indexByPrayerTime(prayerTimeObject), prayerTimeObject);
        var mergePrayerAdjustment = (prayerTimeObject) => ramda.set(prayerTime, ramda.values(ramda.mergeDeepRight(prayerTimeObject.prayerTime, indexedByAdjustment)), prayerTimeObject);
        var addObject = (o) => ramda.set(prayerTime, utility_1.DateUtil.addMinutes(o.prayerTime, o.adjustments), o);
        var pluckObject = ramda.dissoc('adjustments');
        var addPrayerAdjustment = (prayerTimeObject) => ramda.set(prayerTime, ramda.map(ramda.pipe(addObject, pluckObject), prayerTimeObject.prayerTime), prayerTimeObject);
        return ramda.map(ramda.pipe(defaultPrayersAdjustments, lensPrayers, mergePrayerAdjustment, addPrayerAdjustment), prayers);
    }
    async createPrayerTimeManager() {
        try {
            let prayersTime = await this.createPrayerTime();
            let prayerManager = new PrayerManager(prayersTime, this);
            return Promise.resolve(prayerManager);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    static createPrayerTimeBuilder(locationConfig, prayerConfig) {
        let prayerProvider = pp.PrayerProviderFactory.createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let locationBuilder = LocationBuilder
            .createLocationBuilder(isNullOrUndefined_1.isNullOrUndefined(locationConfig) ? null : locationConfig);
        let prayerSettingsBuilder = PrayerSettingsBuilder
            .createPrayerSettingsBuilder(isNullOrUndefined_1.isNullOrUndefined(prayerConfig) ? null : prayerConfig);
        return new PrayerTimeBuilder(prayerProvider, locationBuilder, prayerSettingsBuilder);
    }
}
exports.PrayerTimeBuilder = PrayerTimeBuilder;
;
class PrayerManager {
    // private _prayerEvents: prayer.PrayerEvents;
    constructor(prayerTime, prayerTimeBuilder) {
        this._prayerTime = prayerTime;
        //   this._prayerEvents = new prayer.PrayerEvents();
        this._prayerTimeBuilder = prayerTimeBuilder;
    }
    async savePrayerConfig(prayerConfig) {
        try {
            let validator = validator_1.PrayerConfigValidator.createValidator();
            let validationResult = validator.validate(prayerConfig);
            let validationErr;
            if (validationResult === false)
                return Promise.reject(validator.getValidationError());
            let configurator = new configuration_1.Configurator();
            await configurator.savePrayerConfig(prayerConfig);
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async saveLocationConfig(locationConfig) {
        try {
            let validator = validator_1.LocationConfigValidator.createValidator();
            let validationResult = validator.validate(locationConfig);
            let validationErr;
            if (validationResult === false)
                return Promise.reject(validator.getValidationError());
            let configurator = new configuration_1.Configurator();
            await configurator.saveLocationConfig(locationConfig);
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    getPrayerTimeZone() {
        return {
            timeZoneId: this._prayerTime.location.timeZoneId,
            timeZoneName: this._prayerTime.location.timeZoneName,
            dstOffset: this._prayerTime.location.dstOffset,
            rawOffset: this._prayerTime.location.rawOffset
        };
    }
    getPrayerLocation() {
        return {
            latitude: this._prayerTime.location.latitude,
            longtitude: this._prayerTime.location.longtitude,
            city: this._prayerTime.location.city,
            countryCode: this._prayerTime.location.countryCode,
            countryName: this._prayerTime.location.countryName,
            address: this._prayerTime.location.address
        };
    }
    getPrayerLocationSettings() {
        return {
            latitude: this._prayerTime.location.latitude,
            longtitude: this._prayerTime.location.longtitude,
            city: this._prayerTime.location.city,
            countryCode: this._prayerTime.location.countryCode,
            countryName: this._prayerTime.location.countryName,
            address: this._prayerTime.location.address,
            timeZoneId: this._prayerTime.location.timeZoneId,
            timeZoneName: this._prayerTime.location.timeZoneName,
            dstOffset: this._prayerTime.location.dstOffset,
            rawOffset: this._prayerTime.location.rawOffset
        };
    }
    getPrayerStartPeriod() {
        return this._prayerTime.pareyerSettings.startDate;
    }
    getPrayerEndPeriond() {
        return utility_1.DateUtil.getEndofDate(this._prayerTime.pareyerSettings.endDate);
    }
    getUpcomingPrayerTimeRemaining() {
        throw new Error("Method not implemented.");
    }
    getPrviouesPrayerTimeElapsed() {
        throw new Error("Method not implemented.");
    }
    getPrayerConfig() {
        return {
            method: this._prayerTime.pareyerSettings.method.id,
            midnight: this._prayerTime.pareyerSettings.midnight.id,
            school: this._prayerTime.pareyerSettings.school.id,
            latitudeAdjustment: this._prayerTime.pareyerSettings.latitudeAdjustment.id,
            adjustmentMethod: this._prayerTime.pareyerSettings.adjustmentMethod.id,
            startDate: this.getPrayerStartPeriod(),
            endDate: this.getPrayerEndPeriond(),
            adjustments: this._prayerTime.pareyerSettings.adjustments
        };
    }
    getLocationConfig() {
        return {
            location: {
                latitude: this._prayerTime.location.latitude,
                longtitude: this._prayerTime.location.longtitude,
                city: this._prayerTime.location.city,
                countryCode: this._prayerTime.location.countryCode,
                countryName: this._prayerTime.location.countryName,
                address: this._prayerTime.location.address
            },
            timezone: {
                timeZoneId: this._prayerTime.location.timeZoneId,
                timeZoneName: this._prayerTime.location.timeZoneName,
                dstOffset: this._prayerTime.location.dstOffset,
                rawOffset: this._prayerTime.location.rawOffset
            }
        };
    }
    getPrayerTime(prayerName, prayerDate) {
        let prayersByDate = this.getPrayersByDate(prayerDate);
        if (!isNullOrUndefined_1.isNullOrUndefined(prayersByDate)) {
            return ramda.find(n => n.prayerName === prayerName, prayersByDate.prayerTime);
        }
        return null;
    }
    getPrayersByDate(date) {
        let fnDayMatch = (n) => utility_1.DateUtil.dayMatch(date, n.prayersDate);
        return ramda.find(fnDayMatch, this._prayerTime.prayers);
    }
    getUpcomingPrayer(date, prayerType) {
        let dateNow;
        if (isNullOrUndefined_1.isNullOrUndefined(date))
            dateNow = utility_1.DateUtil.getNowTime();
        else
            dateNow = date;
        if (dateNow > this.getPrayerEndPeriond() || dateNow < this.getPrayerStartPeriod())
            return null;
        let orderByFn = ramda.sortBy(ramda.prop('prayerTime'));
        let upcomingPrayer = null;
        let fardhPrayers = prayer.PrayersTypes.filter((n) => n.prayerType === prayer.PrayerType.Fardh);
        let todayPrayers = this.getPrayersByDate(dateNow);
        if (!isNullOrUndefined_1.isNullOrUndefined(todayPrayers)) {
            let listOfPrayers = orderByFn(todayPrayers.prayerTime);
            //filter on fardh prayers.
            listOfPrayers = ramda.innerJoin((prayerLeft, prayerRight) => prayerLeft.prayerName === prayerRight.prayerName, listOfPrayers, fardhPrayers);
            //find next prayer based on prayertype
            for (let i = 0, prev, curr; i < listOfPrayers.length; i++) {
                prev = listOfPrayers[i], curr = listOfPrayers[i + 1];
                upcomingPrayer = this.processUpcomingPrayer(prev, curr, i + 1, listOfPrayers, dateNow);
                if (!isNullOrUndefined_1.isNullOrUndefined(upcomingPrayer))
                    return upcomingPrayer;
            }
        }
        return upcomingPrayer;
    }
    processUpcomingPrayer(prev, curr, index, array, dateNow) {
        if (prev.prayerTime >= dateNow)
            return array[index - 1];
        else if (!isNullOrUndefined_1.isNullOrUndefined(curr) && prev.prayerTime <= dateNow && curr.prayerTime >= dateNow)
            return array[index];
        else if (isNullOrUndefined_1.isNullOrUndefined(curr) && array.length === index) {
            let nextDay = utility_1.DateUtil.addDay(1, dateNow);
            if (nextDay > this.getPrayerEndPeriond())
                return null;
            return this.getPrayerTime(prayer.PrayersName.FAJR, nextDay);
        }
        return null;
    }
    getPreviousPrayer() {
        return;
    }
    async updatePrayersDate(startDate, endDate) {
        try {
            this._prayerTime = await this._prayerTimeBuilder
                .setPrayerPeriod(startDate, endDate)
                .createPrayerTime();
            return this;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    getPrayerSettings() {
        return this._prayerTime.pareyerSettings;
    }
    getPrayerAdjsutments() {
        return this._prayerTime.pareyerSettings.adjustments;
    }
    getPrayerAdjustmentsByPrayer(prayerName) {
        return ramda.find(n => n.prayerName === prayerName, this.getPrayerAdjsutments());
    }
    getPrayers() {
        return this._prayerTime.prayers;
    }
}
//# sourceMappingURL=manager.js.map