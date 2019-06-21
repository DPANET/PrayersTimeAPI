export declare enum LocationTypeName {
    LocationBuilder = "Location Builder"
}
export interface ILocation {
    latitude?: number;
    longtitude?: number;
    city?: string;
    countryCode?: string;
    countryName?: string;
    address?: string;
}
export interface ITimeZone {
    timeZoneId?: string;
    timeZoneName?: string;
    dstOffset?: number;
    rawOffset?: number;
}
export interface ILocationSettings extends ILocation, ITimeZone {
}
export declare class Location implements ILocationSettings {
    private _latitude?;
    private _longtitude?;
    private _countryCode?;
    private _city?;
    private _countryName?;
    private _address?;
    private _timeZoneId?;
    private _timeZoneName?;
    private _dstOffset?;
    private _rawOffset?;
    constructor(location?: ILocation, timeZone?: ITimeZone);
    latitude: number;
    longtitude: number;
    city: string;
    countryCode: string;
    countryName: string;
    address: string;
    timeZoneId: string;
    timeZoneName: string;
    rawOffset: number;
    dstOffset: number;
}
