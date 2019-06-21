import * as prayer from '../entities/prayer';
import * as location from '../entities/location';
import { ILocationConfig, IPrayersConfig } from "../configurators/inteface.configuration";
export interface IPrayerSettingsBuilder {
    setPrayerMethod(methodId: prayer.Methods): IPrayerSettingsBuilder;
    setPrayerSchool(schoolId: prayer.Schools): IPrayerSettingsBuilder;
    setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerSettingsBuilder;
    setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerSettingsBuilder;
    setPrayerAdjustmentMethod(adjustmentMethodId: prayer.AdjsutmentMethod): IPrayerSettingsBuilder;
    setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerSettingsBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder;
    createPrayerSettings(): Promise<prayer.IPrayersSettings>;
}
export interface ILocationBuilder {
    setLocationCoordinates(lat: number, lng: number): ILocationBuilder;
    setLocationAddress(address: string, countryCode?: string): ILocationBuilder;
    createLocation(): Promise<location.ILocationSettings>;
}
export interface IPrayerManager {
    getUpcomingPrayer(date?: Date, prayerType?: prayer.PrayerType): prayer.IPrayersTiming;
    getPreviousPrayer(): prayer.IPrayersTime;
    getUpcomingPrayerTimeRemaining(): Date;
    getPrviouesPrayerTimeElapsed(): Date;
    getPrayerTime(prayerName: prayer.PrayersName, prayerDate?: Date): prayer.IPrayersTiming;
    getPrayers(): prayer.IPrayers[];
    getPrayerConfig(): IPrayersConfig;
    getPrayerTimeZone(): location.ITimeZone;
    getPrayerLocation(): location.ILocation;
    getPrayerLocationSettings(): location.ILocationSettings;
    getPrayerStartPeriod(): Date;
    getPrayerEndPeriond(): Date;
    getPrayersByDate(date: Date): prayer.IPrayers;
    updatePrayersDate(startDate: Date, endDate: Date): Promise<IPrayerManager>;
    getLocationConfig(): ILocationConfig;
    getPrayerSettings(): prayer.IPrayersSettings;
    getPrayerAdjsutments(): prayer.IPrayerAdjustments[];
    getPrayerAdjustmentsByPrayer(prayerName: prayer.PrayersName): prayer.IPrayerAdjustments;
    savePrayerConfig(prayerConfig: IPrayersConfig): Promise<boolean>;
    saveLocationConfig(locationConfig: ILocationConfig): Promise<boolean>;
}
export interface IPrayerTimeBuilder {
    setPrayerMethod(methodId: prayer.Methods): IPrayerTimeBuilder;
    setPrayerSchool(schoolId: prayer.Schools): IPrayerTimeBuilder;
    setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerTimeBuilder;
    setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerTimeBuilder;
    setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerTimeBuilder;
    setPrayerAdjustmentMethod(adjustmentMethodId: prayer.AdjsutmentMethod): IPrayerTimeBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerTimeBuilder;
    setLocationByCoordinates(lat: number, lng: number): IPrayerTimeBuilder;
    setLocationByAddress(address: string, countryCode?: string): IPrayerTimeBuilder;
    createPrayerTimeManager(): Promise<IPrayerManager>;
    createPrayerTime(): Promise<prayer.IPrayersTime>;
}
