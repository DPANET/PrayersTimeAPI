import * as prayers from '../entities/prayer';
export interface IPrayersConfig {
    method: prayers.Methods;
    midnight: prayers.MidnightMode;
    school: prayers.Schools;
    latitudeAdjustment: prayers.LatitudeMethod;
    adjustmentMethod: prayers.AdjsutmentMethod;
    startDate: Date;
    endDate: Date;
    adjustments: prayers.IPrayerAdjustments[];
}
export interface ILocationConfig {
    location: {
        latitude?: number;
        longtitude?: number;
        city?: string;
        countryCode?: string;
        countryName?: string;
        address?: string;
    };
    timezone: {
        timeZoneId?: string;
        timeZoneName?: string;
        dstOffset?: number;
        rawOffset?: number;
    };
}
export interface IConfig {
    getPrayerConfig(): Promise<IPrayersConfig>;
    savePrayerConfig(prayerConfigs: IPrayersConfig): Promise<boolean>;
    getLocationConfig(): Promise<ILocationConfig>;
    saveLocationConfig(locationConfig: ILocationConfig): Promise<boolean>;
}
