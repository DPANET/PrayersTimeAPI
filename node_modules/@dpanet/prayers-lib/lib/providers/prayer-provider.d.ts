import { IPrayerLatitude, IPrayerMethods, IPrayerSchools, IPrayersSettings, IPrayers, IPrayerMidnight, IPrayerAdjustmentMethod } from '../entities/prayer';
import { ILocationSettings } from '../entities/location';
export declare enum PrayerProviderName {
    PRAYER_TIME = "Prayer Time"
}
export interface IPrayerProvider {
    getProviderName(): PrayerProviderName;
    getPrayerLatitude(): Promise<Array<IPrayerLatitude>>;
    getPrayerLatitudeById(index: number): Promise<IPrayerLatitude>;
    getPrayerMethods(): Promise<Array<IPrayerMethods>>;
    getPrayerMethodsById(index: number): Promise<IPrayerMethods>;
    getPrayerSchools(): Promise<Array<IPrayerSchools>>;
    getPrayerSchoolsById(index: number): Promise<IPrayerSchools>;
    getPrayerMidnight(): Promise<Array<IPrayerMidnight>>;
    getPrayerMidnightById(index: number): Promise<IPrayerMidnight>;
    getPrayerAdjustmentMethod(): Promise<IPrayerAdjustmentMethod[]>;
    getPrayerAdjustmentMethodById(index: number): Promise<IPrayerAdjustmentMethod>;
    getPrayerTime(prayerSettings: IPrayersSettings, prayerLocation: ILocationSettings): Promise<Array<IPrayers>>;
}
declare abstract class PrayerProvider implements IPrayerProvider {
    private _providerName;
    constructor(providerName: PrayerProviderName);
    getProviderName(): PrayerProviderName;
    abstract getPrayerAdjustmentMethod(): Promise<IPrayerAdjustmentMethod[]>;
    abstract getPrayerAdjustmentMethodById(index: number): Promise<IPrayerAdjustmentMethod>;
    abstract getPrayerLatitude(): Promise<Array<IPrayerLatitude>>;
    abstract getPrayerLatitudeById(index: number): Promise<IPrayerLatitude>;
    abstract getPrayerMethods(): Promise<IPrayerMethods[]>;
    abstract getPrayerMethodsById(index: number): Promise<IPrayerMethods>;
    abstract getPrayerSchools(): Promise<Array<IPrayerSchools>>;
    abstract getPrayerSchoolsById(index: number): Promise<IPrayerSchools>;
    abstract getPrayerMidnight(): Promise<Array<IPrayerMidnight>>;
    abstract getPrayerMidnightById(index: number): Promise<IPrayerMidnight>;
    abstract getPrayerTime(prayerSettings: IPrayersSettings, prayerLocation: ILocationSettings): Promise<Array<IPrayers>>;
}
export declare class PrayerProviderFactory {
    static createPrayerProviderFactory(prayerProviderName: PrayerProviderName): PrayerProvider;
}
export {};
