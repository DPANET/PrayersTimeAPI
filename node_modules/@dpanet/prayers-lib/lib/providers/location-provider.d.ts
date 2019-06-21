import { ITimeZone, ILocation } from '../entities/location';
export declare enum LocationProviderName {
    GOOGLE = "Google",
    APPLE = "Apple",
    PRAYERTIME = "Prayer Time"
}
export interface ILocationProvider {
    getProviderName(): LocationProviderName;
    getLocationByCoordinates(lng: number, lat: number): Promise<ILocation>;
    getTimeZoneByCoordinates(lng: number, lat: number): Promise<ITimeZone>;
    getLocationByAddress(address: string, countryCode?: string): Promise<ILocation>;
}
declare abstract class LocationProvider implements ILocationProvider {
    private _providerName;
    constructor(providerName: LocationProviderName);
    getProviderName(): LocationProviderName;
    abstract getLocationByCoordinates(lat: number, lng: number): Promise<ILocation>;
    abstract getTimeZoneByCoordinates(lat: number, lng: number): Promise<ITimeZone>;
    abstract getLocationByAddress(address: string, countryCode?: string): Promise<ILocation>;
}
export declare class LocationProviderFactory {
    static createLocationProviderFactory(locationProviderName: LocationProviderName): LocationProvider;
}
export {};
