"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("nconf");
const to = require('await-to-js').default;
const ramda = require("ramda");
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
var LocationProviderName;
(function (LocationProviderName) {
    LocationProviderName["GOOGLE"] = "Google";
    LocationProviderName["APPLE"] = "Apple";
    LocationProviderName["PRAYERTIME"] = "Prayer Time";
})(LocationProviderName = exports.LocationProviderName || (exports.LocationProviderName = {}));
const LocationErrorMessages = {
    BAD_INPUT: 'Location input provided are not valid',
    NOT_FOUND: 'Location provided cannot be found, try again with different input',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to location provider, please try again after a while'
};
//add validation later as a seperate class
class LocationProvider {
    constructor(providerName) {
        this._providerName = providerName;
    }
    getProviderName() {
        return this._providerName;
    }
}
class GoogleLocationProvider extends LocationProvider {
    constructor() {
        super(LocationProviderName.GOOGLE);
        this._googleMapClient = require('@google/maps').createClient({
            key: config.get('GOOGLE_API_KEY'),
            Promise: Promise
        });
    }
    async getLocationByCoordinates(lat, lng) {
        let googleLocation, err;
        if (!isNullOrUndefined_1.isNullOrUndefined(lat) && !isNullOrUndefined_1.isNullOrUndefined(lng)) {
            [err, googleLocation] = await to(this._googleMapClient.reverseGeocode({
                latlng: [lat, lng],
                result_type: ['locality', 'country']
            }).asPromise());
            if (err)
                return Promise.reject(new Error(LocationErrorMessages.TIME_OUT));
            if (isNullOrUndefined_1.isNullOrUndefined(googleLocation))
                return Promise.reject(new Error(LocationErrorMessages.NOT_FOUND));
            this._location = this.parseLocation(googleLocation);
            return this._location;
        }
        else
            return Promise.reject(new Error(LocationErrorMessages.BAD_INPUT));
    }
    async getTimeZoneByCoordinates(lat, lng) {
        let googleTimeZone, err, timezoneObject;
        if (!isNullOrUndefined_1.isNullOrUndefined(lat) && !isNullOrUndefined_1.isNullOrUndefined(lng)) {
            [err, googleTimeZone] = await to(this._googleMapClient
                .timezone({ location: [lat, lng] })
                .asPromise());
            if (err)
                return Promise.reject(new Error(LocationErrorMessages.NOT_FOUND));
            timezoneObject = googleTimeZone.json;
            this._timeZone = {
                timeZoneId: timezoneObject.timeZoneId,
                timeZoneName: timezoneObject.timeZoneName,
                dstOffset: timezoneObject.dstOffset,
                rawOffset: timezoneObject.rawOffset
            };
            return this._timeZone;
        }
        else
            return Promise.reject(new Error(LocationErrorMessages.BAD_INPUT));
    }
    async getLocationByAddress(address, countryCode) {
        let locationinput = {
            address: address,
            components: { country: isNullOrUndefined_1.isNullOrUndefined(countryCode) ? "" : countryCode }
        };
        let googleLocation, err;
        if (!isNullOrUndefined_1.isNullOrUndefined(address)) {
            [err, googleLocation] = await to(this._googleMapClient.
                geocode(locationinput)
                .asPromise());
            if (err)
                return Promise.reject(new Error(LocationErrorMessages.TIME_OUT));
            if (isNullOrUndefined_1.isNullOrUndefined(googleLocation))
                return Promise.reject(new Error(LocationErrorMessages.NOT_FOUND));
            this._location = this.parseLocation(googleLocation);
            return this._location;
        }
        else
            return Promise.reject(new Error(LocationErrorMessages.BAD_INPUT));
    }
    parseLocation(googleLocation) {
        let locationCoordinates, locationAddress, locationCountry, locationCity;
        let filterbycountry = (n) => ramda.contains('country', n.types);
        let filterbyaddress = (n) => ramda.contains('locality', n.types);
        if (!isNullOrUndefined_1.isNullOrUndefined(googleLocation) && googleLocation.json.results.length > 0) {
            locationCoordinates = ramda.path(['results', '0', 'geometry', 'location'], googleLocation.json);
            locationCity = ramda.find(filterbyaddress)(googleLocation.json.results[0].address_components);
            locationCountry = ramda.find(filterbycountry)(googleLocation.json.results[0].address_components);
            locationAddress = googleLocation.json.results[0].formatted_address;
            if (isNullOrUndefined_1.isNullOrUndefined(locationCoordinates) || isNullOrUndefined_1.isNullOrUndefined(locationAddress) || isNullOrUndefined_1.isNullOrUndefined(locationCountry) || isNullOrUndefined_1.isNullOrUndefined(locationCity))
                throw new Error(LocationErrorMessages.BAD_RESULT);
            return {
                address: locationAddress,
                countryCode: locationCountry.short_name,
                countryName: locationCountry.long_name,
                latitude: locationCoordinates.lat,
                longtitude: locationCoordinates.lng,
                city: locationCity.long_name
            };
        }
        else
            throw new Error(LocationErrorMessages.NOT_FOUND);
    }
}
class LocationProviderFactory {
    static createLocationProviderFactory(locationProviderName) {
        switch (locationProviderName) {
            case LocationProviderName.GOOGLE:
                return new GoogleLocationProvider();
                break;
        }
    }
}
exports.LocationProviderFactory = LocationProviderFactory;
//# sourceMappingURL=location-provider.js.map