import { ILocationSettings } from './location';
export declare enum PrayersName {
    IMSAK = "Imsak",
    FAJR = "Fajr",
    SUNRISE = "Sunrise",
    DHUHR = "Dhuhr",
    ASR = "Asr",
    MAGHRIB = "Maghrib",
    SUNSET = "Sunset",
    ISHA = "Isha",
    MIDNIGHT = "Midnight"
}
export declare enum Schools {
    Shafi = 0,
    Hanafi = 1
}
export declare enum MidnightMode {
    Standard = 0,
    Jafari = 1
}
export declare enum AdjsutmentMethod {
    Provider = 0,
    Server = 1,
    Client = 2
}
export declare enum LatitudeMethod {
    MidNight = 1,
    Seventh = 2,
    Angle = 3
}
export declare enum Methods {
    Shia = 0,
    Karachi = 1,
    America = 2,
    MuslimLeague = 3,
    Mecca = 4,
    Egypt = 5,
    Iran = 7,
    Gulf = 8,
    Kuwait = 9,
    Qatar = 10,
    Singapore = 11,
    France = 12,
    Turkey = 13,
    Custom = 99
}
export declare enum PrayerType {
    Fardh = "Fardh",
    Sunna = "Sunna"
}
export interface IPrayerType {
    prayerName: PrayersName;
    prayerType: PrayerType;
}
export declare const PrayersTypes: Array<IPrayerType>;
export interface IPrayersTiming {
    prayerName: PrayersName;
    prayerTime: Date;
}
export interface IPrayers {
    prayerTime: IPrayersTiming[];
    prayersDate: Date;
}
export interface IPrayerAdjustments {
    prayerName: PrayersName;
    adjustments: number;
}
export interface IPrayerAdjustmentMethod {
    id: AdjsutmentMethod;
    adjustmentMethod: string;
}
export interface IPrayerMidnight {
    id: MidnightMode;
    midnight: string;
}
export interface IPrayerLatitude {
    id: LatitudeMethod;
    latitudeMethod: string;
}
export interface IPrayersSettings {
    adjustments: IPrayerAdjustments[];
    method: IPrayerMethods;
    school: IPrayerSchools;
    midnight: IPrayerMidnight;
    latitudeAdjustment: IPrayerLatitude;
    adjustmentMethod: IPrayerAdjustmentMethod;
    startDate: Date;
    endDate: Date;
}
export interface IPrayerSchools {
    id: Schools;
    school: string;
}
export interface IPrayerMethods {
    id: Methods;
    methodName: string;
}
export interface IPrayersTime {
    location: ILocationSettings;
    pareyerSettings: IPrayersSettings;
    prayers: Array<IPrayers>;
}
export declare class PrayerAdjustment implements IPrayerAdjustments {
    private _prayerName;
    prayerName: PrayersName;
    private _adjustments;
    adjustments: number;
}
export declare class Prayers implements IPrayers {
    private _prayerTime;
    constructor();
    prayerTime: IPrayersTiming[];
    private _prayersDate;
    prayersDate: Date;
    toJSON(): IPrayers;
}
export declare class PrayersTime implements IPrayersTime {
    constructor(prayers: Array<IPrayers>, locationSettings: ILocationSettings, prayerConfig: IPrayersSettings);
    private _location;
    location: ILocationSettings;
    private _pareyerSettings;
    pareyerSettings: IPrayersSettings;
    private _prayers;
    prayers: IPrayers[];
}
export declare class PrayersSettings implements IPrayersSettings {
    private _adjustmentMethod;
    adjustmentMethod: IPrayerAdjustmentMethod;
    private _startDate;
    startDate: Date;
    private _endDate;
    endDate: Date;
    private _adjustments;
    adjustments: IPrayerAdjustments[];
    private _method;
    method: IPrayerMethods;
    private _school;
    school: IPrayerSchools;
    private _midnight;
    midnight: IPrayerMidnight;
    private _latitudeAdjustment;
    latitudeAdjustment: IPrayerLatitude;
    toJSON(): IPrayersSettings;
    private _prayersSettings;
    constructor(prayersSettings?: IPrayersSettings);
}
