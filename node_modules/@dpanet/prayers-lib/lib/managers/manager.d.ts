import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as pp from '../providers/prayer-provider';
import * as lp from '../providers/location-provider';
import { ILocationConfig, IPrayersConfig } from "../configurators/inteface.configuration";
import { IPrayerManager, ILocationBuilder, IPrayerSettingsBuilder, IPrayerTimeBuilder } from "./interface.manager";
export declare class PrayerSettingsBuilder implements IPrayerSettingsBuilder {
    private _prayerSettings;
    private _prayerProvider;
    private _validtor;
    private constructor();
    setPrayerAdjustmentMethod(adjustmentMethodId: prayer.AdjsutmentMethod): IPrayerSettingsBuilder;
    setPrayerMethod(methodId: prayer.Methods): IPrayerSettingsBuilder;
    setPrayerSchool(schoolId: prayer.Schools): IPrayerSettingsBuilder;
    setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerSettingsBuilder;
    setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerSettingsBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder;
    setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerSettingsBuilder;
    createPrayerSettings(): Promise<prayer.IPrayersSettings>;
    static createPrayerSettingsBuilder(prayerConfig?: IPrayersConfig, prayerProvider?: pp.IPrayerProvider): IPrayerSettingsBuilder;
}
export declare class LocationBuilder implements ILocationBuilder {
    private _location;
    private _locationProvider;
    private _validtor;
    private constructor();
    setLocationCoordinates(lat: number, lng: number): ILocationBuilder;
    setLocationAddress(address: string, countryCode?: string): ILocationBuilder;
    createLocation(): Promise<location.ILocationSettings>;
    static createLocationBuilder(locationConfig?: ILocationConfig, ILocationProvider?: lp.ILocationProvider): LocationBuilder;
}
export declare class PrayerTimeBuilder implements IPrayerTimeBuilder {
    private _locationBuilder;
    private _prayerSettingsBuilder;
    private _prayers;
    private _prayerProvider;
    private constructor();
    setPrayerMethod(methodId: prayer.Methods): IPrayerTimeBuilder;
    setPrayerSchool(schoolId: prayer.Schools): IPrayerTimeBuilder;
    setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerTimeBuilder;
    setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerTimeBuilder;
    setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerTimeBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerTimeBuilder;
    setLocationByCoordinates(lat: number, lng: number): IPrayerTimeBuilder;
    setLocationByAddress(address: string, countryCode?: string): IPrayerTimeBuilder;
    setPrayerAdjustmentMethod(adjustmentMethodId: prayer.AdjsutmentMethod): IPrayerTimeBuilder;
    createPrayerTime(): Promise<prayer.IPrayersTime>;
    private adjustPrayers;
    private adjustServerPrayers;
    createPrayerTimeManager(): Promise<IPrayerManager>;
    static createPrayerTimeBuilder(locationConfig?: ILocationConfig, prayerConfig?: IPrayersConfig): PrayerTimeBuilder;
}
